import { ApiError } from "../../../commom/apiError";
import {
  DeleteProductDTO,
  GetProductsDTO,
  PatchProductDTO,
  PostProductDTO,
} from "../product.dto";

export interface ProductValidator {
  validateGetProducts(req: any): [ApiError, null] | [null, GetProductsDTO];
  validatePostProduct(req: any): [ApiError, null] | [null, PostProductDTO];
  validatePatchProduct(req: any): [ApiError, null] | [null, PatchProductDTO];
  validateDeleteProduct(req: any): [ApiError, null] | [null, DeleteProductDTO];
}
