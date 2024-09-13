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
    operation: WeeklyWindow[];
  } | null;
};

export type Product = {
  createdAt: Date;
  updatedAt: Date;
} & PublicProduct;
