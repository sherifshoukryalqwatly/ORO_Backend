import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "../docs/swagger.js";

export const swaggerSetup = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};