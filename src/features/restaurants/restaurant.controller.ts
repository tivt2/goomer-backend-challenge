import { ApiResponse } from "../../commom/apiResponse";
import { RestaurantRepository } from "./adapter/restaurant.repository";

export class RestaurantController {
  constructor(private restaurantRepository: RestaurantRepository) {}

  async getAll(_: any): Promise<ApiResponse> {
    const [error, restaurants] = await this.restaurantRepository.selectAll();
    if (error !== null) {
      return error.response;
    }

    return { status: 200, payload: { restaurants } };
  }

  async getOne(req: any): Promise<ApiResponse> {
    const [error, restaurant] = await this.restaurantRepository.selectOne({
      id: req.params.id,
    });
    if (error !== null) {
      return error.response;
    }

    return { status: 200, payload: { restaurant } };
  }

  async postOne(req: any): Promise<ApiResponse> {
    const [error, restaurant] = await this.restaurantRepository.insertOne(
      req.body.restaurant,
    );
    if (error !== null) {
      return error.response;
    }

    return { status: 200, payload: { restaurant } };
  }

  async patchOne(req: any): Promise<ApiResponse> {
    const [error, restaurant] = await this.restaurantRepository.updateOne(
      req.body.updateData,
    );
    if (error !== null) {
      return error.response;
    }

    return { status: 200, payload: { restaurant } };
  }

  async deleteOne(req: any): Promise<ApiResponse> {
    const [error, restaurant] = await this.restaurantRepository.deleteOne({
      id: req.params.id,
    });
    if (error !== null) {
      return error.response;
    }

    return { status: 200, payload: { restaurant } };
  }
}
