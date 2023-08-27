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

const quotesRouter = Router();

const upload = multer({
  storage,
  limits: {
    fileSize: 8000000,
  },
});

quotesRouter.get("/", getQuotes);

quotesRouter.get("/:id", getQuoteById);

quotesRouter.delete("/:id", auth, deleteQuote);

quotesRouter.post(
  "/create",
  auth,
  upload.single("image"),
  validate(quoteSchema, {}, { abortEarly: false }),
  sharpFile,
  uploadFile,
  createQuote
);

export default quotesRouter;
