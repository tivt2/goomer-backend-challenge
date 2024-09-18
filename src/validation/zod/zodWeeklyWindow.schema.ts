import z from "zod";
import { WeeklyWindowValidator } from "../weeklyWindow.validator";

const weekDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const weeklyWindowSchema = z
  .object({
    start_day: z.enum(weekDays, {
      message: "start_day must be a valid weekday",
    }),
    end_day: z.enum(weekDays, { message: "end_day must be a valid weekday" }),
    start_time: z
      .string()
      .length(5, { message: "start_time must have format 'HH:mm'" }),
    end_time: z
      .string()
      .length(5, { message: "start_time must have format 'HH:mm'" }),
  })
  .superRefine((weekDay, ctx) => {
    const errorMsg = WeeklyWindowValidator.validateWeeklyWindow(weekDay);
    if (errorMsg !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errorMsg,
      });
    }
  });
