import { logger, withBaseResponse } from "@app/helpers";
import type { Request, Response, NextFunction } from "express";
// register user new and not duplicated email
export const authRegister = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const body = req.body;

  try {
    //find unique email
    // const findWorker = await findEmployeeByKey(
    //   "NormalizedEmail",
    //   body?.email?.toString(),
    // );
    // if (findWorker?.success) {
    //   res.send(
    //     baseResponse({
    //       success: false,
    //       message: "Email already taken",
    //     }),
    //   );
    //   return;
    // }

    // new user data parse to string
    if (!!body?.email && !!body?.fullname && !!body?.phone) {
      const resp = "a";
      res.send(resp);
      return;
    }

    res.send(
      withBaseResponse({
        success: false,
        message: "Please input required fields",
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
