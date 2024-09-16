import { ApiError } from "../../commom/apiError";
import { WeeklyWindow } from "../../commom/weeklyWindow.type";
import { RestaurantRepository } from "../../features/restaurants/adapter/restaurant.repository";
import {
  DeleteRestaurantDTO,
  GetRestaurantDTO,
  PatchRestaurantDTO,
  PostRestaurantDTO,
} from "../../features/restaurants/restaurant.dto";
import { PublicRestaurant } from "../../features/restaurants/restaurant.type";

import { getPoolClient } from "./pool";

const selectRestaurantsQuery = `
SELECT r.id, r.name, r.address, r.picture,
json_agg(json_build_object(
  'start_day', ro.start_day,
  'end_day', ro.end_day,
  'start_time', ro.start_time,
  'end_time', ro.end_time
)) AS operations
FROM restaurants r
LEFT JOIN restaurant_operations ro
ON r.id=ro.restaurant_id
GROUP BY r.id, r.name, r.address, r.picture;`;

const selectRestaurantQuery = `
SELECT r.id, r.name, r.address, r.picture,
json_agg(json_build_object(
  'start_day', ro.start_day,
  'end_day', ro.end_day,
  'start_time', ro.start_time,
  'end_time', ro.end_time
)) AS operations
FROM restaurants r
LEFT JOIN restaurant_operations ro
ON r.id=ro.restaurant_id
WHERE r.id=$1
GROUP BY r.id, r.name, r.address, r.picture;`;

const insertRestaurantQuery = `
INSERT INTO restaurants (name, address, picture)
VALUES ($1, $2, $3)
RETURNING id, name, address, picture;`;

const insertOperationQuery = `
INSERT INTO restaurant_operations (restaurant_id, start_day, end_day, start_time, end_time)
VALUES ($1, $2, $3, $4, $5)
RETURNING start_day, end_day, start_time, end_time;`;

const updateOnlyRestaurantQuery = `
WITH updated_restaurant AS (
  UPDATE restaurants
  SET name=COALESCE($2, name),
    address=COALESCE($3, address),
    picture=COALESCE($4, picture)
  WHERE id=$1
  RETURNING id, name, address, picture
)
SELECT r.id, r.name, r.address, r.picture,
json_agg(json_build_object(
  'start_day', ro.start_day,
  'end_day', ro.end_day,
  'start_time', ro.start_time,
  'end_time', ro.end_time
)) AS operations
FROM updated_restaurant r
LEFT JOIN restaurant_operations ro
ON r.id=ro.restaurant_id
GROUP BY r.id, r.name, r.address, r.picture;`;

const deleteOperationsQuery = `
DELETE FROM restaurant_operations
WHERE restaurant_id=$1;`;

const deleteRestaurantQuery = `
WITH deleted_restaurant AS (
  DELETE FROM restaurants
  WHERE id=$1
  RETURNING id, name, address, picture
), deleted_operations AS (
  DELETE FROM restaurant_operations
  WHERE restaurant_id=$1
  RETURNING restaurant_id, start_day, end_day, start_time, end_time
)
SELECT r.id, r.name, r.address, r.picture,
json_agg(json_build_object(
  'start_day', ro.start_day,
  'end_day', ro.end_day,
  'start_time', ro.start_time,
  'end_time', ro.end_time
)) AS operations
FROM deleted_restaurant r
LEFT JOIN deleted_operations ro
ON r.id=ro.restaurant_id
GROUP BY r.id, r.name, r.address, r.picture;`;

export class PGRestaurantRepository implements RestaurantRepository {
  async selectAll(): Promise<[ApiError, null] | [null, PublicRestaurant[]]> {
    const [error, client] = await getPoolClient();
    if (error !== null) {
      return [error, null];
    }

    try {
      const restaurants = await client.query(selectRestaurantsQuery);

      return [null, restaurants.rows];
    } catch (error) {
      return [new ApiError(500, "Something wrong during transaction"), null];
    } finally {
      client.release();
    }
  }

