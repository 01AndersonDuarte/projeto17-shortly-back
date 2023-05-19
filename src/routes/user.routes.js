import { Router } from "express";

import schemaValidation from "../middlewares/schemaValidation.middleware.js";
import { userSignIn, userSignUp } from "../middlewares/user.middleware.js";
import { userValidate } from "../schemas/userValidate.schema.js";
import { signUp, signIn } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/signup", schemaValidation(userValidate), userSignUp, signUp);
userRouter.post("/signin", userSignIn, signIn);

export default userRouter;