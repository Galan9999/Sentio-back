import createDebug from "debug";
import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../CustomError/CustomError.js";
import "../utils/statusCodes.js";
import statusCodes from "../utils/statusCodes.js";

const {
  clientError: { notFound },
  serverError: { internalServer },
} = statusCodes;

export const debug = createDebug("sentio:server:middlewares:errorMiddlewares");

export const notFoundError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new CustomError(
    "Path not found",
    notFound,
    "Endpoint not found"
  );

  next(error);
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(error.message);

  const statusCode = error.statusCode || internalServer;
  const publicMessage = error.publicMessage || "Something went wrong";

  res.status(statusCode).json({ error: publicMessage });
};
