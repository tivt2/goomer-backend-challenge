import { ApiError } from "../../../commom/apiError";
import {
  DeleteRestaurantDTO,
  GetRestaurantDTO,
  PatchRestaurantDTO,
  PostRestaurantDTO,
} from "../restaurant.dto";
import { PublicRestaurant } from "../restaurant.type";

export interface RestaurantRepository {
  selectAll(): Promise<[ApiError | null, PublicRestaurant[]]>;
  selectOne(
    dto: GetRestaurantDTO,
  ): Promise<[ApiError | null, PublicRestaurant]>;
  insertOne(
    dto: PostRestaurantDTO,
  ): Promise<[ApiError | null, PublicRestaurant]>;
  updateOne(
    dto: PatchRestaurantDTO,
  ): Promise<[ApiError | null, PublicRestaurant]>;
  deleteOne(
    dto: DeleteRestaurantDTO,
  ): Promise<[ApiError | null, PublicRestaurant]>;
}
