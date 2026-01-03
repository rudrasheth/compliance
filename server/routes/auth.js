import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { sendEmail, emailTemplates } from '../config/email.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register new user
router.post('/register', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('company').optional().trim(),
  body('gstin').optional().trim()
], async (req, res) => {
  try {
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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      company,
      gstin
    });

    // Generate email verification token
    const verificationToken = user.createEmailVerificationToken();
    await user.save();

    // Generate OTP for immediate verification
    const otp = generateOTP();
    user.emailVerificationToken = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');
    user.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send welcome email with OTP
    try {
      await sendEmail(email, emailTemplates.otpVerification(firstName, otp));
      console.log(`📧 OTP sent to ${email}: ${otp}`);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue with registration even if email fails
    }

    // Create audit log
    await AuditLog.create({
      user: email,
      action: 'REGISTERED',
      entity: `User: ${firstName} ${lastName}`,
      entityId: user._id,
      entityType: 'User',
      status: 'success',
      details: 'New user registration'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for verification code.',
      data: {
        userId: user._id,
        email: user.email,
        requiresVerification: true
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Verify email with OTP
router.post('/verify-email', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, otp } = req.body;

    // Hash the provided OTP
    const hashedOTP = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    // Find user with matching email and OTP
    const user = await User.findOne({
      email,
      emailVerificationToken: hashedOTP,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    // Verify the user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Send welcome email
    try {
      await sendEmail(email, emailTemplates.welcome(user.firstName, user.lastName));
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Create audit log
    await AuditLog.create({
      user: email,
      action: 'VERIFIED',
      entity: `Email verification for ${user.firstName} ${user.lastName}`,
      entityId: user._id,
      entityType: 'User',
      status: 'success'
    });

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        token,
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed',
      error: error.message
    });
  }
});

// Resend verification OTP
router.post('/resend-otp', [
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    user.emailVerificationToken = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');
    user.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send OTP email
    await sendEmail(email, emailTemplates.otpVerification(user.firstName, otp));

    res.json({
      success: true,
      message: 'Verification code sent successfully'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification code',
      error: error.message
    });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      // Generate new OTP for unverified users
      const otp = generateOTP();
      user.emailVerificationToken = crypto
        .createHash('sha256')
        .update(otp)
        .digest('hex');
      user.emailVerificationExpires = Date.now() + 10 * 60 * 1000;
      await user.save();

      // Send OTP
      try {
        await sendEmail(email, emailTemplates.otpVerification(user.firstName, otp));
      } catch (emailError) {
        console.error('Failed to send OTP:', emailError);
      }

      return res.status(403).json({
        success: false,
        message: 'Please verify your email address. A new verification code has been sent.',
        requiresVerification: true,
        email: user.email
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Create audit log
    await AuditLog.create({
      user: email,
      action: 'LOGIN',
      entity: `User login: ${user.firstName} ${user.lastName}`,
      entityId: user._id,
      entityType: 'User',
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Forgot password
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save();

    // Send password reset email
    try {
      await sendEmail(email, emailTemplates.passwordReset(user.firstName, resetToken));
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      
      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email. Please try again.'
      });
    }

    // Create audit log
    await AuditLog.create({
      user: email,
      action: 'PASSWORD_RESET_REQUESTED',
      entity: `Password reset for ${user.firstName} ${user.lastName}`,
      entityId: user._id,
      entityType: 'User',
      status: 'success',
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Password reset link has been sent to your email address.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request',
      error: error.message
    });
  }
});

// Reset password
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { token, password } = req.body;

    // Hash the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Create audit log
    await AuditLog.create({
      user: user.email,
      action: 'PASSWORD_RESET',
      entity: `Password reset completed for ${user.firstName} ${user.lastName}`,
      entityId: user._id,
      entityType: 'User',
      status: 'success',
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message
    });
  }
});

// Get current user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', authenticate, [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('company').optional().trim(),
  body('gstin').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { firstName, lastName, company, gstin } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (company !== undefined) user.company = company;
    if (gstin !== undefined) user.gstin = gstin;
    
    await user.save();

    // Create audit log
    await AuditLog.create({
      user: user.email,
      action: 'PROFILE_UPDATED',
      entity: `Profile update for ${user.firstName} ${user.lastName}`,
      entityId: user._id,
      entityType: 'User',
      status: 'success'
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user.toJSON()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Change password
router.post('/change-password', authenticate, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id).select('+password');
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Create audit log
    await AuditLog.create({
      user: user.email,
      action: 'PASSWORD_CHANGED',
      entity: `Password change for ${user.firstName} ${user.lastName}`,
      entityId: user._id,
      entityType: 'User',
      status: 'success',
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
});

// Logout (client-side token removal, but log the action)
router.post('/logout', authenticate, async (req, res) => {
  try {
    // Create audit log
    await AuditLog.create({
      user: req.user.email,
      action: 'LOGOUT',
      entity: `User logout: ${req.user.firstName} ${req.user.lastName}`,
      entityId: req.user._id,
      entityType: 'User',
      status: 'success',
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
});

export default router;