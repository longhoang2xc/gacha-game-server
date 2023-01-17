import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { authRouter, testRouter, carRouter } from "@app/routes";
import { logger, swaggerDocs, setAxiosCommonHeaders } from "./helpers";

// dotenv init
const dotenv = require("dotenv");
dotenv.config({
  path:
    process.env["NODE_ENV"] === "development"
      ? ".env.development"
      : ".env.production",
});
// (() => {})();
export interface ProcessEnv {
  [key: string]: string | undefined;
}

try {
  // issues with timezone
  process.env.TZ = "Etc/Universal";

  const port = process.env["SERVER_PORT"] as string | number;
  const app = express();

  // Call midlewares
  app.use(cors());
  // app.use(helmet());
  app.use(bodyParser.json());

  app.use((req, _res, next) => {
    setAxiosCommonHeaders(req.headers);
    next();
  });
  //Set all routes from routes folder
  app.use("/", [authRouter, carRouter]);

  if (process.env["NODE_ENV"] === "development") {
    app.use("/", testRouter);
    swaggerDocs(app, port);
  }

  app.disable("etag");
  app.listen(port, () => {
    logger.log({
      level: "info",
      message: `Server started on port ${port}!`,
    });
    console.log(`Server started on port ${port}! `);
  });
  // cronjobs
} catch (error) {
  console.log(
    `Server start fail error: ${
      typeof error === "object" ? JSON.stringify(error) : error
    }`,
    error,
  );
  logger.log({
    level: "error",
    message: `Server start fail error: ${
      typeof error === "object" ? JSON.stringify(error) : error
    }`,
  });
}
