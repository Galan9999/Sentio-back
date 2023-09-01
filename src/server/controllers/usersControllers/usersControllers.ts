import { type Response, type NextFunction } from "express";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createDebug from "debug";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";
import statusCodes from "../../utils/statusCodes.js";
import {
  type CustomJwtPayload,
  type CustomRegisterRequestCredentials,
  type CustomRequestCredentials,
} from "../types.js";

const debug = createDebug("sentio:server:controllers:userControllers");

const {
  clientError: { unauthorized, conflict },
  success: { okCode, created },
} = statusCodes;

export const registerUser = async (
  req: CustomRegisterRequestCredentials,
  res: Response,
  next: NextFunction
) => {
  const { email, password, username } = req.body;
  const saltLenght = 8;

  try {
    const hashedPassword = await bycrypt.hash(password, saltLenght);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (!user) {
      throw new CustomError("couldn't create", conflict, "couldn't create");
    }

    debug(`${username} has been registered successfully`);

    res.status(created).json({ message: "user successfully created!" });
  } catch (error) {
    next(
      new CustomError((error as Error).message, conflict, "couldn't create")
    );
  }
};

export const loginUser = async (
  req: CustomRequestCredentials,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).exec();

    if (!user) {
      throw new CustomError(
        "Wrong username!",
        unauthorized,
        "Wrong credentials!"
      );
    }

    if (!(await bycrypt.compare(password, user.password))) {
      throw new CustomError(
        "Wrong password!",
        unauthorized,
        "Wrong credentials!"
      );
    }

    const jwtPayload: CustomJwtPayload = {
      id: user?._id.toString(),
      username: user?.username,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!);

    debug(`${username} has been logged successfully`);

    res.status(okCode).json({ token });
  } catch (error) {
    next(error);
  }
};
