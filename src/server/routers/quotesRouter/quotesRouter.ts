import { Router } from "express";
import {
  createQuote,
  deleteQuote,
  getQuoteById,
  getQuotes,
} from "../../controllers/quotesControllers/quotesControllers.js";
import auth from "../../middlewares/auth/auth.js";

const quotesRouter = Router();

quotesRouter.get("/", getQuotes);
quotesRouter.get("/:quoteId", getQuoteById);
quotesRouter.delete("/:quoteId", auth, deleteQuote);
quotesRouter.post("/create", auth, createQuote);

export default quotesRouter;
