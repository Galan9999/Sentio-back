import { type Response, type NextFunction, type Request } from "express";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createDebug from "debug";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";
import statusCodes from "../../utils/statusCodes.js";
import { type RegisterCredentials, type UserCredentials } from "../types.js";

const debug = createDebug("sentio:server:controllers:userControllers");

const {
  clientError: { unauthorized, conflict },
  success: { okCode, created },
  serverError: { internalServer },
} = statusCodes;

export const registerUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    RegisterCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { email, password, username } = req.body;
  const saltLenght = 8;

  try {
    const hashedPassword = await bycrypt.hash(password, saltLenght);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(created).json({ message: "user successfully created!" });
  } catch (error) {
    const newError = new CustomError(
      (error as Error).message,
      conflict,
      "couldn't create"
    );

    next(newError);
  }
};

export const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
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

    const jwtPayload = {
      sub: user?._id,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!);

    debug(`${username} has been logged successfully`);

    res.status(okCode).json({ token });
  } catch (error) {
    next(error);
  }
};
