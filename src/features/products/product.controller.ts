import { ApiResponse } from "../../commom/apiResponse";
import { ProductRepository } from "./adapter/product.repository";

export class ProductController {
  constructor(private productRepository: ProductRepository) {}

  async getAll(req: any): Promise<ApiResponse> {
    const [error, products] = await this.productRepository.selectAll({
      restaurantId: req.params.restaurantId,
    });
    if (error !== null) {
      return error.response;
    }

    return { status: 200, payload: { products } };
  }

  async postOne(req: any): Promise<ApiResponse> {
    const [error, product] = await this.productRepository.insertOne({
      restaurantId: req.params.restaurantId,
      ...req.body.product,
    });
    if (error !== null) {
      return error.response;
    }

    return { status: 200, payload: { product } };
  }

  async patchOne(req: any): Promise<ApiResponse> {
    const [error, product] = await this.productRepository.updateOne({
      id: req.params.id,
      ...req.body.updateData,
    });
    if (error !== null) {
      return error.response;
    }

    return { status: 200, payload: { product } };
  }

  async deleteOne(req: any): Promise<ApiResponse> {
    const [error, product] = await this.productRepository.deleteOne({
      id: req.params.id,
    });
    if (error !== null) {
      return error.response;
    }

    return { status: 200, payload: { product } };
  }
}
