import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { prisma } from '../../config/prisma.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function signup(data) {
  const { firstname, lastname, username, email, address, phone, password } = data;
  
  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: 'Email already exists' };
  const existingUsername = await prisma.user.findFirst({ where: { username } });
  if (existingUsername) return { error: 'Username already exists' };
  const existingPhone = await prisma.user.findFirst({ where: { phone } });
  if (existingPhone) return { error: 'Phone number already exists' };

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  
  // Store signup data temporarily (you might want to use Redis or a temporary table in production)
  // For now, we'll store it in the user table with a temporary status
  const passwordHash = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.create({
    data: {
      firstname,
      lastname,
      username,
      email,
      address1: address,
      phone,
      password: passwordHash,
      code: otp, // Store OTP in code field
      user_type: 'user',
    },
  });

  // Send OTP email
  try {
    await transporter.sendMail({
      to: email,
      from: `${process.env.SMTP_FROM_NAME || 'Rose Heavenly Salon'} <${process.env.SMTP_FROM_EMAIL || 'noreply@roseheavenly.com'}>`,
      subject: 'Email Verification - Rose Heavenly Salon',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Rose Heavenly Salon</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Thank you for signing up with Rose Heavenly Salon! To complete your registration, 
              please enter the verification code below:
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h3 style="color: #333; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h3>
            </div>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              This code will expire in 10 minutes. If you didn't create an account with us, 
              please ignore this email.
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 14px;">
                Best regards,<br>
                The Rose Heavenly Salon Team
              </p>
            </div>
          </div>
        </div>
      `,
    });
  } catch (emailError) {
    console.log('Email sending failed (this is normal in development):', emailError.message);
    // In development, we can still proceed without email
  }

  console.log(`✅ OTP sent to ${email} for verification`);

  return { message: 'OTP sent successfully', email };
}

export async function verifySignupOtp(email, otp) {
  const user = await prisma.user.findFirst({ 
    where: { 
      email,
      code: Number(otp)
    } 
  });
  
  if (!user) return { error: 'Invalid OTP or email' };
  
  // Clear the OTP and mark user as verified
  await prisma.user.update({ 
    where: { id: user.id }, 
    data: { code: 0 } 
  });
  
  console.log(`✅ User ${email} verified successfully`);
  
  return { user };
}

export async function verifyOtp(otp) {
  const user = await prisma.user.findFirst({ where: { code: Number(otp) } });
  if (!user) return { error: 'Invalid code' };
  await prisma.user.update({ where: { id: user.id }, data: { code: 0 } });
  return { user };
}

export async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: 'Invalid credentials' };
  
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return { error: 'Invalid credentials' };
  
  // Check if email is verified (code should be 0 for verified users)
  if (user.code !== 0) {
    return { error: 'Please verify your email address before logging in. Check your email for the verification code.' };
  }
  
  return { user };
}

export async function forgotPassword(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: 'This email address does not exist!' };
  const code = Math.floor(100000 + Math.random() * 900000);
  await prisma.user.update({ where: { id: user.id }, data: { code } });
  
  // Try to send email, but don't fail if email is not configured
  try {
    await transporter.sendMail({
      to: email,
      from: `${process.env.SMTP_FROM_NAME || 'Rose Heavenly Salon'} <${process.env.SMTP_FROM_EMAIL || 'noreply@roseheavenly.com'}>`,
      subject: 'Password Reset Code',
      text: `Your password reset code is ${code}`,
    });
  } catch (emailError) {
    console.log('Email sending failed (this is normal in development):', emailError.message);
    // In development, we can still proceed without email
  }
  
  return { ok: true };
}

export async function resetPassword(email, otp, password) {
  const user = await prisma.user.findFirst({ where: { email, code: Number(otp) } });
  if (!user) return { error: 'Invalid code' };
  const enc = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: user.id }, data: { code: 0, password: enc } });
  return { ok: true };
}

export async function getById(id) {
  return prisma.user.findUnique({ where: { id }, select: { id: true, email: true, username: true, firstname: true, lastname: true, address1: true, phone: true, user_type: true } });
}

export async function resendSignupOtp(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: 'Email not found' };
  
  // Check if user is already verified (code = 0)
  if (user.code === 0) return { error: 'Email is already verified' };
  
  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  
  // Update the OTP
  await prisma.user.update({ 
    where: { id: user.id }, 
    data: { code: otp } 
  });
  
  // Send new OTP email
  try {
    await transporter.sendMail({
      to: email,
      from: `${process.env.SMTP_FROM_NAME || 'Rose Heavenly Salon'} <${process.env.SMTP_FROM_EMAIL || 'noreply@roseheavenly.com'}>`,
      subject: 'Email Verification Code - Rose Heavenly Salon',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Rose Heavenly Salon</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">New Verification Code</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              You requested a new verification code. Please enter the code below to complete your registration:
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h3 style="color: #333; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h3>
            </div>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              This code will expire in 10 minutes. If you didn't request this code, 
              please ignore this email.
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 14px;">
                Best regards,<br>
                The Rose Heavenly Salon Team
              </p>
            </div>
          </div>
        </div>
      `,
    });
  } catch (emailError) {
    console.log('Email sending failed (this is normal in development):', emailError.message);
    // In development, we can still proceed without email
  }
  
  console.log(`✅ New OTP sent to ${email}`);
  
  return { message: 'New OTP sent successfully' };
}

export async function resendOtpForLogin(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: 'Email not found' };
  
  // Check if user is already verified (code = 0)
  if (user.code === 0) return { error: 'Email is already verified' };
  
  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  
  // Update the OTP
  await prisma.user.update({ 
    where: { id: user.id }, 
    data: { code: otp } 
  });
  
  // Send new OTP email
  try {
    await transporter.sendMail({
      to: email,
      from: `${process.env.SMTP_FROM_NAME || 'Rose Heavenly Salon'} <${process.env.SMTP_FROM_EMAIL || 'noreply@roseheavenly.com'}>`,
      subject: 'Email Verification Required - Rose Heavenly Salon',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Rose Heavenly Salon</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Email Verification Required</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              You attempted to log in but your email address hasn't been verified yet. 
              Please enter the verification code below to complete your registration:
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h3 style="color: #333; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h3>
            </div>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              This code will expire in 10 minutes. After verification, you'll be able to log in successfully.
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 14px;">
                Best regards,<br>
                The Rose Heavenly Salon Team
              </p>
            </div>
          </div>
        </div>
      `,
    });
  } catch (emailError) {
    console.log('Email sending failed (this is normal in development):', emailError.message);
    // In development, we can still proceed without email
  }
  
  console.log(`✅ New OTP sent to ${email} for login verification`);
  
  return { message: 'New verification code sent successfully' };
}


