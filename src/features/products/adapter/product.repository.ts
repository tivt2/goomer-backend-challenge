import { ApiError } from "../../../commom/apiError";
import {
  GetProductsDTO,
  PostProductDTO,
  PatchProductDTO,
  DeleteProductDTO,
} from "../product.dto";
import { PublicProduct } from "../product.type";

export interface ProductRepository {
  selectAll(dto: GetProductsDTO): Promise<[ApiError | null, PublicProduct[]]>;
  insertOne(dto: PostProductDTO): Promise<[ApiError | null, PublicProduct]>;
  updateOne(dto: PatchProductDTO): Promise<[ApiError | null, PublicProduct]>;
  deleteOne(dto: DeleteProductDTO): Promise<[ApiError | null, PublicProduct]>;
}
