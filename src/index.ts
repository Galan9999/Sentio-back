import "./loadEnvironment.js";
import mongoose from "mongoose";
import createDebug from "debug";
import chalk from "chalk";
import connectDatabase from "./database/connectDatabase.js";
import startServer from "./server/startServer.js";

export const debug = createDebug("sentio:root");

const port = process.env.PORT ?? 4000;
const mongoDbUrl = process.env.MONGODB_CONNECTION_URL;

try {
  await connectDatabase(mongoDbUrl!);
  debug(chalk.green("Connected to database"));

  mongoose.set("toJSON", {
    virtuals: true,
    transform(doc, ret) {
      delete ret._id;
      delete ret.__v;
    },
  });

  await startServer(+port);
  debug(chalk.blue(`Server listening on ${port}`));
} catch (error) {
  debug(error.message);
}
