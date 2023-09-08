export const formatDate = (theDate: string): string =>
  new Date(theDate).toLocaleDateString("en-us", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const getWeekDay = (i: number) =>
  new Date(2023, 4, i).toLocaleDateString("en-us", {
    weekday: "short",
  });
