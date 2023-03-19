import { type Response, type NextFunction, type Request } from "express";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createDebug from "debug";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";
import statusCodes from "../../utils/statusCodes.js";
import { type UserCredentials } from "../types.js";

const debug = createDebug("sentio:server:controllers:userControllers");

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

export default loginUser;
