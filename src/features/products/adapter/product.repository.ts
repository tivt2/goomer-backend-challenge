import { ApiError } from "../../../commom/apiError";
import {
  GetProductsDTO,
  PostProductDTO,
  PatchProductDTO,
  DeleteProductDTO,
} from "../product.dto";
import { PublicProduct } from "../product.type";

export interface ProductRepository {
  selectAll(
    dto: GetProductsDTO,
  ): Promise<[ApiError, null] | [null, PublicProduct[]]>;
  insertOne(
    dto: PostProductDTO,
  ): Promise<[ApiError, null] | [null, PublicProduct]>;
  updateOne(
    dto: PatchProductDTO,
  ): Promise<[ApiError, null] | [null, PublicProduct]>;
  deleteOne(
    dto: DeleteProductDTO,
  ): Promise<[ApiError, null] | [null, PublicProduct]>;
}
