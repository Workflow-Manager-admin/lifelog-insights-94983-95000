/**
 * Utility functions for data manipulation in the LifeLog Insights app
 */

import { getISODateString } from './dateUtils';

// Constants
const STORAGE_KEYS = {
  ACTIVITIES: 'lifelog_activities',
  MOODS: 'lifelog_moods'
};

// PUBLIC_INTERFACE
/**
 * Saves an item to local storage
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 */
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
};

// PUBLIC_INTERFACE
/**
 * Retrieves an item from local storage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} The retrieved data or default value
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error retrieving from local storage:', error);
    return defaultValue;
  }
};

// PUBLIC_INTERFACE
/**
 * Saves activity data to local storage
 * @param {Object} activity - Activity data to save
 * @returns {boolean} Success status
 */
export const saveActivity = (activity) => {
  try {
    const activities = getFromStorage(STORAGE_KEYS.ACTIVITIES, {});
    const date = getISODateString(new Date(activity.date));
    
    if (!activities[date]) {
      activities[date] = [];
    }
    
    // Generate ID if none exists
    const newActivity = {
      ...activity,
      id: activity.id || Date.now().toString()
    };
    
    activities[date].push(newActivity);
    saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);
    return true;
  } catch (error) {
    console.error('Error saving activity:', error);
    return false;
  }
};

// PUBLIC_INTERFACE
/**
 * Saves mood data to local storage
 * @param {Object} mood - Mood data to save
 * @returns {boolean} Success status
 */
export const saveMood = (mood) => {
  try {
    const moods = getFromStorage(STORAGE_KEYS.MOODS, {});
    const date = getISODateString(new Date(mood.date));
    
    moods[date] = {
      ...mood,
      id: mood.id || Date.now().toString()
    };
    
    saveToStorage(STORAGE_KEYS.MOODS, moods);
    return true;
  } catch (error) {
    console.error('Error saving mood:', error);
    return false;
  }
};

// PUBLIC_INTERFACE
/**
 * Gets all activities for a specific date
 * @param {Date} date - The date to retrieve activities for
 * @returns {Array} Array of activities for the date
 */
export const getActivitiesForDate = (date) => {
  const activities = getFromStorage(STORAGE_KEYS.ACTIVITIES, {});
  const dateString = getISODateString(new Date(date));
  return activities[dateString] || [];
};

// PUBLIC_INTERFACE
/**
 * Gets mood data for a specific date
 * @param {Date} date - The date to retrieve mood for
 * @returns {Object|null} Mood data or null if not found
 */
export const getMoodForDate = (date) => {
  const moods = getFromStorage(STORAGE_KEYS.MOODS, {});
  const dateString = getISODateString(new Date(date));
  return moods[dateString] || null;
};

// PUBLIC_INTERFACE
/**
 * Gets activities for a date range
 * @param {Date} startDate - Start date of the range
 * @param {Date} endDate - End date of the range
 * @returns {Object} Activities grouped by date
 */
export const getActivitiesInRange = (startDate, endDate) => {
  const activities = getFromStorage(STORAGE_KEYS.ACTIVITIES, {});
  const result = {};
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateString = getISODateString(new Date(d));
    if (activities[dateString]) {
      result[dateString] = activities[dateString];
    }
  }
  
  return result;
};

// PUBLIC_INTERFACE
/**
 * Gets moods for a date range
 * @param {Date} startDate - Start date of the range
 * @param {Date} endDate - End date of the range
 * @returns {Object} Moods grouped by date
 */
export const getMoodsInRange = (startDate, endDate) => {
  const moods = getFromStorage(STORAGE_KEYS.MOODS, {});
  const result = {};
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateString = getISODateString(new Date(d));
    if (moods[dateString]) {
      result[dateString] = moods[dateString];
    }
  }
  
  return result;
};
