import { WeeklyWindow } from "../../commom/weeklyWindow.type";

export type PublicProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  picture: string;
  promotion: Omit<ProductPromotion, "id"> | null;
};

export type ProductPromotion = {
  id: string;
  description: string;
  price: number;
  operations: WeeklyWindow[];
};

export type Product = {
  created_at: Date;
  updated_at: Date;
} & PublicProduct;
