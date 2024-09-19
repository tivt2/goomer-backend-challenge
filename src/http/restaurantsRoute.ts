import { Router } from "express";
import { RestaurantController } from "../features/restaurants/restaurant.controller";
import { PGRestaurantRepository } from "../data/pg/pgRestaurant.repository";
import { ZodRestaurantValidator } from "../validation/zod/zodRestaurant.validator";

import productsRoute from "./productsRoute";

const zodRestaurantValidator = new ZodRestaurantValidator();
const pgRestaurantRepository = new PGRestaurantRepository();
const restaurantController = new RestaurantController(
  pgRestaurantRepository,
  zodRestaurantValidator,
);

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
