import { messageCode } from "@app/constants";
import {
  getLocaleContent,
  logger,
  withBaseResponse,
  setCacheRedis,
  getRedisMiddleware,
  dayjs,
} from "@app/helpers";

const EXPIRE_TIME_REDIS_MIDDLEWARE = process.env.EXPIRE_TIME_REDIS_MIDDLEWARE; //15s
const HANDLE_COLLATERAL_ROUTES = [
  "create-contract-loan",
  "place-pre-payment",
  "withdraw-collateral",
  "cancel-order-lend",
  "cancel-order-loan",
  "create-order-loan",
  "add-collateral",
];

export const requestLimitByRedis = (param?: number) => {
  return async (req, res, next) => {
    try {
      if (process.env.NODE_ENV === "development") {
        return next();
      }
      const now = dayjs().utc();
      //check gas orderLendId orderLoanId contractId
      const id = req.headers["V-User-Id"];

      //update interface of post APIs when change route or new route
      let idValidate;
      switch (true) {
        case !!req?.body?.orderLoanId:
          idValidate = req?.body?.orderLoanId;
          break;
        case !!req?.body?.contractId:
          idValidate = req?.body?.contractId;
          break;
        case !!req?.body?.orderLendId:
          idValidate = req?.body?.orderLendId;
          break;
        default:
          break;
      }

      const previousRequestIdOrder = await getRedisMiddleware(idValidate);
      const previousRequestId = await getRedisMiddleware(id);

      // if any of the ids have in cache then return 'try again'
      if (!previousRequestIdOrder && !previousRequestId) {
        await setCacheRedis(
          idValidate,
          now,
          Number(EXPIRE_TIME_REDIS_MIDDLEWARE),
        );
        await setCacheRedis(id, now, Number(EXPIRE_TIME_REDIS_MIDDLEWARE));
        // return res.status(200).send("all good");
        return next();
      } else {
        logger.log({
          level: "error",
          message: `Request Limit By Redis UserId spam: ${id}, body: ${JSON.stringify(
            req?.body,
          )}`,
        });
        const currentLocale =
          req.headers["X-CULTURE-CODE"] ?? req.headers["x-culture-code"];
        // const message = await getLocaleContent(
        //   req.headers["X-CULTURE-CODE"] ?? req.headers["x-culture-code"],
        //   "Có lỗi xảy ra",
        // );

        return res.status(200).send(
          withBaseResponse({
            success: false,
            message:
              currentLocale === "EN"
                ? "Please try again later"
                : "Vui lòng thử lại sau",
            code: messageCode.FAIL,
            data: null,
          }),
        );
      }
    } catch (error) {
      logger.log({
        level: "error",
        message: `Request Limit By Redis error: ${JSON.stringify(
          Object.keys(error?.response?.data).length
            ? error?.response?.data
            : error,
        )}`,
      });
      return res.status(400).send();
    }
  };
};
