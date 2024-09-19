import { Server } from "http";
import express from "express";

import dotenv from "dotenv";
dotenv.config();
import { env } from "process";

import { describe, test, expect, beforeAll, afterAll } from "vitest";
import api from "./apiRoute";
import { PublicRestaurant } from "../features/restaurants/restaurant.type";
import { PublicProduct } from "../features/products/product.type";

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
  expect(response.status, payload.error).toBe(200);
  expect(payload).toEqual({ message: "pong" });
});

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

describe("/api/restaurantes endpoint tests", () => {
  test("GET:/restaurantes", async () => {
    const response = await sendRequest("/restaurantes", "GET");
    const payload = await response.json();

    expect(response.status, payload.error).toBe(200);
    expect(payload.restaurants).toBeTruthy();
    expect(payload.restaurants).toEqual([]);
  });

  test("POST:/restaurantes", async () => {
    const response = await sendRequest(
      "/restaurantes",
      "POST",
      restaurantEntry,
    );
    const payload = await response.json();

    expect(response.status, payload.error).toBe(200);
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

    expect(response.status, payload.error).toBe(200);
    expect(payload.restaurant).toBeTruthy();
    expect(payload.restaurant).toEqual(restaurantEntry);
  });

  test("PATCH:/restaurantes/:id update all restaurant data", async () => {
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
      restaurantEntry,
    );
    const payload = await response.json();

    expect(response.status, payload.error).toBe(200);
    expect(payload.restaurant).toBeTruthy();
    expect(payload.restaurant).toEqual(restaurantEntry);
  });

  test("PATCH:/restaurantes/:id update only operations data", async () => {
    restaurantEntry.operations.push({
      start_day: "saturday",
      end_day: "saturday",
      start_time: "18:00",
      end_time: "20:00",
    });

    const response = await sendRequest(
      `/restaurantes/${restaurantEntry.id}`,
      "PATCH",
      { operations: restaurantEntry.operations },
    );
    const payload = await response.json();

    expect(response.status, payload.error).toBe(200);
    expect(payload.restaurant).toBeTruthy();
    expect(payload.restaurant).toEqual(restaurantEntry);
  });

  test("PATCH:/restaurantes/:id update only restaurant data", async () => {
    restaurantEntry.name = "another_foo_restaurant_updated";
    restaurantEntry.address = "another_foo_address_updated";
    restaurantEntry.picture = "another_foo_picture_updated";

    const response = await sendRequest(
      `/restaurantes/${restaurantEntry.id}`,
      "PATCH",
      {
        name: restaurantEntry.name,
        address: restaurantEntry.address,
        picture: restaurantEntry.picture,
      },
    );
    const payload = await response.json();

    expect(response.status, payload.error).toBe(200);
    expect(payload.restaurant).toBeTruthy();
    expect(payload.restaurant).toEqual(restaurantEntry);
  });

  test("DELETE:/restaurantes/:id", async () => {
    const response = await sendRequest(
      `/restaurantes/${restaurantEntry.id}`,
      "DELETE",
    );
    const payload = await response.json();

    expect(response.status, payload.error).toBe(200);
    expect(payload.restaurant).toBeTruthy();
    expect(payload.restaurant).toEqual(restaurantEntry);
  });
});

const productEntry: PublicProduct = {
  id: "temp_id",
  name: "foo_product",
  price: 100,
  category: "foo_category",
  picture: "foo_prod_pic",
  promotion: null,
};

describe("/api/restaurantes/:restaurantId/produtos endpoint tests", () => {
  let baseEndPoint: string;

  beforeAll(async () => {
    const response = await sendRequest(
      "/restaurantes",
      "POST",
      restaurantEntry,
    );
    const payload = await response.json();

    expect(response.status, payload.error).toBe(200);
    expect(payload.restaurant).toBeTruthy();
    baseEndPoint = `/restaurantes/${payload.restaurant.id}`;
  });

  test("GET:/produtos", async () => {
    const response = await sendRequest(`${baseEndPoint}/produtos`, "GET");
    const payload = await response.json();

    expect(response.status, payload.error).toBe(200);
    expect(payload.products).toBeTruthy();
    expect(payload.products).toEqual([]);
  });

  test("POST:/produtos", async () => {
    const response = await sendRequest(
      baseEndPoint + "/produtos",
      "POST",
      productEntry,
    );
    const payload = await response.json();

    expect(response.status, payload.error).toBe(200);
    expect(payload.product).toBeTruthy();
    productEntry.id = payload.product.id;
    expect(payload.product).toEqual(productEntry);
  });

  test("PATCH:/produtos/:id add product promotion", async () => {
    productEntry.promotion = {
      description: "new_foo_description",
      price: 120,
      operations: [
        {
          start_day: "monday",
          end_day: "monday",
          start_time: "10:00",
          end_time: "20:00",
        },
      ],
    };

    const response = await sendRequest(
      `${baseEndPoint}/produtos/${productEntry.id}`,
      "PATCH",
      { promotion: productEntry.promotion },
    );
    const payload = await response.json();

    expect(response.status, payload.error).toBe(200);
    expect(payload.product).toBeTruthy();
    expect(payload.product).toEqual(productEntry);
  });

  test("PATCH:/produtos/:id update only promotion operations", async () => {
    productEntry.promotion!.operations.push({
      start_day: "tuesday",
      end_day: "sunday",
      start_time: "12:00",
      end_time: "20:00",
    });

    const response = await sendRequest(
      `${baseEndPoint}/produtos/${productEntry.id}`,
      "PATCH",
      { promotion: productEntry.promotion },
    );
    const payload = await response.json();

    expect(response.status, payload.error).toBe(200);
    expect(payload.product).toBeTruthy();
    expect(payload.product).toEqual(productEntry);
  });

  test("PATCH:/produtos/:id update only product data", async () => {
    productEntry.name = "foo_product_update";
    productEntry.price = 500;
    productEntry.category = "foo_category_update";
    productEntry.picture = "foo_picture_update";

    const response = await sendRequest(
      `${baseEndPoint}/produtos/${productEntry.id}`,
      "PATCH",
      {
        name: productEntry.name,
        price: productEntry.price,
        category: productEntry.category,
        picture: productEntry.picture,
      },
    );
    const payload = await response.json();

    expect(response.status, payload.error).toBe(200);
    expect(payload.product).toBeTruthy();
    expect(payload.product).toEqual(productEntry);
  });

  test("PATCH:/produtos/:id update all product data", async () => {
    productEntry.name = "again_foo_product_update";
    productEntry.price = 300;
    productEntry.category = "again_foo_category_update";
    productEntry.picture = "again_foo_picture_update";
    productEntry.promotion!.description = "again_foo_desc_update";
    productEntry.promotion!.price = 150;
    productEntry.promotion!.operations.push({
      start_day: "saturday",
      end_day: "saturday",
      start_time: "10:00",
      end_time: "12:00",
    });

    const response = await sendRequest(
      `${baseEndPoint}/produtos/${productEntry.id}`,
      "PATCH",
      productEntry,
    );
    const payload = await response.json();

    expect(response.status, payload.error).toBe(200);
    expect(payload.product).toBeTruthy();
    expect(payload.product).toEqual(productEntry);
  });

  test("DELETE:/produtos/:id", async () => {
    const response = await sendRequest(
      `${baseEndPoint}/produtos/${productEntry.id}`,
      "DELETE",
    );
    const payload = await response.json();

    expect(response.status, payload.error).toBe(200);
    expect(payload.product).toBeTruthy();
    expect(payload.product).toEqual(productEntry);
  });
});

afterAll(() => {
  server.close();
});
