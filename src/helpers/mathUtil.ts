import Big from "big.js";

export const calculator = (
  operationsName: "add" | "subtract" | "multiply" | "divide",
  numberArray: number[],
): number | undefined => {
  if (
    numberArray?.length < 2 ||
    !numberArray?.every(item => typeof item === "number")
  ) {
    return;
  }
  let numberResult = Big(Number(numberArray[0]));
  for (let i = 1; i < numberArray.length; i++) {
    switch (operationsName) {
      case "add":
        numberResult = numberResult.add(Number(numberArray[i]));
        break;
      case "subtract":
        numberResult = numberResult.sub(Number(numberArray[i]));
        break;
      case "multiply":
        numberResult = numberResult.mul(Number(numberArray[i]));
        break;
      case "divide":
        numberResult = numberResult.div(Number(numberArray[i]));
        break;
      default:
        break;
    }
  }
  return numberResult.toNumber();
};

export const roundUpWithDecimal = (num: number, precision: number) => {
  return Math.ceil(num * 10 ** precision) / 10 ** precision;
};

export const roundDownWithDecimal = (num: number, precision: number) => {
  return Math.floor(num * 10 ** precision) / 10 ** precision;
};
