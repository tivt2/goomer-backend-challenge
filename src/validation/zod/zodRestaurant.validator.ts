import { ApiError } from "../../commom/apiError";
import { RestaurantValidator } from "../../features/restaurants/adapter/restaurant.validator";
import {
  DeleteRestaurantDTO,
  GetRestaurantDTO,
  PatchRestaurantDTO,
  PostRestaurantDTO,
} from "../../features/restaurants/restaurant.dto";
import z from "zod";
import { weeklyWindowSchema } from "./zodWeeklyWindow.schema";

export class ZodRestaurantValidator implements RestaurantValidator {
  private getRestaurantSchema = z.object({
    params: z.object({
      id: z.string().uuid({ message: "Provide a valid restaurant ID" }),
    }),
  });

  private postRestaurantSchema = z.object({
    body: z.object({
      name: z.string(),
      address: z.string(),
      picture: z.string(),
      operations: z.array(weeklyWindowSchema).min(1),
    }),
  });

  private patchRestaurantSchema = z.object({
    params: z.object({
      id: z.string().uuid({ message: "Provide a valid restaurant ID" }),
    }),
    body: z
      .object({
        name: z.string(),
        address: z.string(),
        picture: z.string(),
        operations: z.array(weeklyWindowSchema).min(1),
      })
      .partial()
      .refine(
        (arg) =>
          !(!arg.name && !arg.address && !arg.picture && !arg.operations),
      ),
  });

  private deleteRestaurantSchema = z.object({
    params: z.object({
      id: z.string().uuid({ message: "Provide a valid restaurant ID" }),
    }),
  });

  validateGetRestaurant(req: any): [ApiError, null] | [null, GetRestaurantDTO] {
    const { success, error, data } = this.getRestaurantSchema.safeParse(req);
    if (!success) {
      return [
        new ApiError(500, error.errors.map((err) => err.message).join(", ")),
        null,
      ];
    }
    return [null, { id: data.params.id }];
  }

  validatePostRestaurant(
    req: any,
  ): [ApiError, null] | [null, PostRestaurantDTO] {
    const { success, error, data } = this.postRestaurantSchema.safeParse(req);
    if (!success) {
      return [
        new ApiError(500, error.errors.map((err) => err.message).join(", ")),
        null,
      ];
    }
    return [null, { ...data.body }];
  }

  validatePatchRestaurant(
    req: any,
  ): [ApiError, null] | [null, PatchRestaurantDTO] {
    const { success, error, data } = this.patchRestaurantSchema.safeParse(req);
    if (!success) {
      return [
        new ApiError(500, error.errors.map((err) => err.message).join(", ")),
        null,
      ];
    }
    return [null, { id: data.params.id, ...data.body }];
  }

  validateDeleteRestaurant(
    req: any,
  ): [ApiError, null] | [null, DeleteRestaurantDTO] {
    const { success, error, data } = this.deleteRestaurantSchema.safeParse(req);
    if (!success) {
      return [
        new ApiError(500, error.errors.map((err) => err.message).join(", ")),
        null,
      ];
    }
    return [null, { id: data.params.id }];
  }
}
