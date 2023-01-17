import { carController } from "@app/controllers";
import { CarMaintainDTO } from "@app/interfaces";
import { checkJwt, dtoValidator } from "@app/middlewares";
import { Router } from "express";

export const playerRouter = Router();

/**
 * @openapi
 * components:
 *  schemas:
 *    Player:
 *      type: object
 *      required:
 *        - pageIndex
 *      properties:
 *        pageIndex:
 *          type: number
 *          default: 1
 */
/**
 * @openapi
 * '/api-v1/player':
 *  get:
 *     tags:
 *     - Player
 *     summary: Get player info
 *     parameters:
 *       - in: query
 *         name: pageIndex
 *         type: integer
 *         require: true
 *         default: 1
 *     responses:
 *      200:
 *        description: Success
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
playerRouter.get(
  "/api-v1/player",
  [checkJwt, dtoValidator(CarMaintainDTO, ["body"])],
  carController.maintainCar,
);
