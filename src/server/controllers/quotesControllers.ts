import { type NextFunction, type Request, type Response } from "express";
import createDebug from "debug";
import { Quote } from "../../database/models/Quote.js";
import CustomError from "../../CustomError/CustomError.js";
import statusCodes from "../utils/statusCodes.js";
import mongoose from "mongoose";

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

export const deleteQuote = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params?.id;

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new CustomError("Invalid object id!", 400, "Invalid data!");
    }

    const quoteToDelete = await Quote.findByIdAndDelete(id).exec();

    if (!quoteToDelete) {
      throw new CustomError("Mongoose method failed!", 404, "Couldn't delete!");
    }

    res.status(200).json({ message: `${quoteToDelete.author} deleted!` });
  } catch (error) {
    next(new CustomError((error as Error).message, 400, "Couldn't delete!"));
  }
};
