import { app, hashEntityKeys } from "@app/constants";
import {
  getRedis,
  getRedisHash,
  logger,
  setRedis,
  setRedisHash,
  withBaseResponse,
} from "@app/helpers";
import type { IPlayer } from "@app/interfaces";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { v4 as uuidv4 } from "uuid";
import * as jwt from "jsonwebtoken";

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
    const investingAccountId = uuidv4();

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
      isHaveFirstCar: false,
      investingAccountId: investingAccountId,
    };
    await setRedisHash(hashEntityKeys.player, newId, data);

    //create investing account
    await setRedisHash(hashEntityKeys.investingAccount, investingAccountId, {
      id: investingAccountId,
      playerId: newId,
      amount: 0,
    });

    res.send(
      withBaseResponse({
        success: true,
        message: "register success",
        data: {
          id: newId,
          email: body.email,
          nickName: body.nickName,
          fullName: body.fullName,
          phone: body.phone,
          isHaveFirstCar: false,
          investingAccountId: investingAccountId,
        },
      }),
    );
    return;
  } catch (error: any) {
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

const authLogin = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    //find unique email
    const findByEmail = await getRedis(body?.email);

    if (!findByEmail) {
      return res.send(
        withBaseResponse({
          success: false,
          message: "email is not valid",
          data: null,
        }),
      );
    }

    const dataPlayer = await getRedisHash(hashEntityKeys.player, findByEmail);

    const hashPassword = await bcrypt.compare(
      body?.password,
      dataPlayer?.password,
    );

    if (!hashPassword) {
      return res.send(
        withBaseResponse({
          success: false,
          message: "email or password is incorrect",
          data: null,
        }),
      );
    }

    const token = jwt.sign(
      {
        playerId: dataPlayer?.id,
        email: dataPlayer?.email,
      },
      process.env["JWT_SECRET_KEY"] || "",
      { expiresIn: "7d" },
    );

    delete dataPlayer.password;
    res.send(
      withBaseResponse({
        success: true,
        message: "login success",
        data: {
          token,
          dataPlayer,
        },
      }),
    );
    return;
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `login error: ${
        typeof error === "object" ? JSON.stringify(error) : error
      }`,
    });
    res.status(400).send("Bad Request");
    return;
  }
};

export const authController = {
  authRegister,
  authLogin,
};
