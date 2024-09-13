import { PublicRestaurant } from "./restaurant.type";

export type GetRestaurantDTO = { id: string };
export type PostRestaurantDTO = Omit<PublicRestaurant, "id">;
export type PatchRestaurantDTO = {
  id: string;
} & Partial<Omit<PublicRestaurant, "id">>;
export type DeleteRestaurantDTO = { id: string };
