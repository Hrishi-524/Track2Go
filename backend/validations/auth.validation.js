import { z } from 'zod'

export const signUpSchema = z.object({
    username: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format").transform(val => val.toLowerCase()),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6)
}).refine(data => data.password === data.confirmPassword, {
    message: "Password and confirm password must match",
    path: ["confirmPassword"]
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email").transform(val => val.toLowerCase()),
    password: z.string().min(1, "Password is required")
});

export const basicEmailSchema = z.object({
    email: z.string().email().transform(val => val.toLowerCase())
});

export const passwordResetSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).transform(val => val.toLowerCase()),
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" })
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Password and confirm password must match",
    path: ["confirmPassword"]
});