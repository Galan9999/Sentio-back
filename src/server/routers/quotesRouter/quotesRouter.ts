import multer from "multer";
import { validate } from "express-validation";
import { Router } from "express";
import {
  createQuote,
  deleteQuote,
  getQuoteById,
  getQuotes,
} from "../../controllers/quotesControllers/quotesControllers.js";
import auth from "../../middlewares/auth/auth.js";
import quoteSchema from "../../schemas/quoteSchemas/quoteSchema.js";
import storage from "../../storage.js";
import { uploadFile } from "../../middlewares/imageBackup/imageBackup.js";
import sharpFile from "../../middlewares/sharpFile/sharpFile.js";
import urls from "../../utils/urls.js";

const { createQuoteUrl, deleteQuoteUrl, getByIdQuoteUrl, getQuotesUrl } = urls;

const quotesRouter = Router();

const upload = multer({
  storage,
  limits: {
    fileSize: 8000000,
  },
});

quotesRouter.get(getQuotesUrl, getQuotes); // NOSONAR

quotesRouter.get(getByIdQuoteUrl, getQuoteById); // NOSONAR

quotesRouter.delete(deleteQuoteUrl, auth, deleteQuote); // NOSONAR

quotesRouter.post(
  createQuoteUrl,
  auth,
  upload.single("image"),
  validate(quoteSchema, {}, { abortEarly: false }),
  sharpFile, // NOSONAR
  uploadFile, // NOSONAR
  createQuote // NOSONAR
);

export default quotesRouter;
