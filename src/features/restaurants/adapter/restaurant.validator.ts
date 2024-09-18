import { ApiError } from "../../../commom/apiError";
import {
  DeleteRestaurantDTO,
  GetRestaurantDTO,
  PatchRestaurantDTO,
  PostRestaurantDTO,
} from "../restaurant.dto";

export interface RestaurantValidator {
  validateGetRestaurant(req: any): [ApiError, null] | [null, GetRestaurantDTO];
  validatePostRestaurant(
    req: any,
  ): [ApiError, null] | [null, PostRestaurantDTO];
  validatePatchRestaurant(
    req: any,
  ): [ApiError, null] | [null, PatchRestaurantDTO];
  validateDeleteRestaurant(
    req: any,
  ): [ApiError, null] | [null, DeleteRestaurantDTO];
}
