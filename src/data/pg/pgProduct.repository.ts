import { ApiError } from "../../commom/apiError";
import { WeeklyWindow } from "../../commom/weeklyWindow.type";
import { ProductRepository } from "../../features/products/adapter/product.repository";
import {
  DeleteProductDTO,
  GetProductsDTO,
  PatchProductDTO,
  PostProductDTO,
} from "../../features/products/product.dto";
import {
  ProductPromotion,
  PublicProduct,
} from "../../features/products/product.type";

import { getPoolClient } from "./pool";

const selectProductsQuery = `
SELECT p.id, p.name, p.price, p.category, p.picture,
CASE
  WHEN pp.id IS NULL THEN NULL
  ELSE json_build_object(
    'description', pp.description,
    'price', pp.price,
    'operations', COALESCE(json_agg(json_build_object(
      'start_day', ppo.start_day,
      'end_day', ppo.end_day,
      'start_time', ppo.start_time,
      'end_time', ppo.end_time
    )) FILTER (WHERE ppo.id IS NOT NULL), '[]')
  )
END AS promotion
FROM products p
LEFT JOIN product_promotion pp
ON p.id=pp.product_id
LEFT JOIN product_promotion_operations ppo
ON p.id=ppo.product_id
WHERE p.restaurant_id=$1
GROUP BY p.id, p.name, p.price, p.category, p.picture, pp.id, pp.description, pp.price;`;

const insertProductQuery = `
INSERT INTO products (restaurant_id, name, price, category, picture)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, name, price, category, picture;`;

const insertPromotionQuery = `
INSERT INTO product_promotion (product_id, description, price)
VALUES ($1, $2, $3)
RETURNING id, description, price;`;

const insertPromotionOperationsQuery = `
INSERT INTO product_promotion_operations (product_id, start_day, end_day, start_time, end_time)
VALUES ($1, $2, $3, $4, $5)
RETURNING start_day, end_day, start_time, end_time;`;

const updateOnlyProductQuery = `
WITH updated_product AS (
  UPDATE products
  SET name=COALESCE($2, name),
      price=COALESCE($3, price),
      category=COALESCE($4, category),
      picture=COALESCE($5, picture)
  WHERE id=$1
  RETURNING *
)
SELECT p.id, p.name, p.price, p.category, p.picture,
CASE
  WHEN pp.id IS NULL THEN NULL
  ELSE json_build_object(
    'description', pp.description,
    'price', pp.price,
    'operations', COALESCE(json_agg(json_build_object(
      'start_day', ppo.start_day,
      'end_day', ppo.end_day,
      'start_time', ppo.start_time,
      'end_time', ppo.end_time
    )) FILTER (WHERE ppo.id IS NOT NULL), '[]')
  )
END AS promotion
FROM updated_product p
LEFT JOIN product_promotion pp
ON p.id=pp.product_id
LEFT JOIN product_promotion_operations ppo
ON p.id=ppo.product_id
GROUP BY p.id, p.name, p.price, p.category, p.picture, pp.id, pp.description, pp.price;`;

const updateProductAndPromotionQuery = `
WITH updated_product AS (
  UPDATE products
  SET name=COALESCE($2, name),
    price=COALESCE($3, price),
    category=COALESCE($4, category),
    picture=COALESCE($5, picture)
  WHERE id=$1
  RETURNING *
), updated_promotion AS (
  INSERT INTO product_promotion (product_id, description, price)
  VALUES ($1, $6, $7)
  ON CONFLICT (product_id)
  DO UPDATE
  SET description=$6,
    price=$7
  RETURNING *
)
SELECT p.id, p.name, p.price, p.category, p.picture,
CASE
  WHEN pp.id IS NULL THEN NULL
  ELSE json_build_object(
    'description', pp.description,
    'price', pp.price,
    'operations', COALESCE(json_agg(json_build_object(
      'start_day', ppo.start_day,
      'end_day', ppo.end_day,
      'start_time', ppo.start_time,
      'end_time', ppo.end_time
    )) FILTER (WHERE ppo.id IS NOT NULL), '[]')
  )
END AS promotion
FROM updated_product p
LEFT JOIN updated_promotion pp
ON p.id=pp.product_id
LEFT JOIN product_promotion_operations ppo
ON p.id=ppo.product_id
GROUP BY p.id, p.name, p.price, p.category, p.picture, pp.id, pp.description, pp.price;`;

const deletePromotionQuery = `
DELETE FROM product_promotion
WHERE product_id=$1;`;

const selectOnlyProductQuery = `
SELECT id, name, price, category, picture
FROM products
WHERE id=$1;`;

const deletePromotionOperationsQuery = `
DELETE FROM product_promotion_operations
WHERE product_id=$1;`;

