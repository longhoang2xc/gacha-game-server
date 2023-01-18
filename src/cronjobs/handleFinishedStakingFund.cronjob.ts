import { app, hashEntityKeys } from "@app/constants";
import {
  dayjs,
  getRedisHash,
  logger,
  redisClient,
  setRedisHash,
} from "@app/helpers";
import type { IInvestingAccount, IStakingFund } from "@app/interfaces";

const cron = require("cron");

export const runCron = async () => {
  try {
    console.log("Cron jub running", dayjs().utc().toJSON());

    const stakingFunds = await redisClient.hVals(hashEntityKeys.staking);

    for (let item of stakingFunds) {
      const stakingItem: IStakingFund = JSON.parse(item);

      const timeDiffNowAndEndDate = dayjs()
        .utc()
        .diff(stakingItem?.dateEnd, app.STAKING_TIME_UNIT);

      const stakingDuration = dayjs(stakingItem?.dateEnd)
        .utc()
        .diff(stakingItem?.dateStart, app.STAKING_TIME_UNIT);

      // check if the end date is met and yet close
      if (timeDiffNowAndEndDate >= stakingDuration && !stakingItem?.isClosed) {
        //update investAccount and close this staking
        await setRedisHash(hashEntityKeys.staking, stakingItem?.id, {
          ...stakingItem,
          isClosed: true,
        } as IStakingFund);

        const investData = await getRedisHash(
          hashEntityKeys.investingAccount,
          stakingItem?.investingAccountId,
        );

        await setRedisHash(
          hashEntityKeys.investingAccount,
          stakingItem?.investingAccountId,
          {
            ...investData,
            amount: (investData?.amount || 0) + stakingItem?.returnAmount,
          } as IInvestingAccount,
        );

        //notify player
      }
    }
  } catch (error: any) {
    console.log(`runCron error`, error);
    logger.log({
      level: "error",
      message: `runCron error: ${
        typeof error === "object" ? JSON.stringify(error) : error
      }`,
    });
    return;
  }
};

export const handleFinishedStakingFund = new cron.CronJob({
  cronTime: "*/10 * * * * *",
  onTick: runCron,
  start: true,
  timeZone: "Asia/Ho_Chi_Minh", // Lưu ý set lại time zone cho đúng
});
