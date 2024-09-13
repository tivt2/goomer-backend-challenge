import { TimeWindow } from "../../commom/timeWindow.type";

export type PublicRestaurant = {
  name: string;
  address: string;
  picture: string;
  operation: TimeWindow;
};

export type Restaurant = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
} & PublicRestaurant;
