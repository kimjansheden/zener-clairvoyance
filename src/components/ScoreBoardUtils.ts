/**
 * Format a date string to Swedish format (YYYY-MM-DD)
 * @param dateString - ISO date string from the database
 * @returns Formatted date string
 */
export const formatDateSwedish = (dateString: string): string => {
  if (!dateString) return "";

  // Create date object from the string
  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return "";

  // Format the date as YYYY-MM-DD (Swedish format)
  return date.toLocaleDateString("sv-SE");
};
