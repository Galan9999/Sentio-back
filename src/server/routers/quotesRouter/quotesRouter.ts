import { Router } from "express";
import { validate } from "express-validation";
import {
  createQuote,
  deleteQuote,
  getQuotes,
} from "../../controllers/quotesControllers/quotesControllers.js";
import auth from "../../middlewares/auth/auth.js";
import createQuoteSchema from "../../schemas/quoteSchema.js";

const quotesRouter = Router();

quotesRouter.get("/", getQuotes);
quotesRouter.delete("/:quoteId", auth, deleteQuote);
quotesRouter.post(
  "/create",
  auth,
  validate(createQuoteSchema, {}, { abortEarly: false }),
  createQuote
);

export default quotesRouter;
