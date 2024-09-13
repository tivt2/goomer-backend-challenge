import { Router } from "express";
import { ProductController } from "../features/products/product.controller";

const productController = new ProductController();

const productsRoute = Router();

productsRoute.get("/", async (req, res) => {
  const { status, payload } = await productController.getAll(req);
  res.status(status).json(payload);
});

productsRoute.post("/", async (req, res) => {
  const { status, payload } = await productController.postOne(req);
  res.status(status).json(payload);
});

productsRoute.patch("/:id", async (req, res) => {
  const { status, payload } = await productController.patchOne(req);
  res.status(status).json(payload);
});

productsRoute.delete("/:id", async (req, res) => {
  const { status, payload } = await productController.deleteOne(req);
  res.status(status).json(payload);
});

export default productsRoute;
