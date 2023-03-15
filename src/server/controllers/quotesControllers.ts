import { type NextFunction, type Request, type Response } from "express";
import createDebug from "debug";
import { Quote } from "../../database/models/Quote.js";
import CustomError from "../../CustomError/CustomError.js";
import statusCodes from "../utils/statusCodes.js";

const {
  clientError: { notFound },
} = statusCodes;

const debug = createDebug("sentio:server:controllers:quoteControllers");

export const getQuotes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const quotes = await Quote.find().exec();

    if (!quotes) {
      throw new CustomError(
        "Quote not found!",
        notFound,
        "Couldn't retrieve quote!"
      );
    }

    res.status(200).json({ quotes });
  } catch (error) {
    next(error);
  }
};
