import { type Response, type NextFunction, type Request } from "express";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import CustomError from "../../CustomError/CustomError.js";
import User from "../../database/models/User.js";
import statusCodes from "../utils/statusCodes.js";
import { type UserCredentials } from "./types.js";

const {
  clientError: { unauthorized },
  success: { okCode },
  serverError: { internalServer },
} = statusCodes;

const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  const userToFind = username.toString();

  try {
    const user = await User.findOne({ username: userToFind }).exec();

    if (!user) {
      const error = new CustomError(
        "Wrong username!",
        unauthorized,
        "Wrong credentials!"
      );

      next(error);

      return;
    }

    if (!(await bycrypt.compare(password, user.password))) {
      const error = new CustomError(
        "Wrong password!",
        unauthorized,
        "Wrong credentials!"
      );

      next(error);

      return;
    }

    const jwtPayload = {
      sub: user?._id,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!);

    res.status(okCode).json({ token });
  } catch (error) {
    const customError = new CustomError(
      "Error on server response",
      internalServer,
      "Internal server error"
    );
    next(customError);
  }
};

export default loginUser;
