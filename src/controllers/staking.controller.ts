import { app, hashEntityKeys, stakingScale } from "@app/constants";
import {
  dayjs,
  getRedisHash,
  logger,
  randomIntFromInterval,
  setRedisHash,
  withBaseResponse,
} from "@app/helpers";
import type { IInvestingAccount, IPlayer, IStakingFund } from "@app/interfaces";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const createStaking = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const playerId = req.headers["Player-Id"] as string;

    const dataPlayer = await getRedisHash(hashEntityKeys.player, playerId);

    // check balance
    if (dataPlayer?.bankBalance < body?.amount) {
      res.send(
        withBaseResponse({
          success: false,
          message: "insufficient bank balance",
          data: null,
        }),
      );
      return;
    }

    const stakingDetail = stakingScale()[
      `SCALE_${body?.stakingLevel}` as keyof typeof stakingScale
    ] as any;

    const newId = uuidv4();

    let lossInitialFundAmount = 0;
    let returnAmount = 0;

    const isLossInitialAmount =
      randomIntFromInterval(1, 100) <= stakingDetail.LOSS_PERCENT
        ? true
        : false;

    //calculate loss fund amount and return amount
    if (isLossInitialAmount) {
      lossInitialFundAmount =
        (stakingDetail.LOSS_INITIAL_FUND_PERCENT / 100) * body?.amount;
      returnAmount = body?.amount - lossInitialFundAmount;
    } else {
      returnAmount =
        body?.amount +
        (stakingDetail.RETURN_PERCENT / 100) * body?.amount -
        lossInitialFundAmount;
    }

    const now = dayjs().utc();

    const stakingData: IStakingFund = {
      id: newId,
      playerId: playerId,
      investingAccountId: dataPlayer?.investingAccountId,
      amount: body?.amount,
      scale: `SCALE_${body?.stakingLevel}`,
      returnPercent: stakingDetail.RETURN_PERCENT,
      returnAmount: returnAmount, //profit
      lossPercent: stakingDetail.LOSS_PERCENT,
      lossInitialFundPercent: stakingDetail.LOSS_INITIAL_FUND_PERCENT,
      lossInitialFundAmount: lossInitialFundAmount,
      dateStart: now as unknown as string,
      dateEnd: now.add(
        stakingDetail.DURATION_DAYS,
        app.STAKING_TIME_UNIT,
      ) as unknown as string,
      isClosed: false,
    };

    await setRedisHash(hashEntityKeys.staking, newId, stakingData);

    // update player bank balance
    const playerUpdatedData = {
      ...dataPlayer,
      bankBalance: (dataPlayer?.bankBalance ?? 0) - body?.amount,
    };
    await setRedisHash(hashEntityKeys.player, playerId, playerUpdatedData);

    const dataRespondStaking = {
      id: stakingData.id,
      amount: stakingData.amount,
      scale: stakingData.scale,
      dateStart: stakingData.dateStart,
      dateEnd: stakingData.dateEnd,
      isClosed: stakingData.isClosed,
    };
    delete playerUpdatedData.password;
    res.send(
      withBaseResponse({
        success: true,
        message: "staking success",
        data: {
          stakingData: dataRespondStaking,
          playerData: playerUpdatedData,
        },
      }),
    );
    return;
  } catch (error: any) {
    console.log(`staking error`, error);
    logger.log({
      level: "error",
      message: `staking error: ${
        typeof error === "object" ? JSON.stringify(error) : error
      }`,
    });
    res.status(400).send("Bad Request");
    return;
  }
};

const withdrawStakingToBank = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const playerId = req.headers["Player-Id"] as string;

    const dataPlayer: IPlayer = await getRedisHash(
      hashEntityKeys.player,
      playerId,
    );
    const investingAccount: IInvestingAccount = await getRedisHash(
      hashEntityKeys.investingAccount,
      dataPlayer?.investingAccountId,
    );

    // check invest account amount
    if (body.amount > investingAccount?.amount) {
      res.send(
        withBaseResponse({
          success: true,
          message: "investing account is insufficient",
          data: null,
        }),
      );
      return;
    }

    let newDataInvest;

    //update player's bank and subtract invest account
    if (body.withdrawFull || body.amount === investingAccount?.amount) {
      await setRedisHash(hashEntityKeys.player, playerId, {
        ...dataPlayer,
        bankBalance: dataPlayer?.bankBalance || 0 + investingAccount?.amount,
      });

      newDataInvest = {
        ...investingAccount,
        amount: 0,
      };
      await setRedisHash(
        hashEntityKeys.investingAccount,
        investingAccount?.id,
        newDataInvest,
      );
    } else {
      await setRedisHash(hashEntityKeys.player, playerId, {
        ...dataPlayer,
        bankBalance: dataPlayer?.bankBalance || 0 + body.amount,
      });

      newDataInvest = {
        ...investingAccount,
        amount: investingAccount?.amount - body.amount,
      };
      await setRedisHash(
        hashEntityKeys.investingAccount,
        investingAccount?.id,
        newDataInvest,
      );
    }

    res.send(
      withBaseResponse({
        success: true,
        message: "withdraw staking success",
        data: newDataInvest,
      }),
    );
    return;
  } catch (error: any) {
    console.log(`withdraw staking error`, error);
    logger.log({
      level: "error",
      message: `withdraw staking error: ${
        typeof error === "object" ? JSON.stringify(error) : error
      }`,
    });
    res.status(400).send("Bad Request");
    return;
  }
};
export const stakingController = {
  createStaking,
  withdrawStakingToBank,
};
