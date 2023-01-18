import { hashEntityKeys } from "@app/constants";
import { getRedisHash, logger, withBaseResponse } from "@app/helpers";
import type { Request, Response } from "express";

const getInfo = async (req: Request, res: Response) => {
  try {
    const playerId = req.headers["Player-Id"] as string;

    const dataPlayer = await getRedisHash(hashEntityKeys.player, playerId);
    const investingAccount = await getRedisHash(
      hashEntityKeys.investingAccount,
      dataPlayer?.investingAccountId,
    );

    delete dataPlayer.password;
    res.send(
      withBaseResponse({
        success: true,
        message: "withdraw staking success",
        data: { dataPlayer, investingAccount },
      }),
    );
    return;
  } catch (error: any) {
    console.log(`get Info error`, error);
    logger.log({
      level: "error",
      message: `get Info error: ${
        typeof error === "object" ? JSON.stringify(error) : error
      }`,
    });
    res.status(400).send("Bad Request");
    return;
  }
};
export const playerController = {
  getInfo,
};
