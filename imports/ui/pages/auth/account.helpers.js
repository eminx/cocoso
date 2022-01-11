const Joi = require('joi');

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
  username: Joi.string().alphanum().min(4).max(15).required(),
};

const emailSchema = {
  email: Joi.string().email({ tlds: { allow: false } }),
};

const passwordSchema = {
  password: Joi.string().pattern(new RegExp(regexPassword)),
};

export {
  regexPassword, 
  loginModel, 
  signupModel, 
  forgotPasswordModel, 
  resetPasswordModel, 
  usernameSchema, 
  emailSchema, 
  passwordSchema,
};