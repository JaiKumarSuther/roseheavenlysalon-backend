import jwt from 'jsonwebtoken';
import * as service from './auth.service.js';

function sign(user) {
  return jwt.sign({ id: user.id, email: user.email, user_type: user.user_type }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

export async function signup(req, res) {
  try {
    const result = await service.signup(req.body);
    if (result.error) return res.status(400).json({ message: result.error });
    
    return res.status(201).json({ 
      message: result.message,
      email: result.email
    });
  } catch (e) {
    return res.status(500).json({ message: 'Signup failed', error: e.message });
  }
}

export async function verifyOtp(req, res) {
  const { otp } = req.body;
  const result = await service.verifyOtp(otp);
  if (result.error) return res.status(400).json({ message: result.error });
  const token = sign(result.user);
  return res.json({ message: 'OTP verified', token });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const result = await service.login(email, password);
  if (result.error) return res.status(400).json({ message: result.error });
  const token = sign(result.user);
  
  // Get full user data
  const fullUser = await service.getById(result.user.id);
  
  return res.json({ 
    token, 
    user: fullUser 
  });
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  const result = await service.forgotPassword(email);
  if (result.error) return res.status(404).json({ message: result.error });
  return res.json({ message: `We've sent a password reset otp to your email - ${email}` });
}

export async function resetPassword(req, res) {
  const { email, otp, password } = req.body;
  const result = await service.resetPassword(email, otp, password);
  if (result.error) return res.status(400).json({ message: result.error });
  return res.json({ message: 'Your password changed. Now you can login with your new password.' });
}

export async function verifySignupOtp(req, res) {
  try {
    const { email, otp } = req.body;
    const result = await service.verifySignupOtp(email, otp);
    if (result.error) return res.status(400).json({ message: result.error });
    
    // Generate JWT token for login after verification
    const token = sign(result.user);
    
    // Get full user data
    const fullUser = await service.getById(result.user.id);
    
    return res.json({ 
      message: 'Email verified successfully! You are now logged in.', 
      token,
      user: fullUser
    });
  } catch (e) {
    return res.status(500).json({ message: 'OTP verification failed', error: e.message });
  }
}

export async function resendSignupOtp(req, res) {
  try {
    const { email } = req.body;
    const result = await service.resendSignupOtp(email);
    if (result.error) return res.status(400).json({ message: result.error });
    
    return res.json({ message: result.message });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to resend OTP', error: e.message });
  }
}

export async function resendOtpForLogin(req, res) {
  try {
    const { email } = req.body;
    const result = await service.resendOtpForLogin(email);
    if (result.error) return res.status(400).json({ message: result.error });
    
    return res.json({ message: result.message });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to resend OTP', error: e.message });
  }
}

export async function me(req, res) {
  const me = await service.getById(req.user.id);
  return res.json({ ...me, address: me.address1 });
}


