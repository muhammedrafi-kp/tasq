import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tasq API",
      version: "1.0.0",
      description: "Task Management System API Documentation",
    },
    servers: [
      {
        url: "http://localhost:3000/api", // change to production URL later
      },
    ],
  },
  // Path to the API docs (your routes files)
  apis: ["./src/swagger/*.ts"], 
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
