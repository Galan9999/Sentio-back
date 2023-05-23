import { Router } from "express";
import {
  loginUser,
  registerUser,
} from "../../controllers/usersControllers/usersControllers.js";
import urls from "../../utils/urls.js";
import { validate } from "express-validation";
import loginSchema from "../../schemas/userSchemas/loginSchema.js";
import registerUserSchema from "../../schemas/userSchemas/registerSchema.js";

const { loginUrl, registerUrl } = urls;

const usersRouter = Router();

usersRouter.post(
  registerUrl,
  validate(registerUserSchema, {}, { abortEarly: false }),
  registerUser
);
usersRouter.post(
  loginUrl,
  validate(loginSchema, {}, { abortEarly: false }),
  loginUser
);

export default usersRouter;
