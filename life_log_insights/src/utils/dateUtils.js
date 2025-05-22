/**
 * Utility functions for handling dates in the LifeLog Insights app
 */

// PUBLIC_INTERFACE
/**
 * Formats a date to display format (e.g., "Monday, January 1, 2023")
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// PUBLIC_INTERFACE
/**
 * Formats a date to short format (e.g., "Jan 1")
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 */
export const formatShortDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

// PUBLIC_INTERFACE
/**
 * Gets the current date at midnight (start of day)
 * @returns {Date} Today's date at 00:00:00
 */
export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// PUBLIC_INTERFACE
/**
 * Gets an array of dates for the past n days
 * @param {number} days - Number of past days to include
 * @returns {Array<Date>} Array of Date objects
 */
export const getPastDays = (days) => {
  const result = [];
  const today = getToday();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    result.unshift(date);
  }
  
  return result;
};

// PUBLIC_INTERFACE
/**
 * Gets an ISO string date (YYYY-MM-DD) from a Date object
 * @param {Date} date - The date to convert
 * @returns {string} Date in YYYY-MM-DD format
 */
export const getISODateString = (date) => {
  return date.toISOString().split('T')[0];
};
