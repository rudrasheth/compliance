import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('📧 Email service ready');
  }
});

// Email templates
export const emailTemplates = {
  welcome: (firstName, lastName) => ({
    subject: 'Welcome to ComplianceOS - Your Account is Ready!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ComplianceOS</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #00d4aa; }
          .logo { font-size: 28px; font-weight: bold; color: #00d4aa; }
          .content { padding: 30px 0; }
          .welcome-text { font-size: 18px; margin-bottom: 20px; }
          .features { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .feature-item { margin: 10px 0; padding-left: 20px; position: relative; }
          .feature-item:before { content: "✓"; position: absolute; left: 0; color: #00d4aa; font-weight: bold; }
          .cta-button { display: inline-block; background: #00d4aa; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ComplianceOS</div>
            <p>Professional Compliance Management System</p>
          </div>
          
          <div class="content">
            <h2>Welcome aboard, ${firstName} ${lastName}! 🎉</h2>
            
            <p class="welcome-text">
              Thank you for joining ComplianceOS. Your account has been successfully created and you're now ready to streamline your compliance management process.
            </p>
            
            <div class="features">
              <h3>What you can do with ComplianceOS:</h3>
              <div class="feature-item">Track and manage all your tax filings and compliance documents</div>
              <div class="feature-item">Monitor compliance deadlines with automated reminders</div>
              <div class="feature-item">Visualize your compliance health with real-time dashboards</div>
              <div class="feature-item">Maintain complete audit trails of all activities</div>
              <div class="feature-item">Collaborate with your team on compliance workflows</div>
            </div>
            
            <p>
              <strong>Getting Started:</strong><br>
              Log in to your dashboard to begin setting up your compliance workflows. You can add your first filing, configure notifications, and explore all the features we've built to make compliance management effortless.
            </p>
            
            <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}" class="cta-button">
              Access Your Dashboard
            </a>
            
            <p>
              If you have any questions or need assistance, our support team is here to help. Simply reply to this email or contact us through the application.
            </p>
          </div>
          
          <div class="footer">
            <p>
              <strong>ComplianceOS Team</strong><br>
              Making compliance management simple and efficient
            </p>
            <p>
              This email was sent to you because you created an account with ComplianceOS.<br>
              If you didn't create this account, please contact our support team immediately.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  passwordReset: (firstName, resetToken) => ({
    subject: 'Reset Your ComplianceOS Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #00d4aa; }
          .logo { font-size: 28px; font-weight: bold; color: #00d4aa; }
          .content { padding: 30px 0; }
          .alert { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .reset-button { display: inline-block; background: #00d4aa; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .token-box { background: #f8f9fa; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 16px; text-align: center; margin: 20px 0; border: 2px dashed #00d4aa; }
          .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ComplianceOS</div>
            <p>Password Reset Request</p>
          </div>
          
          <div class="content">
            <h2>Hello ${firstName},</h2>
            
            <p>
              We received a request to reset your ComplianceOS account password. If you made this request, you can reset your password using the link below.
            </p>
            
            <div class="alert">
              <strong>⚠️ Security Notice:</strong> This password reset link will expire in 10 minutes for your security.
            </div>
            
            <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/reset-password?token=${resetToken}" class="reset-button">
              Reset Your Password
            </a>
            
            <p>
              <strong>Alternative Method:</strong><br>
              If the button above doesn't work, you can copy and paste this reset token into the password reset form:
            </p>
            
            <div class="token-box">
              ${resetToken}
            </div>
            
            <p>
              <strong>Didn't request this?</strong><br>
              If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged, and no further action is required.
            </p>
            
            <p>
              For security reasons, we recommend:
              <ul>
                <li>Using a strong, unique password</li>
                <li>Enabling two-factor authentication</li>
                <li>Not sharing your login credentials</li>
              </ul>
            </p>
          </div>
          
          <div class="footer">
            <p>
              <strong>ComplianceOS Security Team</strong><br>
              Keeping your compliance data secure
            </p>
            <p>
              This email was sent because a password reset was requested for your account.<br>
              If you're experiencing issues, please contact our support team.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  otpVerification: (firstName, otp) => ({
    subject: 'Your ComplianceOS Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #00d4aa; }
          .logo { font-size: 28px; font-weight: bold; color: #00d4aa; }
          .content { padding: 30px 0; text-align: center; }
          .otp-box { background: linear-gradient(135deg, #00d4aa, #00b894); color: white; padding: 30px; border-radius: 10px; margin: 30px 0; }
          .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ComplianceOS</div>
            <p>Email Verification</p>
          </div>
          
          <div class="content">
            <h2>Hello ${firstName},</h2>
            
            <p>
              To complete your account setup, please use the verification code below:
            </p>
            
            <div class="otp-box">
              <h3>Your Verification Code</h3>
              <div class="otp-code">${otp}</div>
              <p>This code expires in 10 minutes</p>
            </div>
            
            <p>
              Enter this code in the verification form to activate your account and start using ComplianceOS.
            </p>
            
            <p>
              <strong>Security Note:</strong> Never share this code with anyone. ComplianceOS staff will never ask for your verification code.
            </p>
          </div>
          
          <div class="footer">
            <p>
              <strong>ComplianceOS Team</strong><br>
              Secure compliance management for your business
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send email function
export const sendEmail = async (to, template) => {
  try {
    const mailOptions = {
      from: `"ComplianceOS" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${result.messageId}`);
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

export default transporter;