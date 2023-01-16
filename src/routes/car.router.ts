import { authController } from "@app/controllers";
// import { RegisterDTO } from "@app/interfaces";
// import { dtoValidator } from "@app/middlewares";
import { Router } from "express";
// import { checkJwt } from "../middlewares/checkJwt";

export const carRouter = Router();

/**
 * @openapi
 * components:
 *  schemas:
 *    car:
 *      type: object
 *      required:
 *        - carName
 *      properties:
 *        carName:
 *          type: string
 *          default: toyota lexus
 */
/**
 * @openapi
 * '/api-v1/car/build':
 *  post:
 *     tags:
 *     - car
 *     summary: create a car
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/car'
 *     responses:
 *      200:
 *        description: Success
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
carRouter.post(
  "/api-v1/car/build",
  // dtoValidator(RegisterDTO, ["body"]),
  authController.authRegister,
);
