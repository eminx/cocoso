import { z } from 'zod';

// REGEX
const regexUsername = /^[a-z0-9]+$/;
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

// DEFAULT VALUES
const loginModel = {
  username: '',
  password: '',
};

const signupModel = {
  username: '',
  email: '',
  password: '',
};

const forgotPasswordModel = {
  email: '',
};

const resetPasswordModel = {
  password: '',
};

// SCHEMAS
const usernameSchema = (t) => ({
  username: z
    .string()
    .min(4, t('common:auth.errors.username'))
    .regex(regexUsername, t('common:auth.errors.username')),
});

const emailSchema = (t) => ({
  email: z.string().email(t('common:auth.errors.email')),
});

const usernameOrEmailSchema = (t) =>
  z
    .object({
      username: z
        .string()
        .min(4, t('common:auth.errors.username'))
        .regex(regexUsername, t('common:auth.errors.username'))
        .optional(),
      email: z.string().email(t('common:auth.errors.email')).optional(),
    })
    .refine((data) => data.username || data.email, {
      message: t('common:auth.errors.usernameOrEmail'),
    });

const passwordSchema = (t) => ({
  password: z
    .string()
    .min(8, t('common:auth.errors.passwordMin'))
    .regex(regexPassword, t('common:auth.errors.passwordRegex')),
});

export {
  regexPassword,
  loginModel,
  signupModel,
  forgotPasswordModel,
  resetPasswordModel,
  usernameSchema,
  emailSchema,
  usernameOrEmailSchema,
  passwordSchema,
};
