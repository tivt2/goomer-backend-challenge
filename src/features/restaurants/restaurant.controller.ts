import { ApiResponse } from "../../commom/apiResponse";
import { RestaurantRepository } from "./adapter/restaurant.repository";
import { RestaurantValidator } from "./adapter/restaurant.validator";

export class RestaurantController {
  constructor(
    private restaurantRepository: RestaurantRepository,
    private restaurantValidator: RestaurantValidator,
  ) {}

  async getAll(_: any): Promise<ApiResponse> {
    const [error, restaurants] = await this.restaurantRepository.selectAll();
    if (error !== null) {
      return error.response;
    }

    return { status: 200, payload: { restaurants } };
  }

  async getOne(req: any): Promise<ApiResponse> {
    const [validError, dto] =
      this.restaurantValidator.validateGetRestaurant(req);
    if (validError !== null) {
      return validError.response;
    }

    const [repoError, restaurant] =
      await this.restaurantRepository.selectOne(dto);
    if (repoError !== null) {
      return repoError.response;
    }

    return { status: 200, payload: { restaurant } };
  }

  async postOne(req: any): Promise<ApiResponse> {
    const [validError, dto] =
      this.restaurantValidator.validatePostRestaurant(req);
    if (validError !== null) {
      return validError.response;
    }

    const [repoError, restaurant] =
      await this.restaurantRepository.insertOne(dto);
    if (repoError !== null) {
      return repoError.response;
    }

    return { status: 200, payload: { restaurant } };
  }

  async patchOne(req: any): Promise<ApiResponse> {
    const [validError, dto] =
      this.restaurantValidator.validatePatchRestaurant(req);
    if (validError !== null) {
      return validError.response;
    }

    const [repoError, restaurant] =
      await this.restaurantRepository.updateOne(dto);
    if (repoError !== null) {
      return repoError.response;
    }

    return { status: 200, payload: { restaurant } };
  }

  async deleteOne(req: any): Promise<ApiResponse> {
    const [validError, dto] =
      this.restaurantValidator.validateDeleteRestaurant(req);
    if (validError !== null) {
      return validError.response;
    }

    const [repoError, restaurant] =
      await this.restaurantRepository.deleteOne(dto);
    if (repoError !== null) {
      return repoError.response;
    }

    return { status: 200, payload: { restaurant } };
  }
}
