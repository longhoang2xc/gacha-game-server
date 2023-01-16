import { app, hashEntityKeys } from "@app/constants";
import {
  logger,
  randomIntFromInterval,
  setRedisHash,
  withBaseResponse,
} from "@app/helpers";
import type { ICar } from "@app/interfaces";
import type { Request, Response } from "express";

import { v4 as uuidv4 } from "uuid";
// register user new and not duplicated email
const buildCar = async (req: Request, res: Response) => {
  const body = req.body;
  console.log("body", body);
  try {
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
          return result;
        }
        result = key;
        console.log("result", result);
      }
      return result;
    };
    const carLevel = rollTheDice();
    const newId = uuidv4();

    //prepare and save date to storage Number(carLevel.replace("CAR_LEVEL_", "")),
    delete body?.confirmPassword;
    const data: ICar = {
      durability: 5,
      id: newId,
      luckLevel: carLevel,
      playerId: "0bb4f9c5-c55c-4fb8-8d06-3039d672cc87",
    };
    await setRedisHash(hashEntityKeys.car, newId, data);

    res.send(
      withBaseResponse({
        success: false,
        message: "Register success",
        data: null,
      }),
    );
    return;
  } catch (error: any) {
    console.log(
      `Register error: ${
        typeof error === "object" ? JSON.stringify(error) : error
      }`,
      error,
    );
    logger.log({
      level: "error",
      message: `Register error: ${
        typeof error === "object" ? JSON.stringify(error) : error
      }`,
    });
    res.status(400).send("Bad Request");
    return;
  }
};

export const carController = {
  buildCar,
};
