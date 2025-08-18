import { Router } from 'express';
import * as controller from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';

const router = Router();

const signupSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  username: z.string().min(3),
  email: z.string().email(),
  address: z.string().min(1),
  phone: z.string().min(5),
  password: z.string().min(8),
});
router.post('/signup', validate(signupSchema), controller.signup);

router.post('/login', validate(z.object({ email: z.string().email(), password: z.string().min(1) })), controller.login);
router.post('/verify-otp', validate(z.object({ otp: z.union([z.string(), z.number()]) })), controller.verifyOtp);
router.post('/forgot-password', validate(z.object({ email: z.string().email() })), controller.forgotPassword);
router.post('/reset-password', validate(z.object({ email: z.string().email(), otp: z.union([z.string(), z.number()]), password: z.string().min(8) })), controller.resetPassword);
router.get('/me', requireAuth, controller.me);

export default router;