  async selectOne({
    id,
  }: GetRestaurantDTO): Promise<[ApiError, null] | [null, PublicRestaurant]> {
    const [error, client] = await getPoolClient();
    if (error !== null) {
      return [error, null];
    }

    try {
      const restaurant = await client.query(selectRestaurantQuery, [id]);

      return [null, restaurant.rows[0]];
    } catch (error) {
      return [new ApiError(500, "Something wrong during transaction"), null];
    } finally {
      client.release();
    }
  }

  async insertOne({
    name,
    address,
    picture,
    operations,
  }: PostRestaurantDTO): Promise<[ApiError, null] | [null, PublicRestaurant]> {
    const [error, client] = await getPoolClient();
    if (error !== null) {
      return [error, null];
    }

    try {
      await client.query("BEGIN;");

      const restaurantRes = await client.query<
        Omit<PublicRestaurant, "operations">
      >(insertRestaurantQuery, [name, address, picture]);
      const restaurant = restaurantRes.rows[0];

      const operationsPromises = operations.map((op) => {
        return client.query<WeeklyWindow>(insertOperationQuery, [
          restaurant.id,
          op.start_day,
          op.end_day,
          op.start_time,
          op.end_time,
        ]);
      });

      const operationsRes = await Promise.all(operationsPromises);

      await client.query("COMMIT;");

      return [
        null,
        {
          ...restaurant,
          operations: operationsRes.map((res) => res.rows[0]),
        },
      ];
    } catch (error) {
      await client.query("ROLLBACK;");
      return [new ApiError(500, "Something wrong during transaction"), null];
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
  }: PatchRestaurantDTO): Promise<[ApiError, null] | [null, PublicRestaurant]> {
    const [error, client] = await getPoolClient();
    if (error !== null) {
      return [error, null];
    }

    if (!operations) {
      try {
        const restaurant = await client.query<PublicRestaurant>(
          updateOnlyRestaurantQuery,
          [id, name, address, picture],
        );

        return [null, restaurant.rows[0]];
      } catch (error) {
        return [new ApiError(500, "Something wrong during transaction"), null];
      } finally {
        client.release();
      }
    }

    try {
      await client.query("BEGIN;");

      await client.query(deleteOperationsQuery, [id]);

      const operationsPromises = operations.map((op) => {
        return client.query<WeeklyWindow>(insertOperationQuery, [
          id,
          op.start_day,
          op.end_day,
          op.start_time,
          op.end_time,
        ]);
      });

      const operationsRes = await Promise.all(operationsPromises);

      let restaurant: Omit<PublicRestaurant, "operations">;
      if (!name && !address && !picture) {
        const restaurantRes = await client.query(selectRestaurantQuery, [id]);

        restaurant = restaurantRes.rows[0];
      } else {
        const restaurantRes = await client.query(updateOnlyRestaurantQuery, [
          id,
          name,
          address,
          picture,
        ]);

        restaurant = restaurantRes.rows[0];
      }

      await client.query("COMMIT;");

      return [
        null,
        {
          ...restaurant,
          operations: operationsRes.map((res) => res.rows[0]),
        },
      ];
    } catch (error) {
      await client.query("ROLLBACK;");
      return [new ApiError(500, "Something wrong during transaction"), null];
    } finally {
      client.release();
    }
  }

  async deleteOne({
    id,
  }: DeleteRestaurantDTO): Promise<
    [ApiError, null] | [null, PublicRestaurant]
  > {
    const [error, client] = await getPoolClient();
    if (error !== null) {
      return [error, null];
    }

    try {
      const restaurant = await client.query(deleteRestaurantQuery, [id]);

      return [null, restaurant.rows[0]];
    } catch (error) {
      console.log(error);
      return [new ApiError(500, "Something wrong during transaction"), null];
    } finally {
      client.release();
    }
  }
}
