import { Router } from "express";

import schemaValidation from "../middlewares/schemaValidation.middleware.js";
import { userSignIn, userSignUp } from "../middlewares/user.middleware.js";
import { signUpValidate, signInValidate } from "../schemas/userValidate.schema.js";
import { signUp, signIn, userData, ranking } from "../controllers/user.controller.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";

const userRouter = Router();

userRouter.post("/signup", schemaValidation(signUpValidate), userSignUp, signUp);
userRouter.post("/signin", schemaValidation(signInValidate), userSignIn, signIn);
userRouter.get("/users/me", authValidation, userData);
userRouter.get("/ranking", ranking);

export default userRouter;