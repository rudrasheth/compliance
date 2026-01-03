import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import User from '../../server/models/User.js';
import AuditLog from '../../server/models/AuditLog.js';
import { sendWelcomeEmail, sendOTPEmail } from '../../server/config/email.js';
import { connectDB } from '../../server/config/database.js';

// Validation middleware
const validateRegistration = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Connect to database
    await connectDB();

    // Validate input
    await Promise.all(validateRegistration.map(validation => validation.run(req)));
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, password, company, gstin } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      company,
      gstin,
      emailVerificationOTP: otp,
      emailVerificationExpires: otpExpires,
      isEmailVerified: false,
      role: 'user'
    });

    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Don't fail registration if email fails
    }

    // Create audit log
    await AuditLog.create({
      user: email,
      action: 'REGISTERED',
      entity: `User registration: ${firstName} ${lastName}`,
      entityId: user._id,
      entityType: 'User',
      status: 'success'
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification code.',
      data: {
        userId: user._id,
        email: user.email,
        requiresVerification: true
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Create audit log for failed registration
    try {
      await AuditLog.create({
        user: req.body.email || 'unknown',
        action: 'REGISTERED',
        entity: 'User registration failed',
        entityType: 'User',
        status: 'failed',
        details: error.message
      });
    } catch (auditError) {
      console.error('Failed to create audit log:', auditError);
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
}