import {
  app,
  carWinRateBasedOnLuckLevel,
  hashEntityKeys,
  raceScaleWinRate,
} from "@app/constants";
import {
  dayjs,
  getRedisHash,
  logger,
  randomIntFromInterval,
  rollTheDice,
  setRedisHash,
  withBaseResponse,
} from "@app/helpers";
import type { ICar, IRace } from "@app/interfaces";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const buildCar = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const playerId = req.headers["Player-Id"] as string;

    const dataPlayer = await getRedisHash(hashEntityKeys.player, playerId);

    // check balance
    if (dataPlayer.bankBalance - app.FIXED_BUILD_CAR_PRICE < 0) {
      res.send(
        withBaseResponse({
          success: false,
          message: "insufficient balance to build car",
          data: null,
        }),
      );
      return;
    }

    // check first car if not subtract balance
    if (!dataPlayer?.isHaveFirstCar) {
      await setRedisHash(hashEntityKeys.player, playerId, {
        ...dataPlayer,
        isHaveFirstCar: true,
      });
    } else {
      await setRedisHash(hashEntityKeys.player, playerId, {
        ...dataPlayer,
        bankBalance: dataPlayer.bankBalance - app.FIXED_BUILD_CAR_PRICE,
      });
    }

    const dice = {
      CAR_LEVEL_2: 30,
      CAR_LEVEL_3: 20,
      CAR_LEVEL_4: 10,
      CAR_LEVEL_5: 5,
    };

    // roll dice the car level
    const carLevel = rollTheDice(dice);
    const newId = uuidv4();

    //prepare and save date to storage
    const data: ICar = {
      carName: body?.carName,
      durability: app.INITIAL_CAR_DURABILITY,
      id: newId,
      luckLevel: carLevel,
      playerId: playerId,
    };
    await setRedisHash(hashEntityKeys.car, newId, data);

    res.send(
      withBaseResponse({
        success: false,
        message: "create car success",
        data: data,
      }),
    );
    return;
  } catch (error: any) {
    console.log(`build car error`, error);
    logger.log({
      level: "error",
      message: `build car error: ${
        typeof error === "object" ? JSON.stringify(error) : error
      }`,
    });
    res.status(400).send("Bad Request");
    return;
  }
};

const raceCar = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const dataCar = await getRedisHash(hashEntityKeys.car, body.carId);

    // check car durability
    if (dataCar?.durability < 5) {
      res.send(
        withBaseResponse({
          success: false,
          message: "car must be maintained before race",
          data: dataCar,
        }),
      );
      return;
    }

    const playerId = req.headers["Player-Id"] as string;

    const dataPlayer = await getRedisHash(hashEntityKeys.player, playerId);
    console.log("dataPlayer", dataPlayer, "dataCar", dataCar);

    // from difficult Level to get the base win rate of the Level
    const difficultLevel =
      `SCALE_${body?.difficultLevel}` as keyof typeof raceScaleWinRate;

    // from car Luck level to get to CWRBOLL(extra win rate)
    const carLuckLevelNow =
      dataCar?.luckLevel as keyof typeof carWinRateBasedOnLuckLevel;

    console.log(
      " raceScaleWinRate[difficultLevel]",
      raceScaleWinRate[difficultLevel],
      "carWinRateBasedOnLuckLevel[carLuckLevelNow]",
      carWinRateBasedOnLuckLevel[carLuckLevelNow],
    );

    const winRate =
      raceScaleWinRate[difficultLevel] +
      carWinRateBasedOnLuckLevel[carLuckLevelNow];

    console.log("winRate", winRate);
    const rollTheWinning = randomIntFromInterval(0, winRate);
    const isWinOrNot = rollTheWinning <= winRate ? true : false;

    const dice = {
      DURA_AFTER_RACE_4: 25,
      DURA_AFTER_RACE_3: 20,
      DURA_AFTER_RACE_2: 15,
      DURA_AFTER_RACE_1: 10,
    } as any;

    // roll the durability af race then update to car
    const durabilityAfterRace = rollTheDice(dice);

    console.log(
      "durabilityAfterRace",
      durabilityAfterRace,
      durabilityAfterRace.replace("DURA_AFTER_RACE_", ""),
    );

    const newId = uuidv4();
    const now = dayjs().utc() as unknown as string;
    //prepare and save date to storage
    const data: IRace = {
      id: newId,
      carId: dataCar?.id,
      dateStart: now,
      difficultScale: winRate,
      duration: app.MATCH_DURATION_MIN,
      isWon: isWinOrNot,
      prize: 0,
      playerId: playerId,
    };
    console.log("data reace", data);
    // await setRedisHash(hashEntityKeys.race, newId, data);

    setTimeout(() => {
      //update the race, player balance and car
    }, app.MATCH_DURATION_MIN * 60000);

    res.send(
      withBaseResponse({
        success: false,
        message: "start race success",
        data: data,
      }),
    );
    return;
  } catch (error: any) {
    console.log(`build car error`, error);
    logger.log({
      level: "error",
      message: `build car error: ${
        typeof error === "object" ? JSON.stringify(error) : error
      }`,
    });
    res.status(400).send("Bad Request");
    return;
  }
};

export const carController = {
  buildCar,
  raceCar,
};
