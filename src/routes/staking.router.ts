import { stakingController } from "@app/controllers";
import { StakingDTO, StakingWithdrawDTO } from "@app/interfaces";
import { checkJwt, dtoValidator } from "@app/middlewares";
import { Router } from "express";

export const stakingRouter = Router();

/**
 * @openapi
 * components:
 *  schemas:
 *    staking:
 *      type: object
 *      required:
 *        - amount
 *        - stakingLevel
 *      properties:
 *        amount:
 *          type: number
 *          default: 100
 *        stakingLevel:
 *          type: number
 *          default: 1
 */
/**
 * @openapi
 * '/api-v1/staking/create':
 *  post:
 *     tags:
 *     - Staking
 *     summary: Create a staking
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/staking'
 *     responses:
 *      200:
 *        description: Success
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

stakingRouter.post(
  "/api-v1/staking/create",
  [checkJwt, dtoValidator(StakingDTO, ["body"])],
  stakingController.createStaking,
);

/**
 * @openapi
 * components:
 *  schemas:
 *    staking-withdraw:
 *      type: object
 *      required:
 *        - amount
 *        - withdrawFull
 *      properties:
 *        amount:
 *          type: number
 *          default: 100
 *        withdrawFull:
 *          type: boolean
 *          default: false
 */
/**
 * @openapi
 * '/api-v1/staking/withdraw-to-bank':
 *  post:
 *     tags:
 *     - Staking
 *     summary: withdraw investing account
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/staking-withdraw'
 *     responses:
 *      200:
 *        description: Success
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

stakingRouter.post(
  "/api-v1/staking/withdraw-to-bank",
  [checkJwt, dtoValidator(StakingWithdrawDTO, ["body"])],
  stakingController.withdrawStakingToBank,
);
