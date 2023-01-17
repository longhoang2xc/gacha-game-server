// import { authLogin, authRegister, testSql } from "@server/controllers";

import { authController } from "@app/controllers";
import { LoginDTO, RegisterDTO } from "@app/interfaces";
import { dtoValidator } from "@app/middlewares";
import { Router } from "express";
// import { checkJwt } from "../middlewares/checkJwt";

export const authRouter = Router();

// router.post("/api-v1/login", authLogin);
/**
 * @openapi
 * components:
 *  schemas:
 *    Register:
 *      type: object
 *      required:
 *        - email
 *      properties:
 *        email:
 *          type: string
 *          default: abc@gmail.com
 *        nickName:
 *          type: string
 *          default: abcd
 *        fullName:
 *          type: string
 *          default: Jon Doe
 *        phone:
 *          type: string
 *          default: 0123456789
 *        password:
 *          type: string
 *          default: 123456789
 *        confirmPassword:
 *          type: string
 *          default: 123456789
 */
/**
 * @openapi
 * '/api-v1/register':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Register an account
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/Register'
 *     responses:
 *      200:
 *        description: Success
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
authRouter.post(
  "/api-v1/register",
  dtoValidator(RegisterDTO, ["body"]),
  authController.authRegister,
);

/**
 * @openapi
 * components:
 *  schemas:
 *    login:
 *      type: object
 *      required:
 *        - email
 *      properties:
 *        email:
 *          type: string
 *          default: abc@gmail.com
 *        password:
 *          type: string
 *          default: 123456789
 */
/**
 * @openapi
 * '/api-v1/login':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Player login
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/login'
 *     responses:
 *      200:
 *        description: Success
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
authRouter.post(
  "/api-v1/login",
  dtoValidator(LoginDTO, ["body"]),
  authController.authLogin,
);
