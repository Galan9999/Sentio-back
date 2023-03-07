import createDebug from "debug";
import type CustomError from "../CustomError/CustomError.js";
import { app } from "./App.js";

const debug = createDebug("sentio:server:startServer");

const startServer = async (port: number) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve(server);
    });

    server.on("error", (error: CustomError) => {
      const errorMessage = "Error on starting the server";

      if (error.code === "EADDRINUSE") {
        debug(errorMessage, `The port number ${port} is already in use`);
      }

      reject(new Error(errorMessage));
    });
  });

export default startServer;
