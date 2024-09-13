import { ApiResponse } from "../../commom/apiResponse";

export class ProductController {
  async getAll(req: any): Promise<ApiResponse> {
    return { status: 200, payload: { message: "getAll" } };
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
