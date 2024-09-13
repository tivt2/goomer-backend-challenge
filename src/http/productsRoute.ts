import { Router } from "express";

const productsRoute = Router();

productsRoute.get("/", (req, res) => {
  // listar todos os produtos de um restaurante
});

productsRoute.post("/", (req, res) => {
  // criar um produto de um restaurante
});

productsRoute.patch("/:id", (req, res) => {
  // alterar um produto de um restaurante
});

productsRoute.delete("/:id", (req, res) => {
  // excluir um produto de um restaurante
});

productsRoute.use("/:id/produtos");

export default productsRoute;
