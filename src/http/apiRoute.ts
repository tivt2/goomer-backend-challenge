import { Router } from "express";
import restaurantsRoute from "./restaurantsRoute";

const api = Router();

api.get("/ping", (_, res) => {
  res.json({ message: "pong" });
});

api.use("/restaurantes", restaurantsRoute);

export default api;
