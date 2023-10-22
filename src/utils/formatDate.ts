export const formatDate = (theDate: string): string =>
  new Date(theDate).toLocaleDateString("en-us", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const getWeekDay = (i: number, locale = "en-us") =>
  new Date(2023, 4, i).toLocaleDateString(locale, {
    weekday: "short",
  });
