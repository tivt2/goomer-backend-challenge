import { ProductPromotion, PublicProduct } from "./product.type";

export type GetProductsDTO = { restaurantId: string };
export type PostProductDTO = {
  restaurantId: string;
} & Omit<PublicProduct, "id">;
export type PatchProductDTO = {
  id: string;
} & Partial<Omit<Omit<PublicProduct, "id">, "promotion">> & {
    promotion?: Partial<Omit<ProductPromotion, "id">>;
  };
export type DeleteProductDTO = { id: string };
