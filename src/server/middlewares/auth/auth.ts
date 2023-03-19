import "../../../loadEnvironment.js";
import { type NextFunction, type Response } from "express";
import jwt from "jsonwebtoken";
import {
  type CustomJwtPayload,
  type CustomQuoteRequest,
} from "../../controllers/types";
import CustomError from "../../../CustomError/CustomError.js";
import statusCodes from "../../utils/statusCodes.js";

const {
  clientError: { forbidden, unauthorized },
} = statusCodes;

const auth = (req: CustomQuoteRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      throw new CustomError(
        "Dont have Authorization header",
        forbidden,
        "Dont have Authorization"
      );
    }

    if (!authHeader.includes("Bearer")) {
      throw new CustomError(
        "Missing Bearer",
        unauthorized,
        "Dont have Authorization"
      );
    }

    const token = authHeader.replace(/^Bearer\s*/i, "");

    const { id } = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;

    req.userId = id;
    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
