import { PublicProduct } from "./product.type";

export type GetProductsDTO = { restaurantId: string };
export type PostProductDTO = {
  restaurantId: string;
} & Omit<PublicProduct, "id">;
export type PatchProductDTO = {
  id: string;
} & Partial<Omit<PublicProduct, "id">>;
export type DeleteProductDTO = { id: string };
