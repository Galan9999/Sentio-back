import { Router } from "express";
import {
  loginUser,
  registerUser,
} from "../../controllers/usersControllers/usersControllers.js";

const usersRouter = Router();

usersRouter.post("/login", loginUser);
usersRouter.post("/register", registerUser);

export default usersRouter;
