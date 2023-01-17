import { carController } from "@app/controllers";
import { CarDTO, CarRaceDTO } from "@app/interfaces";
import { checkJwt, dtoValidator } from "@app/middlewares";
import { Router } from "express";

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
 *     summary: Create a car
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
  [checkJwt, dtoValidator(CarDTO, ["body"])],
  carController.buildCar,
);

/**
 * @openapi
 * components:
 *  schemas:
 *    race:
 *      type: object
 *      required:
 *        - carId
 *      properties:
 *        difficultLevel:
 *          type: number
 *          default: 1
 *        carId:
 *          type: string
 *          default: e5100294-428e-4f63-a648-ec74eca491f1
 */
/**
 * @openapi
 * '/api-v1/car/start-race':
 *  post:
 *     tags:
 *     - car
 *     summary: race your car
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/race'
 *     responses:
 *      200:
 *        description: Success
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
carRouter.post(
  "/api-v1/car/start-race",
  [checkJwt, dtoValidator(CarRaceDTO, ["body"])],
  carController.raceCar,
);
