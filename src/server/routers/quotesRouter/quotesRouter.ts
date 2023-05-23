import { Router } from "express";
import {
  createQuote,
  deleteQuote,
  getQuoteById,
  getQuotes,
} from "../../controllers/quotesControllers/quotesControllers.js";
import auth from "../../middlewares/auth/auth.js";
import { validate } from "express-validation";
import quoteSchema from "../../schemas/quoteSchemas/quoteSchema.js";

const quotesRouter = Router();

quotesRouter.get("/", getQuotes);
quotesRouter.get("/:id", getQuoteById);
quotesRouter.delete("/:id", auth, deleteQuote);
quotesRouter.post(
  "/create",
  auth,
  validate(quoteSchema, {}, { abortEarly: false }),
  createQuote
);

export default quotesRouter;
