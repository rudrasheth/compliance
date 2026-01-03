import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../../server/models/User.js';
import AuditLog from '../../server/models/AuditLog.js';
import { sendWelcomeEmail } from '../../server/config/email.js';
import { connectDB } from '../../server/config/database.js';

const validateVerification = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await connectDB();

    // Validate input
    await Promise.all(validateVerification.map(validation => validation.run(req)));
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, otp } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Check OTP
    if (user.emailVerificationOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check OTP expiration
    if (user.emailVerificationExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify email
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.firstName);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create audit log
    await AuditLog.create({
      user: user.email,
      action: 'EMAIL_VERIFIED',
      entity: `Email verification: ${user.firstName} ${user.lastName}`,
      entityId: user._id,
      entityType: 'User',
      status: 'success'
    });

    // Return user data
    const userData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      company: user.company,
      gstin: user.gstin,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        token,
        user: userData
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    
    try {
      await AuditLog.create({
        user: req.body.email || 'unknown',
        action: 'EMAIL_VERIFIED',
        entity: 'Email verification failed',
        entityType: 'User',
        status: 'failed',
        details: error.message
      });
    } catch (auditError) {
      console.error('Failed to create audit log:', auditError);
    }

    res.status(500).json({
      success: false,
      message: 'Email verification failed',
      error: error.message
    });
  }
}