import { ApiError } from "../../../commom/apiError";
import {
  DeleteRestaurantDTO,
  GetRestaurantDTO,
  PatchRestaurantDTO,
  PostRestaurantDTO,
} from "../restaurant.dto";
import { PublicRestaurant } from "../restaurant.type";

export interface RestaurantRepository {
  selectAll(): Promise<[ApiError, null] | [null, PublicRestaurant[]]>;
  selectOne(
    dto: GetRestaurantDTO,
  ): Promise<[ApiError, null] | [null, PublicRestaurant]>;
  insertOne(
    dto: PostRestaurantDTO,
  ): Promise<[ApiError, null] | [null, PublicRestaurant]>;
  updateOne(
    dto: PatchRestaurantDTO,
  ): Promise<[ApiError, null] | [null, PublicRestaurant]>;
  deleteOne(
    dto: DeleteRestaurantDTO,
  ): Promise<[ApiError, null] | [null, PublicRestaurant]>;
}
