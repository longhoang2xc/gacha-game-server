import { randomIntFromInterval } from "@app/helpers";
export const messageCode = {
  SUCCESS: 1,
  FAIL: -1,
  ERROR: 0,
};

export const app = {
  DEFAULT_CURRENCY: "TMU",
  INITIAL_FUND: 1000,
  FIXED_MAINTENANCE_PRICE: 100,
  FIXED_BUILD_CAR_PRICE: 2000,
};

export const hashEntityKeys = {
  player: "player",
  car: "car",
};

export const racePrizeBODifficultyScale = {
  //scale
  SCALE_1: 2 * app.FIXED_MAINTENANCE_PRICE,
  SCALE_2: 3 * app.FIXED_MAINTENANCE_PRICE,
  SCALE_3: 4 * app.FIXED_MAINTENANCE_PRICE,
  SCALE_4: 5 * app.FIXED_MAINTENANCE_PRICE,
  SCALE_5: 10 * app.FIXED_MAINTENANCE_PRICE,
};

export const stakingScale = {
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

export const raceScaleWinRate = {
  SCALE_1: 50,
  SCALE_2: 40,
  SCALE_3: 30,
  SCALE_4: 20,
  SCALE_5: 10,
};
