import type express from "express";
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
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
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

    let errorValidate: any[] = [];

    // validating and check the errors, throw the errors if exist
    await validate(objInstance).then(errors => {
      errorValidate = errors;
    });

    if (errorValidate?.length > 0) {
      // const currentLocale =
      //   req.headers["X-CULTURE-CODE"] ?? req.headers["x-culture-code"];

      const err = errorValidate.map(({ constraints }) =>
        Object.values(constraints),
      );
      const mes = `${err} validation fail`;

      res.status(400).send(
        withBaseResponse({
          success: false,
          message: mes,
          data: null,
        }),
      );
      return;
    }

    // implement business logic
    next();
    return;
  };
};
