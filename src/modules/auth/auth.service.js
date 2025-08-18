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

  const passwordHash = await bcrypt.hash(password, 10);
  const code = Math.floor(100000 + Math.random() * 900000);

  const user = await prisma.user.create({
    data: {
      firstname,
      lastname,
      username,
      email,
      address1: address,
      phone,
      password: passwordHash,
      code,
      status: 'notverified',
      user_type: 'user',
    },
  });

  await transporter.sendMail({
    to: email,
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    subject: 'Email verification',
    html: `<p>Your verification code is: <b style="font-size: 30px;">${code}</b></p>`,
  });

  return { userId: user.id };
}

export async function verifyOtp(otp) {
  const user = await prisma.user.findFirst({ where: { code: Number(otp) } });
  if (!user) return { error: 'Invalid code' };
  await prisma.user.update({ where: { id: user.id }, data: { code: 0, status: 'verified' } });
  return { user };
}

export async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: 'Invalid credentials' };
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return { error: 'Invalid credentials' };
  if (user.status !== 'verified') return { error: `It's look like you haven't still verify your email - ${email}`, code: 'NOT_VERIFIED' };
  return { user };
}

export async function forgotPassword(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: 'This email address does not exist!' };
  const code = Math.floor(100000 + Math.random() * 900000);
  await prisma.user.update({ where: { id: user.id }, data: { code } });
  await transporter.sendMail({
    to: email,
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    subject: 'Password Reset Code',
    text: `Your password reset code is ${code}`,
  });
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
  return prisma.user.findUnique({ where: { id }, select: { id: true, email: true, username: true, user_type: true, status: true } });
}


