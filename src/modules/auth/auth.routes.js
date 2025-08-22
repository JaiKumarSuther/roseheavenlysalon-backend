import { Router } from "express";
import * as controller from "./auth.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { z } from "zod";
import { validate } from "../../middleware/validate.js";

const router = Router();

// Module docs (always at top)
export const endpoints = [
  {
    path: "/api/auth/signup",
    method: "POST",
    description: "Register user and send OTP",
    params: ["firstname","lastname","username","email","address","phone","password"],
    attributes: [
      { name: "firstname", in: "body", type: "string", required: true, description: "First name of the user", example: "Jane" },
      { name: "lastname", in: "body", type: "string", required: true, description: "Last name of the user", example: "Doe" },
      { name: "username", in: "body", type: "string", required: true, description: "Unique username", example: "jane" },
      { name: "email", in: "body", type: "string", required: true, description: "Valid email address", example: "jane@example.com" },
      { name: "address", in: "body", type: "string", required: true, description: "Street address", example: "123 St" },
      { name: "phone", in: "body", type: "string", required: true, description: "Phone number", example: "0917..." },
      { name: "password", in: "body", type: "string", required: true, description: "Password (min 8 chars)", example: "secret123" }
    ],
    sampleRequest: {
      firstname: "Jane",
      lastname: "Doe",
      username: "jane",
      email: "jane@example.com",
      address: "123 St",
      phone: "0917...",
      password: "secret123",
    },
    sampleResponse: {
      message: "Signup successful",
      userId: 1,
    },
  },
  {
    path: "/api/auth/verify-otp",
    method: "POST",
    description: "Verify OTP and return JWT",
    params: ["otp"],
    attributes: [
      { name: "otp", in: "body", type: "string|number", required: true, description: "6-digit code sent via email", example: 123456 }
    ],
    sampleRequest: { otp: 123456 },
    sampleResponse: { message: "OTP verified", token: "<jwt>" },
  },
  {
    path: "/api/auth/login",
    method: "POST",
    description: "Login and return JWT",
    params: ["email", "password"],
    attributes: [
      { name: "email", in: "body", type: "string", required: true, description: "Registered email", example: "jane@example.com" },
      { name: "password", in: "body", type: "string", required: true, description: "Password", example: "secret123" }
    ],
    sampleRequest: { email: "jane@example.com", password: "secret123" },
    sampleResponse: { token: "<jwt>" },
  },
  {
    path: "/api/auth/forgot-password",
    method: "POST",
    description: "Send password reset OTP",
    params: ["email"],
    attributes: [
      { name: "email", in: "body", type: "string", required: true, description: "Email to send reset OTP", example: "jane@example.com" }
    ],
    sampleRequest: { email: "jane@example.com" },
    sampleResponse: {
      message:
        "We've sent a password reset otp to your email - jane@example.com",
    },
  },
  {
    path: "/api/auth/reset-password",
    method: "POST",
    description: "Reset password using OTP",
    params: ["email", "otp", "password"],
    attributes: [
      { name: "email", in: "body", type: "string", required: true, description: "Registered email", example: "jane@example.com" },
      { name: "otp", in: "body", type: "string|number", required: true, description: "OTP received for reset", example: 123456 },
      { name: "password", in: "body", type: "string", required: true, description: "New password (min 8 chars)", example: "newPass123" }
    ],
    sampleRequest: {
      email: "jane@example.com",
      otp: 123456,
      password: "newPass123",
    },
    sampleResponse: {
      message:
        "Your password changed. Now you can login with your new password.",
    },
  },
  {
    path: "/api/auth/me",
    method: "GET",
    description: "Get current user",
    params: [],
    attributes: [],
    sampleRequest: {},
    sampleResponse: { id: 1, email: "jane@example.com" },
  },
];

const signupSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  username: z.string().min(3),
  email: z.string().email(),
  address: z.string().optional().default("Not provided"),
  phone: z.string().min(5),
  password: z.string().min(8),
});
router.post("/signup", validate(signupSchema), controller.signup);

router.post(
  "/login",
  validate(
    z.object({ email: z.string().email(), password: z.string().min(1) })
  ),
  controller.login
);
router.post(
  "/verify-otp",
  validate(z.object({ otp: z.union([z.string(), z.number()]) })),
  controller.verifyOtp
);
router.post(
  "/forgot-password",
  validate(z.object({ email: z.string().email() })),
  controller.forgotPassword
);
router.post(
  "/reset-password",
  validate(
    z.object({
      email: z.string().email(),
      otp: z.union([z.string(), z.number()]),
      password: z.string().min(8),
    })
  ),
  controller.resetPassword
);
router.get("/me", requireAuth, controller.me);

export default router;
