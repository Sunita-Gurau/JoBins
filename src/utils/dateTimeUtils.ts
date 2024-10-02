/** convert the start time or the end time of that day its used to make 24hr
 * @param {string} dateString - format: 2023-12-05T18:15:00.000Z
 * @param {string} dateTimeSet - format: "start" | ""
 */
export function convertToISODate(
  dateString: string,
  dateTimeSet: string,
): string {
  const date = new Date(dateString);
  if (dateTimeSet === 'start') {
    date.setHours(0, 0, 0, 0);
  } else {
    date.setHours(23, 59, 59, 999);
  }
  return date.toISOString();
}

export function formatDateRangeToISO(dateRange: string) {
  let startDate, endDate;
  if (dateRange) {
    if (hasHyphenBetweenDates(dateRange)) {
      const [startDateStr, endDateStr] = dateRange.split(' - ');
      startDate = convertToISODate(startDateStr, 'start');
      endDate = convertToISODate(endDateStr, 'end');
    } else if (dateRange === 'Today') {
      const localDateTime = new Date().toISOString();
      startDate = convertToISODate(localDateTime, 'start');
      endDate = convertToISODate(localDateTime, 'end');
    } else {
      try {
        const dateTime = new Date(dateRange).toISOString();
        startDate = convertToISODate(dateTime, 'start');
        endDate = convertToISODate(dateTime, 'end');
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    }
  }

  if (startDate && endDate) {
    return { startDate, endDate };
  } else {
    const localDateTime = new Date().toISOString();
    const startDate = convertToISODate(localDateTime, 'start');
    const endDate = convertToISODate(localDateTime, 'end');
    return { startDate, endDate };
  }
}
const hasHyphenBetweenDates = (dateRangeString: string) => {
  const regex = /^(\w{3} \d{1,2}, \d{4}) - (\w{3} \d{1,2}, \d{4})$/;
  return regex.test(dateRangeString);
};
