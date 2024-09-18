import { describe, expect, test } from "vitest";
import { ZodRestaurantValidator } from "./zodRestaurant.validator";
import { PublicRestaurant } from "../../features/restaurants/restaurant.type";
import {
  DeleteRestaurantDTO,
  GetRestaurantDTO,
  PatchRestaurantDTO,
  PostRestaurantDTO,
} from "../../features/restaurants/restaurant.dto";

describe("zod restaurant validator tests", () => {
  const restaurantValidator = new ZodRestaurantValidator();

  const restaurant: PublicRestaurant = {
    id: "d529c805-4cda-4675-ac9b-b6ad33bbf5ea",
    name: "foo_restaurant",
    address: "foo_restaurant",
    picture: "foo_restaurant",
    operations: [
      {
        start_day: "monday",
        end_day: "monday",
        start_time: "12:00",
        end_time: "20:00",
      },
    ],
  };

  test("validateGetRestaurant()", () => {
    const req = {
      params: {
        id: restaurant.id,
      },
    };

    const dto: GetRestaurantDTO = {
      id: restaurant.id,
    };

    const [error, reqDto] = restaurantValidator.validateGetRestaurant(req);
    expect(error).toBeNull();
    expect(reqDto).toEqual(dto);
  });

  test("validatePostRestaurant()", () => {
    const req = {
      body: {
        name: restaurant.name,
        address: restaurant.address,
        picture: restaurant.picture,
        operations: restaurant.operations,
      },
    };

    const dto: PostRestaurantDTO = {
      name: restaurant.name,
      address: restaurant.address,
      picture: restaurant.picture,
      operations: restaurant.operations,
    };

    const [error, reqDto] = restaurantValidator.validatePostRestaurant(req);
    expect(error, error?.message).toBeNull();
    expect(reqDto).toEqual(dto);
  });

  test("validatePatchRestaurant() only name", () => {
    const req = {
      params: {
        id: restaurant.id,
      },
      body: {
        name: restaurant.name,
      },
    };

    const dto: PatchRestaurantDTO = {
      id: restaurant.id,
      name: restaurant.name,
    };

    const [error, reqDto] = restaurantValidator.validatePatchRestaurant(req);
    expect(error).toBeNull();
    expect(reqDto).toEqual(dto);
  });

  test("validatePatchRestaurant() only address", () => {
    const req = {
      params: {
        id: restaurant.id,
      },
      body: {
        address: restaurant.address,
      },
    };

    const dto: PatchRestaurantDTO = {
      id: restaurant.id,
      address: restaurant.address,
    };

    const [error, reqDto] = restaurantValidator.validatePatchRestaurant(req);
    expect(error).toBeNull();
    expect(reqDto).toEqual(dto);
  });

  test("validatePatchRestaurant() only picture", () => {
    const req = {
      params: {
        id: restaurant.id,
      },
      body: {
        picture: restaurant.picture,
      },
    };

    const dto: PatchRestaurantDTO = {
      id: restaurant.id,
      picture: restaurant.picture,
    };

    const [error, reqDto] = restaurantValidator.validatePatchRestaurant(req);
    expect(error).toBeNull();
    expect(reqDto).toEqual(dto);
  });

  test("validatePatchRestaurant() only operations", () => {
    const req = {
      params: {
        id: restaurant.id,
      },
      body: {
        operations: restaurant.operations,
      },
    };

    const dto: PatchRestaurantDTO = {
      id: restaurant.id,
      operations: restaurant.operations,
    };

    const [error, reqDto] = restaurantValidator.validatePatchRestaurant(req);
    expect(error).toBeNull();
    expect(reqDto).toEqual(dto);
  });

  test("validateDeleteRestaurant()", () => {
    const req = {
      params: {
        id: restaurant.id,
      },
    };

    const dto: DeleteRestaurantDTO = {
      id: restaurant.id,
    };

    const [error, reqDto] = restaurantValidator.validateDeleteRestaurant(req);
    expect(error).toBeNull();
    expect(reqDto).toEqual(dto);
  });
});
