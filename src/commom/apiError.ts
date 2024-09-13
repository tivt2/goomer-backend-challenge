import { ApiRespose } from "./apiResponse";

export class ApiError extends Error {
  constructor(
    private status: number,
    message?: string,
  ) {
    super(message);
  }

  get response(): ApiRespose {
    return {
      status: this.status,
      payload: { error: this.message },
    };
  }
}
