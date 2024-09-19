import express, { Response } from "express";
import api from "./http/apiRoute";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();
import { env } from "process";
import { ApiError } from "./commom/apiError";

const PORT = Number(env.PORT || 3000);
const app = express();

app.use(cors());
app.use(express.json());

app.use("/v1", api);

app.use((err: Error, _: any, res: Response, __: any) => {
  console.error(err.stack);
  const apiError = new ApiError(
    500,
    "Something unexpected happend, if it persist please contact us.",
  );
  const { status, payload } = apiError.response;
  res.status(status).json(payload);
});

app.listen(PORT, () => {
  console.log(`Server is listening at port: [${PORT}]`);
});
