import { playerController } from "@app/controllers";
import { checkJwt } from "@app/middlewares";

import { Router } from "express";

export const playerRouter = Router();

/**
 * @openapi
 * '/api-v1/player':
 *  get:
 *     tags:
 *     - Player
 *     summary: Get player info
 *     responses:
 *      200:
 *        description: Success
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
playerRouter.get("/api-v1/player", [checkJwt], playerController.getInfo);
