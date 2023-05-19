import joi from "joi";

export const urlValidate = joi.object({
    url: joi.string().required().uri(),
});