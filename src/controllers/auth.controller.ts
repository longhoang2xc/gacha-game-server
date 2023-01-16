import { app, hashEntityKeys } from "@app/constants";
import {
  getRedis,
  logger,
  setRedis,
  setRedisHash,
  withBaseResponse,
} from "@app/helpers";
import type { IPlayer } from "@app/interfaces";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { v4 as uuidv4 } from "uuid";
// register user new and not duplicated email
const authRegister = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    //find unique email
    const findEmail = await getRedis(body?.email);

    if (findEmail) {
      return res.send(
        withBaseResponse({
          success: false,
          message: "email is already taken",
          data: null,
        }),
      );
    }

    const newId = uuidv4();

    //set key pare email and id of player
    await setRedis(body?.email, newId);

    //hash the password
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(body?.password, saltRounds);

    //prepare and save date to storage
    delete body?.confirmPassword;
    const data: IPlayer = {
      bankBalance: app.INITIAL_FUND,
      id: newId,
      ...body,
      password: hashPassword,
    };
    await setRedisHash(hashEntityKeys.player, newId, data);

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

export const authController = {
  authRegister,
};
