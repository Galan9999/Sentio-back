import { type NextFunction, type Request, type Response } from "express";
import createDebug from "debug";
import { Quote } from "../../../database/models/Quote.js";
import CustomError from "../../../CustomError/CustomError.js";
import statusCodes from "../../utils/statusCodes.js";
import mongoose from "mongoose";
import { type CustomRequest, type CustomQuoteRequest } from "../types.js";

const {
  clientError: { notFound, badRequest, conflict },
  serverError: { internalServer },
  success: { okCode, created },
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
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { quoteId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(quoteId)) {
      throw new CustomError("Invalid object id!", badRequest, "Invalid data!");
    }

    const deletedQuote = await Quote.findByIdAndDelete(quoteId).exec();

    if (!deletedQuote) {
      throw new CustomError(
        "Mongoose method failed!",
        internalServer,
        "Couldn't delete!"
      );
    }

    res.status(okCode).json({ message: `${deletedQuote.author} deleted!` });
  } catch (error) {
    next(
      new CustomError((error as Error).message, badRequest, "Couldn't delete!")
    );
  }
};

export const createQuote = async (
  req: CustomQuoteRequest,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  const owner = req.userId;
  try {
    const newQuote = await Quote.create({
      ...body,
      owner,
    });
    if (!newQuote) {
      throw new CustomError(
        `Couldn't create quote!`,
        conflict,
        "Couldn't create quote!"
      );
    }

    res.status(created).json({ message: `${newQuote.author} created!` });
  } catch (error) {
    next(
      new CustomError((error as Error).message, 409, "Couldn't create quote!")
    );
  }
};
