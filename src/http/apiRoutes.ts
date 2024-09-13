import { Router } from "express";

const api = Router();

api.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

export default api;
