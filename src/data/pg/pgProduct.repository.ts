import { ApiError } from "../../commom/apiError";
import { ProductRepository } from "../../features/products/adapter/product.repository";
import {
  DeleteProductDTO,
  GetProductsDTO,
  PatchProductDTO,
  PostProductDTO,
} from "../../features/products/product.dto";
import { PublicProduct } from "../../features/products/product.type";

import { getPoolClient } from "./pool";

const selectAllQuery = `
SELECT id, name, price, category, picture, promotion
FROM products
WHERE restaurantId=$1`;

const insertOneQuery = `
INSERT INTO products (restaurantId, name, price, category, picture, promotion)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, name, price, category, picture, promotion;`;

const updateOneQuery = `
UPDATE products
SET name=COALESCE($2, name),
    price=COALESCE($3, price),
    category=COALESCE($4, category),
    picture=COALESCE($5, picture),
    promotion=$6
WHERE id=$1
RETURNING id, name, category, picture, promotion;`;

const deleteOneQuery = `
DELETE FROM products
WHERE id=$1
RETURNIN id, name, price, category, picture, promotion;`;

export class PGProductRepository implements ProductRepository {
  async selectAll({
    restaurantId,
  }: GetProductsDTO): Promise<[ApiError | null, PublicProduct[]]> {
    const [error, client] = await getPoolClient();
    if (error == null) {
      return [error, []];
    }

    try {
      const products = await client.query(selectAllQuery, [restaurantId]);

      return [null, products.rows];
    } catch (error) {
      return [new ApiError(500, "Something wrong during transaction"), []];
    } finally {
      client.release();
    }
  }

  async insertOne({
    restaurantId,
    name,
    price,
    category,
    picture,
    promotion,
  }: PostProductDTO): Promise<[ApiError | null, PublicProduct]> {
    const [error, client] = await getPoolClient();
    if (error == null) {
      return [error, {} as PublicProduct];
    }

    try {
      const mappedPromotion = !promotion
        ? null
        : `(${promotion.description},${promotion.price},${promotion.operation.map(
            (op) => {
              return `(${op.startDay},${op.endDay},${op.startTime},${op.endTime})`;
            },
          )})`;

      const products = await client.query(insertOneQuery, [
        restaurantId,
        name,
        price,
        category,
        picture,
        mappedPromotion,
      ]);

      return [null, products.rows[0]];
    } catch (error) {
      return [
        new ApiError(500, "Something wrong during transaction"),
        {} as PublicProduct,
      ];
    } finally {
      client.release();
    }
  }

  async updateOne({
    id,
    name,
    price,
    category,
    picture,
    promotion,
  }: PatchProductDTO): Promise<[ApiError | null, PublicProduct]> {
    const [error, client] = await getPoolClient();
    if (error == null) {
      return [error, {} as PublicProduct];
    }

    try {
      const mappedPromotion = !promotion
        ? null
        : `(${promotion.description},${promotion.price},${promotion.operation.map(
            (op) => {
              return `(${op.startDay},${op.endDay},${op.startTime},${op.endTime})`;
            },
          )})`;

      const products = await client.query(updateOneQuery, [
        id,
        name,
        price,
        category,
        picture,
        mappedPromotion,
      ]);

      return [null, products.rows[0]];
    } catch (error) {
      return [
        new ApiError(500, "Something wrong during transaction"),
        {} as PublicProduct,
      ];
    } finally {
      client.release();
    }
  }

  async deleteOne({
    id,
  }: DeleteProductDTO): Promise<[ApiError | null, PublicProduct]> {
    const [error, client] = await getPoolClient();
    if (error == null) {
      return [error, {} as PublicProduct];
    }

    try {
      const products = await client.query(deleteOneQuery, [id]);

      return [null, products.rows[0]];
    } catch (error) {
      return [
        new ApiError(500, "Something wrong during transaction"),
        {} as PublicProduct,
      ];
    } finally {
      client.release();
    }
  }
}
