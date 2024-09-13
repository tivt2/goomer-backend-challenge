import { ApiError } from "../../commom/apiError";
import { RestaurantRepository } from "../../features/restaurants/adapter/restaurant.repository";
import {
  DeleteRestaurantDTO,
  GetRestaurantDTO,
  PatchRestaurantDTO,
  PostRestaurantDTO,
} from "../../features/restaurants/restaurant.dto";
import { PublicRestaurant } from "../../features/restaurants/restaurant.type";

import { getPoolClient } from "./pool";

const selectAllQuery = `
SELECT id, name, address, picture, operations
FROM restaurants`;

const selectOneQuery = `
SELECT id, name, address, picture, operations
FROM restaurants
WHERE id=$1;`;

const insertOneQuery = `
INSERT INTO restaurants (name, address, picture, operations)
VALUES ($1, $2, $3, $4)
RETURNING id, name, address, picture, operations;`;

const updateOneQuery = `
UPDATE restaurants
SET name=COALESCE($2, name),
    address=COALESCE($3, address),
    picture=COALESCE($4, picture),
    operations=COALESCE($5, operations)
WHERE id=$1
RETURNING id, name, address, picture, operations;`;

const deleteOneQuery = `
DELETE FROM restaurants
WHERE id=$1
RETURNING id, name, address, picture, operations;`;

export class PGRestaurantRepository implements RestaurantRepository {
  async selectAll(): Promise<[ApiError | null, PublicRestaurant[]]> {
    const [error, client] = await getPoolClient();
    if (error == null) {
      return [error, []];
    }

    try {
      const restaurants = await client.query(selectAllQuery);

      return [null, restaurants.rows];
    } catch (error) {
      return [new ApiError(500, "Something wrong during transaction"), []];
    } finally {
      client.release();
    }
  }

  async selectOne({
    id,
  }: GetRestaurantDTO): Promise<[ApiError | null, PublicRestaurant]> {
    const [error, client] = await getPoolClient();
    if (error == null) {
      return [error, {} as PublicRestaurant];
    }

    try {
      const restaurants = await client.query(selectOneQuery, [id]);

      return [null, restaurants.rows[0]];
    } catch (error) {
      return [
        new ApiError(500, "Something wrong during transaction"),
        {} as PublicRestaurant,
      ];
    } finally {
      client.release();
    }
  }

  async insertOne({
    name,
    address,
    picture,
    operations,
  }: PostRestaurantDTO): Promise<[ApiError | null, PublicRestaurant]> {
    const [error, client] = await getPoolClient();
    if (error == null) {
      return [error, {} as PublicRestaurant];
    }

    const mappedOperations = operations.map((op) => {
      return `(${op.startDay},${op.endDay},${op.startTime},${op.endTime})`;
    });

    try {
      const restaurants = await client.query(insertOneQuery, [
        name,
        address,
        picture,
        mappedOperations,
      ]);

      return [null, restaurants.rows[0]];
    } catch (error) {
      return [
        new ApiError(500, "Something wrong during transaction"),
        {} as PublicRestaurant,
      ];
    } finally {
      client.release();
    }
  }

  async updateOne({
    id,
    name,
    address,
    picture,
    operations,
  }: PatchRestaurantDTO): Promise<[ApiError | null, PublicRestaurant]> {
    const [error, client] = await getPoolClient();
    if (error == null) {
      return [error, {} as PublicRestaurant];
    }

    try {
      const restaurants = await client.query(updateOneQuery, [
        id,
        name,
        address,
        picture,
        operations?.map((op) => {
          return `(${op.startDay},${op.endDay},${op.startTime},${op.endTime})`;
        }),
      ]);

      return [null, restaurants.rows[0]];
    } catch (error) {
      return [
        new ApiError(500, "Something wrong during transaction"),
        {} as PublicRestaurant,
      ];
    } finally {
      client.release();
    }
  }

  async deleteOne({
    id,
  }: DeleteRestaurantDTO): Promise<[ApiError | null, PublicRestaurant]> {
    const [error, client] = await getPoolClient();
    if (error == null) {
      return [error, {} as PublicRestaurant];
    }

    try {
      const restaurants = await client.query(deleteOneQuery, [id]);

      return [null, restaurants.rows[0]];
    } catch (error) {
      return [
        new ApiError(500, "Something wrong during transaction"),
        {} as PublicRestaurant,
      ];
    } finally {
      client.release();
    }
  }
}
