import { Router } from "express";
import { getQuotes } from "../../controllers/quotesControllers";

const quotesRouter = Router();

quotesRouter.get("/", getQuotes);

export default quotesRouter;
