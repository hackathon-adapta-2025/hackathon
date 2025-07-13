export function parseDate(dateString: string): Date | string {
  try {
    const [day, month, year] = dateString.split("-");

    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    if (isNaN(date.getTime())) {
      return "";
    }

    return date;
  } catch (error) {
    console.error("Erro ao converter data:", error);
    return "";
  }
}
