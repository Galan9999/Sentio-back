import { type NextFunction, type Response } from "express";
import sharp from "sharp";
import path from "node:path";
import CustomError from "../../../CustomError/CustomError.js";
import statusCodes from "../../utils/statusCodes.js";
import { type CustomQuoteRequest } from "../../controllers/types.js";

const {
  clientError: { badRequest },
} = statusCodes;

const sharpFile = async (
  req: CustomQuoteRequest,
  res: Response,
  next: NextFunction
) => {
  const originalname = req.file?.originalname;
  const filename = req.file?.filename;

  const basePath = `${path.basename(
    originalname!,
    path.extname(originalname!)
  )}`;
  try {
    await sharp(path.join("uploads", filename!))
      .resize(600, 400, { fit: "cover" })
      .webp({ quality: 100 })
      .toFormat("webp")
      .toFile(path.join("uploads", `${basePath}.webp`));

    req.file!.originalname = `${basePath}.webp`;
    req.file!.filename = `${basePath}.webp`;

    next();
  } catch (error) {
    const newError = new CustomError(
      (error as Error).message,
      badRequest,
      "Error optimizing the provided image"
    );
    next(newError);
  }
};

export default sharpFile;
