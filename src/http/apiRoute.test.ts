import { Server } from "http";
import express from "express";

import dotenv from "dotenv";
dotenv.config();
import { env } from "process";

import { describe, test, expect, beforeAll, afterAll } from "vitest";
import api from "./apiRoute";

const PORT = Number(env.PORT || 3000);

async function sendRequest(endpoint: string, method: string, payload?: any) {
  const response = fetch(`http://localhost:${PORT}` + endpoint, {
    method,
    headers: !payload ? undefined : { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return response;
}

let server: Server;

beforeAll(async () => {
  const app = express();
  app.use(express.json());
  app.use(api);
  server = app.listen(PORT, () => {
    console.log(`Test server running at port: [${PORT}]`);
  });

  const response = await sendRequest("/ping", "GET");
  const payload = await response.json();
  expect(response.status).toBe(200);
  expect(payload).toEqual({ message: "pong" });
});

describe("/api/restaurantes endpoint tests", () => {
  test("GET:/restaurantes", async () => {
    const response = await sendRequest("/restaurantes", "GET");
    expect(response.status).toBe(200);
  });

  test("POST:/restaurantes", async () => {
    const response = await sendRequest("/restaurantes", "POST", {
      restaurant: {},
    });
    expect(response.status).toBe(200);
  });

  test("GET:/restaurantes/:id", async () => {
    const response = await sendRequest(`/restaurantes/${"temp_id"}`, "GET");
    expect(response.status).toBe(200);
  });

  test("PATCH:/restaurantes/:id", async () => {
    const response = await sendRequest(`/restaurantes/${"temp_id"}`, "PATCH", {
      updateData: {},
    });
    expect(response.status).toBe(200);
  });

  test("DELETE:/restaurantes/:id", async () => {
    const response = await sendRequest(`/restaurantes/${"temp_id"}`, "DELETE");
    expect(response.status).toBe(200);
  });
});

describe("/api/restaurantes/:restaurantId/produtos endpoint tests", () => {
  const baseEndPoint = `/restaurantes/${"temp_restaurantId"}`;
  test("GET:/produtos", async () => {
    const response = await sendRequest(baseEndPoint + "/produtos", "GET");
    expect(response.status).toBe(200);
  });

  test("POST:/produtos", async () => {
    const response = await sendRequest(baseEndPoint + "/produtos", "POST", {
      restaurant: {},
    });
    expect(response.status).toBe(200);
  });

  test("PATCH:/produtos/:id", async () => {
    const response = await sendRequest(
      `${baseEndPoint}/produtos/${"temp_id"}`,
      "PATCH",
      {
        updateData: {},
      },
    );
    expect(response.status).toBe(200);
  });

  test("DELETE:/produtos/:id", async () => {
    const response = await sendRequest(
      `${baseEndPoint}/produtos/${"temp_id"}`,
      "DELETE",
    );
    expect(response.status).toBe(200);
  });
});

afterAll(() => {
  server.close();
});