import { WeeklyWindow } from "../../commom/weeklyWindow.type";

export type PublicRestaurant = {
  id: string;
  name: string;
  address: string;
  picture: string;
  operations: WeeklyWindow[];
};

export type Restaurant = {
  created_at: Date;
  updated_at: Date;
} & PublicRestaurant;
