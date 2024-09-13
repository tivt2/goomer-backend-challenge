import { Router } from "express";
import { RestaurantController } from "../features/restaurants/restaurant.controller";

import productsRoute from "./productsRoute";

const restaurantController = new RestaurantController();

const restaurantsRoute = Router();

restaurantsRoute.get("/", async (req, res) => {
  const { status, payload } = await restaurantController.getAll(req);
  res.status(status).json(payload);
});

restaurantsRoute.post("/", async (req, res) => {
  const { status, payload } = await restaurantController.postOne(req);
  res.status(status).json(payload);
});

restaurantsRoute.get("/:id", async (req, res) => {
  const { status, payload } = await restaurantController.getOne(req);
  res.status(status).json(payload);
});

restaurantsRoute.patch("/:id", async (req, res) => {
  const { status, payload } = await restaurantController.patchOne(req);
  res.status(status).json(payload);
});

restaurantsRoute.delete("/:id", async (req, res) => {
  const { status, payload } = await restaurantController.deleteOne(req);
  res.status(status).json(payload);
});

restaurantsRoute.use("/:restaurantId/produtos", productsRoute);

export default restaurantsRoute;
