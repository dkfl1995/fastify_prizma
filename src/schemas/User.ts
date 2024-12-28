import Joi from 'joi';

export interface IUserLoginDto {
  username: string;
  password: string;
}

export interface IUserSignupDto {
  email?: string;
  password: string;
  username: string;
}

export const loginSchema = Joi.object({
  username: Joi.string().min(4).max(64).required(),
  password: Joi.string().min(8).max(64).required(),
});

export const registerSchema = Joi.object({
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).max(64).required(),
  username: Joi.string().min(4).max(64).required(),
});
