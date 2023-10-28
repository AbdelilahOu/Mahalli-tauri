export const getWeekDay = (i: number, locale = "en-us") =>
  new Date(2023, 4, i).toLocaleDateString(locale, {
    weekday: "short",
  });
