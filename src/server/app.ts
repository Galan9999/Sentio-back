import express from "express";
import cors from "cors";
import morgan from "morgan";
import { options } from "./cors.js";
import {
  generalError,
  notFoundError,
} from "./middlewares/errorMiddlewares/errorMiddlewares.js";
import usersRouter from "./routers/usersRouter/usersRouter.js";
import quotesRouter from "./routers/quotesRouter/quotesRouter.js";

export const app = express();

app.disable("x-powered-by");

app.use(cors(options));
app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouter);
app.use("/quotes", quotesRouter);

app.use(notFoundError);
app.use(generalError);
