import { differenceInDays, addDays, format } from "date-fns";
import { ko } from "date-fns/locale";
export function calculateDays(date: string) {
  // const time = (_ => _.setDate(_.getDate() + 30))(new Date(date));
  // const timeDiff = new Date().getTime() - time;
  // const daysDiff = timeDiff / 1000 / 60 / 60 / 24;
  // const daysDiffCeil = Math.ceil(daysDiff);
  // return daysDiffCeil;
  return differenceInDays(new Date(), addDays(new Date(date), 30));
}
export function minutesDiff(date: string) {
  const time = new Date(date).getTime();
  const timeDiff = new Date().getTime() - time;
  const minDiff = timeDiff / 60 / 1000;
  return minDiff;
}
export function closingDateFrom(created_at: string) {
  return format(addDays(new Date(), 30), "yyyy.MM.dd");
}
export function formatDateFromString(date: string) {
  return format(new Date(date), "yyyy.MM.dd HH:mm:ss");
}
