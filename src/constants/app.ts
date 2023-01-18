import { randomIntFromInterval } from "@app/helpers";
type TTimeUnit = "day" | "second" | "minute";
interface IApp {
  DEFAULT_CURRENCY: string;
  INITIAL_FUND: number;
  INITIAL_CAR_DURABILITY: number;
  FIXED_MAINTENANCE_PRICE: number;
  FIXED_BUILD_CAR_PRICE: number;
  MATCH_DURATION_MIN: number;
  STAKING_TIME_UNIT: TTimeUnit;
}

export const app: IApp = {
  DEFAULT_CURRENCY: "TMU",
  INITIAL_FUND: 1000,
  INITIAL_CAR_DURABILITY: 5,
  FIXED_MAINTENANCE_PRICE: 100,
  FIXED_BUILD_CAR_PRICE: 2000,
  MATCH_DURATION_MIN: 1,
  STAKING_TIME_UNIT: "second",
};

export const messageCode = {
  SUCCESS: 1,
  FAIL: -1,
  ERROR: 0,
};

export const hashEntityKeys = {
  player: "PLAYERS",
  car: "CARS",
  race: "RACES",
  staking: "STAKING_FUND",
  investingAccount: "INVESTING_ACCOUNT",
};

export const racePrizeBODifficultyScale = {
  //scale
  SCALE_1: 2 * app.FIXED_MAINTENANCE_PRICE,
  SCALE_2: 3 * app.FIXED_MAINTENANCE_PRICE,
  SCALE_3: 4 * app.FIXED_MAINTENANCE_PRICE,
  SCALE_4: 5 * app.FIXED_MAINTENANCE_PRICE,
  SCALE_5: 10 * app.FIXED_MAINTENANCE_PRICE,
};

export const stakingScale = () => {
  return {
    SCALE_1: {
      RETURN_PERCENT: 10,
      DURATION_DAYS: 5,
      LOSS_PERCENT: 0,
      LOSS_INITIAL_FUND_PERCENT: 0,
    },
    SCALE_2: {
      RETURN_PERCENT: 20,
      DURATION_DAYS: 5,
      LOSS_PERCENT: 10,
      LOSS_INITIAL_FUND_PERCENT: 20,
    },
    SCALE_3: {
      RETURN_PERCENT: 25,
      DURATION_DAYS: 4,
      LOSS_PERCENT: 20,
      LOSS_INITIAL_FUND_PERCENT: 25,
    },
    SCALE_4: {
      RETURN_PERCENT: 50,
      DURATION_DAYS: 4,
      LOSS_PERCENT: 25,
      LOSS_INITIAL_FUND_PERCENT: 50,
    },
    SCALE_5: {
      RETURN_PERCENT: 150,
      DURATION_DAYS: 3,
      LOSS_PERCENT: randomIntFromInterval(80, 90),
      LOSS_INITIAL_FUND_PERCENT: 100,
    },
  };
};

export const raceScaleWinRate = {
  SCALE_1: 50,
  SCALE_2: 40,
  SCALE_3: 30,
  SCALE_4: 20,
  SCALE_5: 10,
};

export const raceWinPrize = {
  1: 2 * app.FIXED_MAINTENANCE_PRICE,
  2: 3 * app.FIXED_MAINTENANCE_PRICE,
  3: 4 * app.FIXED_MAINTENANCE_PRICE,
  4: 5 * app.FIXED_MAINTENANCE_PRICE,
  5: 10 * app.FIXED_MAINTENANCE_PRICE,
};

export const carWinRateBasedOnLuckLevel = () => {
  return {
    CAR_LEVEL_1: 0,
    CAR_LEVEL_2: 5,
    CAR_LEVEL_3: randomIntFromInterval(5, 10),
    CAR_LEVEL_4: randomIntFromInterval(10, 15),
    CAR_LEVEL_5: randomIntFromInterval(15, 20),
  };
};
