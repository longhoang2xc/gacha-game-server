import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { testRouter } from "@app/routes";
import {
  logger,
  swaggerDocs,
  setAxiosCommonHeaders,
  randomIntFromInterval,
} from "./helpers";

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

const rollTheDice = () => {
  // roll 4 dices
  const dice = {
    CAR_LEVEL_2: 30,
    CAR_LEVEL_3: 20,
    CAR_LEVEL_4: 10,
    CAR_LEVEL_5: 5,
  } as any;

  let result = "CAR_LEVEL_1";

  for (const key in dice) {
    const isNextDice = randomIntFromInterval(1, 100);
    console.log("isNextDice", isNextDice);
    if (isNextDice > dice[key]) {
      return;
    }
    result = key;
    console.log("result", result);
  }
  return result;
};
rollTheDice();

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
  // app.use("/", [vLendingGeneralRouter]);

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
