import { z } from "zod";

export const signUpFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, {
      message: "Enter your first name.",
    })
    .max(20, {
      message: "Use shorter first name.",
    })
    .regex(/^[A-Za-z]+$/, {
      message: "First name must contain only letters.",
    }),
  lastName: z
    .string()
    .trim()
    .min(2, {
      message: "Enter your last name.",
    })
    .max(20, {
      message: "Use shorter last name.",
    })
    .regex(/^[A-Za-z]+$/, {
      message: "Last name must contain only letters.",
    }),
  email: z
    .string()
    .trim()
    .min(1, {
      message: "Email is required.",
    })
    .email({
      message: "Please enter a valid email address.",
    }),
  password: z
    .string()
    .min(1, {
      message: "Password is required.",
    })
    .min(8, {
      message: "Password must be at least 8 characters.",
    }),
});

export const signInFormSchema = signUpFormSchema.pick({
  email: true,
  password: true,
});

export const verifyOtpFormSchema = z.object({
  pin: z
    .string()
    .trim()
    .min(6, {
      message: "OTP must be 6 characters.",
    })
    .regex(/^\d{6}$/, {
      message: "OTP must only contain numbers.",
    })
    .max(6, {
      message: "OTP must not exceed 6 characters.",
    }),
});

export const forgotPasswordEmailFormSchema = signInFormSchema.pick({
  email: true,
});

export const forgotPasswordPhoneFormSchema = z.object({
  phone: z
    .string()
    .min(10, { message: "Phone number must be 10 digits." })
    .max(10, { message: "Phone number must not exceed 10 digits." })
    .refine(
      (value) => {
        const number = parseInt(value, 10);
        return !isNaN(number) && number >= 0;
      },
      { message: "Phone number must be a positive number." }
    ),
});

export const resetPasswordFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must be same.",
    path: ["confirmPassword"],
  });