const deleteProductQuery = `
WITH deleted_product AS (
  DELETE FROM products
  WHERE id=$1
  RETURNING *
), deleted_promotion AS (
  DELETE FROM product_promotion
  WHERE product_id=$1
  RETURNING *
), deleted_operations AS (
  DELETE FROM product_promotion_operations
  WHERE product_id=$1
  RETURNING *
)
SELECT p.id, p.name, p.price, p.category, p.picture,
CASE
  WHEN pp.id IS NULL THEN NULL
  ELSE json_build_object(
    'description', pp.description,
    'price', pp.price,
    'operations', COALESCE(json_agg(json_build_object(
      'start_day', ppo.start_day,
      'end_day', ppo.end_day,
      'start_time', ppo.start_time,
      'end_time', ppo.end_time
    )) FILTER (WHERE ppo.id IS NOT NULL), '[]')
  )
END AS promotion
FROM deleted_product p
LEFT JOIN deleted_promotion pp
ON p.id=pp.product_id
LEFT JOIN deleted_operations ppo
ON p.id=ppo.product_id
GROUP BY p.id, p.name, p.price, p.category, p.picture, pp.id, pp.description, pp.price;`;

export class PGProductRepository implements ProductRepository {
  async selectAll({
    restaurantId,
  }: GetProductsDTO): Promise<[ApiError, null] | [null, PublicProduct[]]> {
    const [error, client] = await getPoolClient();
    if (error !== null) {
      return [error, null];
    }

    try {
      const products = await client.query(selectProductsQuery, [restaurantId]);

      return [null, products.rows];
    } catch (error) {
      return [new ApiError(500, (error as Error).stack), null];
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
  }: PostProductDTO): Promise<[ApiError, null] | [null, PublicProduct]> {
    const [error, client] = await getPoolClient();
    if (error !== null) {
      return [error, null];
    }

    if (!promotion) {
      try {
        const productRes = await client.query(insertProductQuery, [
          restaurantId,
          name,
          price,
          category,
          picture,
        ]);

        return [null, { ...productRes.rows[0], promotion: null }];
      } catch (error) {
        return [new ApiError(500, (error as Error).stack), null];
      } finally {
        client.release();
      }
    }

    try {
      await client.query("BEGIN;");

      const productRes = await client.query<Omit<PublicProduct, "promotion">>(
        insertProductQuery,
        [restaurantId, name, price, category, picture],
      );
      const product = productRes.rows[0];

      const promotionRes = await client.query<ProductPromotion>(
        insertPromotionQuery,
        [product.id, promotion.description, promotion.price],
      );
      const productPromotion = promotionRes.rows[0];

      const operationsPromises = promotion.operations.map((op) => {
        return client.query<WeeklyWindow>(insertPromotionOperationsQuery, [
          product.id,
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
          ...product,
          promotion: {
            description: productPromotion.description,
            price: productPromotion.price,
            operations: operationsRes.map((res) => res.rows[0]),
          },
        },
      ];
    } catch (error) {
      await client.query("ROLLBACK;");
      return [new ApiError(500, (error as Error).stack), null];
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
  }: PatchProductDTO): Promise<[ApiError, null] | [null, PublicProduct]> {
    const [error, client] = await getPoolClient();
    if (error !== null) {
      return [error, null];
    }

    if (promotion === undefined) {
      try {
        const productRes = await client.query(updateOnlyProductQuery, [
          id,
          name,
          price,
          category,
          picture,
        ]);

        return [null, productRes.rows[0]];
      } catch (error) {
        return [new ApiError(500, (error as Error).stack), null];
      } finally {
        client.release();
      }
    }

    try {
      await client.query("BEGIN;");

      let product: PublicProduct;
      if (promotion === null) {
        await client.query(deletePromotionQuery, [id]);

        const productRes = await client.query(selectOnlyProductQuery, [id]);

        product = { ...productRes.rows[0], promotion: null };
      } else {
        await client.query(deletePromotionOperationsQuery, [id]);

        const operationsPromises = promotion.operations.map((op) => {
          return client.query<WeeklyWindow>(insertPromotionOperationsQuery, [
            id,
            op.start_day,
            op.end_day,
            op.start_time,
            op.end_time,
          ]);
        });

        await Promise.all(operationsPromises);

        const productRes = await client.query(updateProductAndPromotionQuery, [
          id,
          name,
          price,
          category,
          picture,
          promotion.description,
          promotion.price,
        ]);

        product = productRes.rows[0];
      }

      await client.query("COMMIT;");

      return [null, product];
    } catch (error) {
      await client.query("ROLLBACK;");
      return [new ApiError(500, (error as Error).stack), null];
    } finally {
      client.release();
    }
  }

  async deleteOne({
    id,
  }: DeleteProductDTO): Promise<[ApiError, null] | [null, PublicProduct]> {
    const [error, client] = await getPoolClient();
    if (error !== null) {
      return [error, null];
    }

    try {
      const products = await client.query(deleteProductQuery, [id]);

      return [null, products.rows[0]];
    } catch (error) {
      return [new ApiError(500, (error as Error).stack), null];
    } finally {
      client.release();
    }
  }
}
