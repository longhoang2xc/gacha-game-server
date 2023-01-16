// import { authLogin, authRegister, testSql } from "@server/controllers";

import { RegisterDTO } from "@app/interfaces";
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
 *          default: zxc
 *        confirmPassword:
 *          type: string
 *          default: zxc
 */
/**
 * @openapi
 * '/api-v1/register':
 *  post:
 *     tags:
 *     - register
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
authRouter.post("/api-v1/register", dtoValidator(RegisterDTO, ["body"]), () => {
  console.log("abc");
  return null;
});
