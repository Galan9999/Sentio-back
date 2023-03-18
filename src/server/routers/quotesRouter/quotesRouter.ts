import { Router } from "express";
import { deleteQuote, getQuotes } from "../../controllers/quotesControllers.js";

const quotesRouter = Router();

quotesRouter.get("/", getQuotes);
quotesRouter.delete("/delete/:quoteId", deleteQuote);

export default quotesRouter;
