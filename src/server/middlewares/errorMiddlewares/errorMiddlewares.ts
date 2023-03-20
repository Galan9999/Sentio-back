import createDebug from "debug";
import { type NextFunction, type Request, type Response } from "express";
import { ValidationError } from "express-validation";
import CustomError from "../../../CustomError/CustomError.js";
import statusCodes from "../../utils/statusCodes.js";

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
  if (error instanceof ValidationError) {
    const errors = error.details.body
      ?.map((detail) => detail.message)
      .join(" & ");

    debug(errors);
    error.publicMessage = errors!;
  }

  debug(error.message);

  res
    .status(error.statusCode || internalServer)
    .json({ error: error.publicMessage || "Something went wrong" });
};
