import { ApiError } from "../../commom/apiError";
import { ProductValidator } from "../../features/products/adapter/product.validator";
import {
  DeleteProductDTO,
  GetProductsDTO,
  PatchProductDTO,
  PostProductDTO,
} from "../../features/products/product.dto";
import z from "zod";
import { weeklyWindowSchema } from "./zodWeeklyWindow.schema";

export class ZodProductValidator implements ProductValidator {
  private getProductSchema = z.object({
    params: z.object({
      restaurantId: z
        .string()
        .uuid({ message: "Provide a valid restaurant ID" }),
    }),
  });

  private postProductSchema = z.object({
    params: z.object({
      restaurantId: z
        .string()
        .uuid({ message: "Provide a valid restaurant ID" }),
    }),
    body: z.object({
      name: z.string(),
      price: z.number().positive(),
      category: z.string(),
      picture: z.string(),
      promotion: z
        .object({
          description: z.string(),
          price: z.number().positive(),
          operations: z.array(weeklyWindowSchema).min(1),
        })
        .nullable(),
    }),
  });

  private patchProductSchema = z.object({
    params: z.object({
      id: z.string().uuid({ message: "Provide a valid product ID" }),
    }),
    body: z
      .object({
        name: z.string(),
        price: z.number().positive(),
        category: z.string(),
        picture: z.string(),
        promotion: z
          .object({
            description: z.string(),
            price: z.number().positive(),
            operations: z.array(weeklyWindowSchema).min(1),
          })
          .nullable(),
      })
      .partial()
      .refine(
        (arg) =>
          !(
            !arg.name &&
            !arg.price &&
            !arg.category &&
            !arg.picture &&
            !arg.promotion
          ),
      ),
  });

  private deleteProductSchema = z.object({
    params: z.object({
      id: z.string().uuid({ message: "Provide a valid product ID" }),
    }),
  });

  validateGetProducts(req: any): [ApiError, null] | [null, GetProductsDTO] {
    const { success, error, data } = this.getProductSchema.safeParse(req);
    if (!success) {
      return [
        new ApiError(500, error.errors.map((err) => err.message).join(", ")),
        null,
      ];
    }
    return [null, { restaurantId: data.params.restaurantId }];
  }

  validatePostProduct(req: any): [ApiError, null] | [null, PostProductDTO] {
    const { success, error, data } = this.postProductSchema.safeParse(req);
    if (!success) {
      return [
        new ApiError(500, error.errors.map((err) => err.message).join(", ")),
        null,
      ];
    }
    return [null, { restaurantId: data.params.restaurantId, ...data.body }];
  }

  validatePatchProduct(req: any): [ApiError, null] | [null, PatchProductDTO] {
    const { success, error, data } = this.patchProductSchema.safeParse(req);
    if (!success) {
      return [
        new ApiError(500, error.errors.map((err) => err.message).join(", ")),
        null,
      ];
    }
    return [null, { id: data.params.id, ...data.body }];
  }

  validateDeleteProduct(req: any): [ApiError, null] | [null, DeleteProductDTO] {
    const { success, error, data } = this.deleteProductSchema.safeParse(req);
    if (!success) {
      return [
        new ApiError(500, error.errors.map((err) => err.message).join(", ")),
        null,
      ];
    }
    return [null, { id: data.params.id }];
  }
}
