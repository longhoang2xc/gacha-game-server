import { randomIntFromInterval } from "./randomInt";

export const rollTheDice = (dice: any) => {
  // roll 4 dices
  // const dice = {
  //   CAR_LEVEL_2: 30,
  //   CAR_LEVEL_3: 20,
  //   CAR_LEVEL_4: 10,
  //   CAR_LEVEL_5: 5,
  // } as any;

  let result = "CAR_LEVEL_1";

  for (const key in dice) {
    const isNextDice = randomIntFromInterval(1, 100);
    if (isNextDice > dice[key]) {
      return result;
    }
    result = key;
  }
  return result;
};
