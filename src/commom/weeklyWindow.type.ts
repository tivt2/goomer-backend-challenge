export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type WeeklyWindow = {
  start_day: WeekDay;
  end_day: WeekDay;
  start_time: string;
  end_time: string;
};
