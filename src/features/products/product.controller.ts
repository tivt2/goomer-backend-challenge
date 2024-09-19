import { ApiResponse } from "../../commom/apiResponse";
import { ProductRepository } from "./adapter/product.repository";
import { ProductValidator } from "./adapter/product.validator";

export class ProductController {
  constructor(
    private productRepository: ProductRepository,
    private productValidator: ProductValidator,
  ) {}

  async getAll(req: any): Promise<ApiResponse> {
    const [validError, dto] = this.productValidator.validateGetProducts(req);
    if (validError !== null) {
      return validError.response;
    }

    const [repoError, products] = await this.productRepository.selectAll(dto);
    if (repoError !== null) {
      return repoError.response;
    }

    return { status: 200, payload: { products } };
  }

  async postOne(req: any): Promise<ApiResponse> {
    const [validError, dto] = this.productValidator.validatePostProduct(req);
    if (validError !== null) {
      return validError.response;
    }

    const [repoError, product] = await this.productRepository.insertOne(dto);
    if (repoError !== null) {
      return repoError.response;
    }

    return { status: 200, payload: { product } };
  }

  async patchOne(req: any): Promise<ApiResponse> {
    const [validError, dto] = this.productValidator.validatePatchProduct(req);
    if (validError !== null) {
      return validError.response;
    }

    const [repoError, product] = await this.productRepository.updateOne(dto);
    if (repoError !== null) {
      return repoError.response;
    }

    return { status: 200, payload: { product } };
  }

  async deleteOne(req: any): Promise<ApiResponse> {
    const [validError, dto] = this.productValidator.validateDeleteProduct(req);
    if (validError !== null) {
      return validError.response;
    }

    const [repoError, product] = await this.productRepository.deleteOne(dto);
    if (repoError !== null) {
      return repoError.response;
    }

    return { status: 200, payload: { product } };
  }
}
