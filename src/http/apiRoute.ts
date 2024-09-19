import { Router } from "express";
import restaurantsRoute from "./restaurantsRoute";

import swaggerUi from "swagger-ui-express";
import swaggerJson from "./swagger.json";

const api = Router();

api.get("/ping", (_, res) => {
  res.json({ message: "pong" });
});

api.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));

api.use("/restaurantes", restaurantsRoute);

export default api;
