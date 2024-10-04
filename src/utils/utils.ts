export function formatDate(date: Date): string {
  const year = date.getFullYear();

  // Months are zero-based in JavaScript, so we add 1 and pad with leading zero if necessary
  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  // Get the day of the month and pad with leading zero if necessary
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}