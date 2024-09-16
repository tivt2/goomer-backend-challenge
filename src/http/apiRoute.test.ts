import { Server } from "http";
import express from "express";

import dotenv from "dotenv";
dotenv.config();
import { env } from "process";

import { describe, test, expect, beforeAll, afterAll } from "vitest";
import api from "./apiRoute";
import { PublicRestaurant } from "../features/restaurants/restaurant.type";

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
  const restaurantEntry: PublicRestaurant = {
    id: "temp_id",
    name: "foo_name",
    address: "foo_address",
    picture: "foo_picture",
    operations: [
      {
        start_day: "monday",
        end_day: "monday",
        start_time: "11:00",
        end_time: "16:00",
      },
    ],
  };
  test("GET:/restaurantes", async () => {
    const response = await sendRequest("/restaurantes", "GET");
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.restaurants).toBeTruthy();
    expect(payload.restaurants).toEqual([]);
  });

  test("POST:/restaurantes", async () => {
    const response = await sendRequest("/restaurantes", "POST", {
      restaurant: restaurantEntry,
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.restaurant).toBeTruthy();
    restaurantEntry.id = payload.restaurant.id;
    expect(payload.restaurant).toEqual(restaurantEntry);
  });

  test("GET:/restaurantes/:id", async () => {
    const response = await sendRequest(
      `/restaurantes/${restaurantEntry.id}`,
      "GET",
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.restaurant).toBeTruthy();
    expect(payload.restaurant).toEqual(restaurantEntry);
  });

  test("PATCH:/restaurantes/:id", async () => {
    restaurantEntry.name = "foo_restaurant_updated";
    restaurantEntry.address = "foo_address_updated";
    restaurantEntry.picture = "foo_picture_updated";
    restaurantEntry.operations.push({
      start_day: "wednesday",
      end_day: "sunday",
      start_time: "08:00",
      end_time: "20:00",
    });

    const response = await sendRequest(
      `/restaurantes/${restaurantEntry.id}`,
      "PATCH",
      {
        updateData: restaurantEntry,
      },
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.restaurant).toBeTruthy();
    expect(payload.restaurant).toEqual(restaurantEntry);
  });

  test("DELETE:/restaurantes/:id", async () => {
    const response = await sendRequest(
      `/restaurantes/${restaurantEntry.id}`,
      "DELETE",
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.restaurant).toBeTruthy();
    expect(payload.restaurant).toEqual(restaurantEntry);
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
