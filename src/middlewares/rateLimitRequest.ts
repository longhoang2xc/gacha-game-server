import { messageCode } from "@app/constants";
import { withBaseResponse } from "@app/helpers";
import rateLimit from "express-rate-limit";

// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

export const apiPostLimiter = rateLimit({
  // windowMs: 60 * 60 * 1000, // 1 hour
  windowMs: 1000, // 1 second
  max: 1, // Limit each IP to 5 create account requests per `window` (here, per hour)
  message: "Có lỗi xảy ra, vui lòng thử lại sau",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (request, response, _next, _options) => {
    const currentLocale =
      request.headers["X-CULTURE-CODE"] ?? request.headers["x-culture-code"];

    return response.status(200).send(
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
  },
});
