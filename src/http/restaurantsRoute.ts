import { Router } from "express";
import productsRoute from "./produtosRoute";

const restaurantsRoute = Router();

restaurantsRoute.get("/", (req, res) => {
  // listar todos os restaurantes
});

restaurantsRoute.post("/", (req, res) => {
  // cadastrar novo restaurante
});

restaurantsRoute.get("/:id", (req, res) => {
  // listar dados de um restaurante
});

restaurantsRoute.patch("/:id", (req, res) => {
  // alterar dados de um restaurante
});

restaurantsRoute.delete("/:id", (req, res) => {
  // excluir um restaurante
});

restaurantsRoute.use("/:id/produtos", productsRoute);

export default restaurantsRoute;
