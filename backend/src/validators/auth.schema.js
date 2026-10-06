const { z } = require("zod");

/**
 * Zod schema for POST /auth/register.
 * Explicitly strips `role`, `id`, `ownerId`, etc. via .strict() so
 * clients can never mass-assign protected fields.
 */
const registerSchema = z.object({
  fullName: z
    .string({ required_error: "Full name is required" })
    .trim()
    .min(1, "Full name cannot be empty")
    .max(100),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

/**
 * Zod schema for POST /auth/login.
 */
const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Invalid email address"),
  password: z.string({ required_error: "Password is required" }).min(1),
});

module.exports = { registerSchema, loginSchema };

