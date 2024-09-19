import { WeeklyWindow } from "../commom/weeklyWindow.type";

export function validateWeeklyWindow(
  weeklyWindow: WeeklyWindow,
): string | null {
  const [startTimeError, startTime] = validateWeeklyWindowTime(
    weeklyWindow.start_time,
  );
  if (startTimeError !== null) {
    return startTimeError;
  }
  const [endTimeError, endTime] = validateWeeklyWindowTime(
    weeklyWindow.end_time,
  );
  if (endTimeError !== null) {
    return endTimeError;
  }

  if (weeklyWindow.start_day !== weeklyWindow.end_day) {
    return null;
  }

  const [startHour, startMinute] = startTime;
  const [endHour, endMinute] = endTime;
  const timeWindow = (endHour - startHour) * 60 + (endMinute - startMinute);
  if (timeWindow < 15) {
    return "Invalid time window, minimum of 15 minutes on a time window";
  }

  return null;
}

function validateWeeklyWindowTime(
  time: string,
): [string, null] | [null, [number, number]] {
  const formatErrorStr =
    "Time must have format 'HH:mm', 0 >= HH < 24 and 0 >= mm < 60";
  if (time.length !== 5) {
    return [formatErrorStr, null];
  }

  const [hourStr, minuteStr, ...rest] = time.split(":");
  if (!hourStr || !minuteStr || rest.length > 0) {
    return [formatErrorStr, null];
  }

  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  if ((hour < 0 && hour >= 24) || (minute < 0 && minute >= 60)) {
    return [formatErrorStr, null];
  }

  return [null, [hour, minute]];
}
