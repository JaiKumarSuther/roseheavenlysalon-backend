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
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: 'Email already exists' };
  const existingUsername = await prisma.user.findFirst({ where: { username } });
  if (existingUsername) return { error: 'Username already exists' };
  const existingPhone = await prisma.user.findFirst({ where: { phone } });
  if (existingPhone) return { error: 'Phone number already exists' };

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
      code: 0,
      user_type: 'user',
    },
  });

  console.log(`✅ User ${email} registered successfully`);

  return { userId: user.id, user };
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


