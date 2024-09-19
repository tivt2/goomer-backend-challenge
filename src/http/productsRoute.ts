import { Router } from "express";
import { ProductController } from "../features/products/product.controller";
import { PGProductRepository } from "../data/pg/pgProduct.repository";
import { ZodProductValidator } from "../validation/zod/zodProduct.validator";

const zodProductValidator = new ZodProductValidator();
const pgProductRepository = new PGProductRepository();
const productController = new ProductController(
  pgProductRepository,
  zodProductValidator,
);

const productsRoute = Router({ mergeParams: true });

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
