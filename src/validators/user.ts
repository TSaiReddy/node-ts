import Joi from "joi";

export const loginValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(8).max(20).required(),
});

export const signupValidator = Joi.object({
  last_name: Joi.string().max(20),
  password: Joi.string().min(8).required(),
  first_name: Joi.string().min(1).max(20).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
});
