import { TimeWindow } from "../../commom/timeWindow.type";

export type PublicProduct = {
  name: string;
  price: number;
  category: string;
  picture: string;
  promotion: {
    description: string;
    price: number;
    operation: TimeWindow;
  };
};

export type Product = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
} & PublicProduct;
