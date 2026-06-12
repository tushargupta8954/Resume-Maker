import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `Resume Builder <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
    text,
  };

  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Inter', sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .body { padding: 40px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 24px; }
        .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Welcome to ResumeAI!</h1>
        </div>
        <div class="body">
          <h2>Hello, ${user.firstName}! 👋</h2>
          <p>Welcome to ResumeAI - the AI-powered resume builder that helps you land your dream job!</p>
          <p>With ResumeAI, you can:</p>
          <ul>
            <li>✨ Create stunning resumes with AI-powered content</li>
            <li>📊 Check ATS compatibility scores</li>
            <li>🎯 Customize resumes for specific job descriptions</li>
            <li>📈 Track resume performance analytics</li>
          </ul>
          <a href="${process.env.CLIENT_URL}/dashboard" class="btn">Get Started →</a>
        </div>
        <div class="footer">
          <p>© 2024 ResumeAI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: "🚀 Welcome to ResumeAI - Start Building Your Dream Resume!",
    html,
    text: `Welcome ${user.firstName}! Your ResumeAI account is ready. Visit ${process.env.CLIENT_URL}/dashboard to get started.`,
  });
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Inter', sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ef4444, #f97316); padding: 40px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .body { padding: 40px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 24px; }
        .token-box { background: #f1f5f9; border-radius: 8px; padding: 16px; margin: 16px 0; font-family: monospace; word-break: break-all; }
        .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="body">
          <h2>Hello, ${user.firstName}!</h2>
          <p>We received a request to reset your password. Click the button below to set a new password:</p>
          <a href="${resetUrl}" class="btn">Reset Password →</a>
          <p style="margin-top: 24px; color: #64748b; font-size: 14px;">This link expires in <strong>10 minutes</strong>. If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2024 ResumeAI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: "🔐 ResumeAI - Password Reset Request",
    html,
    text: `Reset your password: ${resetUrl} (expires in 10 minutes)`,
  });
};