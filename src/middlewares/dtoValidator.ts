import { withBaseResponse } from "@app/helpers";
import { ClassConstructor, plainToClass } from "class-transformer";
import { validate } from "class-validator";
type TTypes = "body" | "params" | "query";
/**
 *
 * Validate the payload will be sending or receiving, make sure the data is suitable
 *
 * @param dto The DTO object to validate
 * @param obj The object recieved from response body
 *
 * @example
 * ```ts
 *  await validatorDto(TestDTO, response.data.employee);
 *
 * ```
 */

export const dtoValidator = <T extends ClassConstructor<any>>(
  dto: T,
  types: TTypes[],
) => {
  return async (req, res, next) => {
    let obj = {};
    types.forEach((type: TTypes) => {
      switch (type) {
        case "body":
          Object.assign(obj, req.body);
          break;
        case "query":
          Object.assign(obj, req.query);
          break;
        case "params":
          Object.assign(obj, req.params);
          break;
        default:
        // code block
      }
    });
    // transform the literal object to class object
    const objInstance = plainToClass(dto, obj);
    // console.log("DTO Validator: ", objInstance);
    let errorValidate;
    // validating and check the errors, throw the errors if exist
    await validate(objInstance).then(errors => {
      errorValidate = errors;
    });

    if (errorValidate?.length > 0) {
      const currentLocale =
        req.headers["X-CULTURE-CODE"] ?? req.headers["x-culture-code"];

      const err = errorValidate.map(({ property }) => property);
      const mes =
        currentLocale === "EN" ? `${err} validate fail` : `${err} xảy ra lỗi`;

      res.status(400).send(
        withBaseResponse({
          success: false,
          message: mes,
          data: null,
        }),
      );
      return;
    }

    // implement your business logic using 'myParam'
    next();
    return;
  };
};
