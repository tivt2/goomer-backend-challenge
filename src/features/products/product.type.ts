import { WeeklyWindow } from "../../commom/weeklyWindow.type";

export type PublicProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  picture: string;
  promotion: {
    description: string;
    price: number;
    operations: WeeklyWindow[];
  } | null;
};

export type Product = {
  created_at: Date;
  updated_at: Date;
} & PublicProduct;
