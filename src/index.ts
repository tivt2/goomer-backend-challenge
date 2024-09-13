import express from "express";
import api from "./http/apiRoutes";

import dotenv from "dotenv";
dotenv.config();
import { env } from "process";

const PORT = Number(env.PORT || 3000);
const app = express();

app.use(express.json());

app.use(api);

app.listen(PORT, () => {
  console.log(`Server is listening at port: [${PORT}]`);
});
