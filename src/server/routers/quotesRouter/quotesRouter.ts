import { Router } from "express";
import {
  deleteQuote,
  getQuotes,
} from "../../controllers/quotesControllers/quotesControllers.js";
import auth from "../../middlewares/auth/auth.js";

const quotesRouter = Router();

quotesRouter.get("/", getQuotes);
quotesRouter.delete("/delete/:quoteId", auth, deleteQuote);

export default quotesRouter;
