import { setCommonAuthorizationToken } from "@app/helpers/axios";
import { axios, logger } from "@app/helpers";
import type { Request, Response, NextFunction } from "express";
// import config from "../config/config";

export const checkJwt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //Get the jwt token from the head
  const jwtToken = <string>req?.headers["authorization"] ?? "";
  if (!jwtToken) {
    res.status(401).send();
    return;
  }

  const tokenArray = jwtToken.split(" ");
  const token = tokenArray?.length ? tokenArray[1] : "";
  setCommonAuthorizationToken(token as string);
  //Try to validate the token and get data
  try {
    const result = await axios.get(
      `${process.env["IDENTITY_URL"]}api-v1/accounts/validate-login-token`,
    );
    if (result?.data?.isTokenValid && result?.data?.userInfo?.id) {
      console.log(
        "USER INFO::",
        result?.data?.userInfo?.userName,
        result?.data?.userInfo?.id,
      );
      req.headers["V-User-Id"] = result?.data?.userInfo?.id;
      next();
      return;
    } else {
      res.status(401).send();
      return;
    }
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    logger.log({
      level: "error",
      message: `checkJwt  error: ${
        typeof error === "object" ? JSON.stringify(error) : error
      }`,
    });
    res.status(401).send();
    return;
  }
};
