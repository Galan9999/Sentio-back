import { Router } from "express";
import {
  loginUser,
  registerUser,
} from "../../controllers/usersControllers/usersControllers.js";
import urls from "../../utils/urls.js";

const { loginUrl, registerUrl } = urls;

const usersRouter = Router();

usersRouter.post(registerUrl, registerUser);
usersRouter.post(loginUrl, loginUser);

export default usersRouter;
