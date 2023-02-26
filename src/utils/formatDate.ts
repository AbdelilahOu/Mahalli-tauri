export const formatDate = (theDate: string): string => {
  return new Date(theDate).toLocaleDateString("fr-fr", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
