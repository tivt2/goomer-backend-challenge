import { describe, expect, test } from "vitest";
import { ZodProductValidator } from "./zodProduct.validator";
import { PublicProduct } from "../../features/products/product.type";
import {
  DeleteProductDTO,
  GetProductsDTO,
  PatchProductDTO,
  PostProductDTO,
} from "../../features/products/product.dto";

describe("zod restaurant validator tests", () => {
  const restaurantValidator = new ZodProductValidator();

  const restaurantId = "28e5df7d-3cbc-469a-838b-53a6debda57d";
  const product: PublicProduct = {
    id: "d529c805-4cda-4675-ac9b-b6ad33bbf5ea",
    name: "foo_product",
    price: 100,
    category: "foo_product",
    picture: "foo_product",
    promotion: {
      description: "foo_product",
      price: 80,
      operations: [
        {
          start_day: "monday",
          end_day: "monday",
          start_time: "12:00",
          end_time: "20:00",
        },
      ],
    },
  };

  test("validateGetProduct()", () => {
    const req = {
      params: {
        restaurantId,
      },
    };

    const dto: GetProductsDTO = {
      restaurantId,
    };

    const [error, reqDto] = restaurantValidator.validateGetProducts(req);
    expect(error).toBeNull();
    expect(reqDto).toEqual(dto);
  });

  test("validatePostProduct()", () => {
    const req = {
      params: {
        restaurantId,
      },
      body: {
        name: product.name,
        price: product.price,
        category: product.category,
        picture: product.picture,
        promotion: product.promotion,
      },
    };

    const dto: PostProductDTO = {
      restaurantId,
      name: product.name,
      price: product.price,
      category: product.category,
      picture: product.picture,
      promotion: product.promotion,
    };

    const [error, reqDto] = restaurantValidator.validatePostProduct(req);
    expect(error, error?.message).toBeNull();
    expect(reqDto).toEqual(dto);
  });

  test("validatePatchProduct() only name", () => {
    const req = {
      params: {
        id: product.id,
      },
      body: {
        name: product.name,
      },
    };

    const dto: PatchProductDTO = {
      id: product.id,
      name: product.name,
    };

    const [error, reqDto] = restaurantValidator.validatePatchProduct(req);
    expect(error).toBeNull();
    expect(reqDto).toEqual(dto);
  });

  test("validatePatchProduct() only price", () => {
    const req = {
      params: {
        id: product.id,
      },
      body: {
        price: product.price,
      },
    };

    const dto: PatchProductDTO = {
      id: product.id,
      price: product.price,
    };

    const [error, reqDto] = restaurantValidator.validatePatchProduct(req);
    expect(error).toBeNull();
    expect(reqDto).toEqual(dto);
  });

  test("validatePatchProduct() only category", () => {
    const req = {
      params: {
        id: product.id,
      },
      body: {
        category: product.category,
      },
    };

    const dto: PatchProductDTO = {
      id: product.id,
      category: product.category,
    };

    const [error, reqDto] = restaurantValidator.validatePatchProduct(req);
    expect(error).toBeNull();
    expect(reqDto).toEqual(dto);
  });

  test("validatePatchProduct() only picture", () => {
    const req = {
      params: {
        id: product.id,
      },
      body: {
        picture: product.picture,
      },
    };

    const dto: PatchProductDTO = {
      id: product.id,
      picture: product.picture,
    };

    const [error, reqDto] = restaurantValidator.validatePatchProduct(req);
    expect(error).toBeNull();
    expect(reqDto).toEqual(dto);
  });

  test("validatePatchProduct() only promotion", () => {
    const req = {
      params: {
        id: product.id,
      },
      body: {
        promotion: product.promotion,
      },
    };

    const dto: PatchProductDTO = {
      id: product.id,
      promotion: product.promotion,
    };

    const [error, reqDto] = restaurantValidator.validatePatchProduct(req);
    expect(error).toBeNull();
    expect(reqDto).toEqual(dto);
  });

  test("validateDeleteProduct()", () => {
    const req = {
      params: {
        id: product.id,
      },
    };

    const dto: DeleteProductDTO = {
      id: product.id,
    };

    const [error, reqDto] = restaurantValidator.validateDeleteProduct(req);
    expect(error).toBeNull();
    expect(reqDto).toEqual(dto);
  });
});
