import type express from "express";
import * as jwt from "jsonwebtoken";
export const checkJwt = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  //Get the jwt token from the head
  const token = <string>(
    req.headers["authorization"]?.replace("Bearer", "")?.trim()
  );
  let jwtPayload;
  //Try to validate the token and get data
  try {
    jwtPayload = jwt.verify(
      token,
      process.env["JWT_SECRET_KEY"] as string,
    ) as any;
    req.headers["Player-Id"] = jwtPayload.playerId;
    next();
    return;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send();
    return;
  }
};
