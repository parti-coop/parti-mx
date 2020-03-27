export function calculateDays(date: string) {
  const time = (_ => _.setDate(_.getDate() + 30))(new Date(date));
  const timeDiff = new Date().getTime() - time;
  const daysDiff = timeDiff / 1000 / 60 / 60 / 24;
  const daysDiffCeil = Math.ceil(daysDiff);
  return daysDiffCeil;
}