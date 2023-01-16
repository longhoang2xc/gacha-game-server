import { logger, withBaseResponse } from "@app/helpers";
import type { ITestCreateBody } from "@app/interfaces";
import type { Request, Response } from "express";

// import { abc } from "@app/cronjobs";

const all = async (
  _req: Request,
  res: Response,
): Promise<Response<Record<string, String[]>>> => {
  // return TestRepository.all(req)
  try {
    const rawData = ["oke"];

    return res.send(rawData);
  } catch (error) {
    logger.log({
      level: "error",
      message: `Test controller error: ${error}`,
    });
    return res.status(403).send();
  }
};

// const one = async (req: Request, res: Response) => {
//   // return TestRepository.findOne(req.params.id)
// };

const create = async (
  req: Request,
  res: Response,
): Promise<Response<Record<string, string>>> => {
  try {
    const body = req.body as ITestCreateBody;
    const result = body;
    return res.send(
      withBaseResponse({
        success: true,
        message: "Thêm mới thành công",
        data: result,
      }),
    );
  } catch (err) {
    logger.log({
      level: "error",
      message: `Test controller error: ${err}`,
    });
    return res.status(403).send();
  }
};

export const testController = {
  create,
  all,
};
