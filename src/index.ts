import express from "express";
import api from "./http/apiRoute";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();
import { env } from "process";

const PORT = Number(env.PORT || 3000);
const app = express();

app.use(cors());
app.use(express.json());

app.use("/v1", api);

app.listen(PORT, () => {
  console.log(`Server is listening at port: [${PORT}]`);
});
