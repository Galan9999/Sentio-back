import express from "express";
import cors from "cors";
import morgan from "morgan";
import { options } from "./cors.js";

export const app = express();

app.disable("x-powered-by");

app.use(cors(options));
app.use(morgan("dev"));
app.use(express.json());
