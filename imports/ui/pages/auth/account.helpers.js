const Joi = require('joi');

const passwordErrorMessage =
  'Please make sure to enter minimum one lowercase letter, one capitalcase letter, one number and a total of minimum 8 characters';

// REGEX
const regexPassword = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$';

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
const usernameSchema = {
  username: Joi.string().alphanum().case('lower').min(4).max(15).required(),
};

const emailSchema = {
  email: Joi.string().email({ tlds: { allow: false } }),
};

const usernameOrEmailSchema = {
  username: Joi.allow(usernameSchema, emailSchema),
};

const passwordSchema = {
  password: Joi.string().pattern(new RegExp(regexPassword)).message(passwordErrorMessage),
};

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
