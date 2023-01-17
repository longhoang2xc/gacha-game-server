import {
  app,
  carWinRateBasedOnLuckLevel,
  hashEntityKeys,
  raceScaleWinRate,
  raceWinPrize,
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

const diceDurability = {
  DURA_AFTER_RACE_3: 25,
  DURA_AFTER_RACE_2: 20,
  DURA_AFTER_RACE_1: 15,
  DURA_AFTER_RACE_0: 10,
};

const diceCarLevel = {
  CAR_LEVEL_2: 30,
  CAR_LEVEL_3: 20,
  CAR_LEVEL_4: 10,
  CAR_LEVEL_5: 5,
};

const buildCar = async (req: Request, res: Response) => {
  try {
    const body = req.body;

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

    // roll dice the car level
    const carLevel = rollTheDice(diceCarLevel);
    const newId = uuidv4();

    //prepare and save date to storage
    const data: ICar = {
      carName: body?.carName,
      durability: app.INITIAL_CAR_DURABILITY,
      id: newId,
      luckLevel: carLevel,
      playerId: playerId,
      isRacing: false,
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
  try {
    const body = req.body;

    const playerId = req.headers["Player-Id"] as string;

    const dataCar = await getRedisHash(hashEntityKeys.car, body.carId);

    // not that player car
    if (playerId !== dataCar?.playerId) {
      res.send(
        withBaseResponse({
          success: false,
          message: "this isn't your car",
          data: dataCar,
        }),
      );
      return;
    }
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
    if (dataCar?.isRacing) {
      res.send(
        withBaseResponse({
          success: false,
          message: "car must finish previous race",
          data: dataCar,
        }),
      );
      return;
    }

    await setRedisHash(hashEntityKeys.car, dataCar.id, {
      ...dataCar,
      isRacing: true,
    });

    const dataPlayer = await getRedisHash(hashEntityKeys.player, playerId);

    // from difficult Level to get the base win rate
    const difficultLevel =
      `SCALE_${body?.difficultLevel}` as keyof typeof raceScaleWinRate;

    // from car Luck level to get to CWRBOLL(extra win rate)
    const carLuckLevelNow =
      dataCar?.luckLevel as keyof typeof carWinRateBasedOnLuckLevel;

    const winRate =
      raceScaleWinRate[difficultLevel] +
      carWinRateBasedOnLuckLevel()[carLuckLevelNow];

    const rollTheWinning = randomIntFromInterval(0, 100);

    const isWinOrNot = rollTheWinning <= winRate ? true : false;

    // prepare needed data for race
    const newRaceId = uuidv4();
    const now = dayjs().utc() as unknown as string;
    const racePrize = isWinOrNot
      ? raceWinPrize[body?.difficultLevel as keyof typeof raceWinPrize]
      : 0;
    //prepare and save date to storage
    const data: IRace = {
      id: newRaceId,
      playerId: playerId,
      carId: dataCar?.id,
      dateStart: now,
      difficultScale: difficultLevel,
      actualWinRate: winRate,
      duration: app.MATCH_DURATION_MIN,
      isWon: false,
      prize: 0,
    };
    await setRedisHash(hashEntityKeys.race, newRaceId, data);

    //update the race, player balance and car
    setTimeout(async () => {
      // roll the durability after race then update to car
      const durabilityAfter = Number(
        rollTheDice(diceDurability, "DURA_AFTER_RACE_4").replace(
          "DURA_AFTER_RACE_",
          "",
        ),
      );
      await setRedisHash(hashEntityKeys.car, dataCar.id, {
        ...dataCar,
        durability: durabilityAfter,
        isRacing: false,
      });

      // update race
      await setRedisHash(hashEntityKeys.race, newRaceId, {
        ...data,
        isWon: isWinOrNot,
        prize: racePrize,
      });

      if (isWinOrNot && racePrize > 0) {
        // update player bank balance
        await setRedisHash(hashEntityKeys.player, playerId, {
          ...dataPlayer,
          bankBalance: (dataPlayer?.bankBalance ?? 0) + racePrize,
        });
      }
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

const maintainCar = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const playerId = req.headers["Player-Id"] as string;

    const dataCar = await getRedisHash(hashEntityKeys.car, body.carId);

    // not that player car
    if (playerId !== dataCar?.playerId) {
      res.send(
        withBaseResponse({
          success: false,
          message: "this isn't your car",
          data: dataCar,
        }),
      );
      return;
    }
    // check car durability
    if (dataCar?.durability === 5) {
      res.send(
        withBaseResponse({
          success: false,
          message: "your car in perfect condition",
          data: dataCar,
        }),
      );
      return;
    }

    const dataPlayer = await getRedisHash(hashEntityKeys.player, playerId);

    const maintainLevel = 5 - Number(dataCar?.durability);
    if (maintainLevel < 0 || isNaN(maintainLevel)) {
      res.send(
        withBaseResponse({
          success: false,
          message: "unexpected error, please contact support team",
          data: dataCar,
        }),
      );
      return;
    }
    // update player bank balance
    if (
      dataPlayer?.bankBalance - maintainLevel * app.FIXED_MAINTENANCE_PRICE <
      0
    ) {
      res.send(
        withBaseResponse({
          success: false,
          message: "insufficient bank balance",
          data: dataCar,
        }),
      );
      return;
    }

    await setRedisHash(hashEntityKeys.player, playerId, {
      ...dataPlayer,
      bankBalance:
        dataPlayer?.bankBalance - maintainLevel * app.FIXED_MAINTENANCE_PRICE,
    });

    //update car durability
    await setRedisHash(hashEntityKeys.car, dataCar.id, {
      ...dataCar,
      durability: 5,
    });

    res.send(
      withBaseResponse({
        success: false,
        message: "maintain car success",
        data: {},
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
  maintainCar,
};
