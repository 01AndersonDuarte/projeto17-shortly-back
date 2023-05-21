import joi from "joi";

export const signUpValidate = joi.object({
    name: joi.string().min(4).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    confirmPassword: joi.string().valid(joi.ref('password')).required()
});

export const signInValidate = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
});