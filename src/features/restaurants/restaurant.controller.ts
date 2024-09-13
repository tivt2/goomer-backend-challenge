import { ApiResponse } from "../../commom/apiResponse";

export class RestaurantController {
  async getAll(req: any): Promise<ApiResponse> {
    return { status: 200, payload: { message: "getAll" } };
  }

  async getOne(req: any): Promise<ApiResponse> {
    return { status: 200, payload: { message: "getOne" } };
  }

  async postOne(req: any): Promise<ApiResponse> {
    return { status: 200, payload: { message: "postOne" } };
  }

  async patchOne(req: any): Promise<ApiResponse> {
    return { status: 200, payload: { message: "patchOne" } };
  }

  async deleteOne(req: any): Promise<ApiResponse> {
    return { status: 200, payload: { message: "deleteOne" } };
  }
}
