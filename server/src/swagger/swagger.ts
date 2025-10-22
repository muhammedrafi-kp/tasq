import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { configDotenv } from "dotenv";

configDotenv();

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
                url: process.env.API_LOCAL_URL || "http://localhost:3000/api",
                description: "Local server",
            },
            {
                url: process.env.API_PROD_URL || "https://tasq.api.mhdrafi.online/api",
                description: "Production server",
            },
        ],
    },
    apis: ["./src/swagger/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
