import type { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const options: swaggerJsdoc.Options = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vconomics Vlending REST API Docs",
      version: "0.0.1",
    },
    basePath: "/",
    host:
      process.env["NODE_ENV"] === "development"
        ? "localhost:5000"
        : "sandbox-vlending.vconomics.io/",
    consumes: ["application/json"],
    produces: ["application/json"],
    schemes: ["http"],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    process.env["NODE_ENV"] === "development"
      ? "./src/routes/*.ts"
      : "./dist/routes/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options) as any;

export const swaggerDocs = (app: Express, port: number | string) => {
  // Swagger page
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  console.log(`Docs available at http://localhost:${port}/swagger`);
};
