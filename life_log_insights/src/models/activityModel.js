/**
 * Activity data model for the LifeLog Insights app
 */

// Activity categories with icons and colors
export const ACTIVITY_CATEGORIES = {
  WORK: {
    id: 'work',
    label: 'Work',
    icon: '💼',
    color: '#4285F4'
  },
  EXERCISE: {
    id: 'exercise',
    label: 'Exercise',
    icon: '🏃‍♂️',
    color: '#34A853'
  },
  LEISURE: {
    id: 'leisure',
    label: 'Leisure',
    icon: '🎮',
    color: '#FBBC05'
  },
  SOCIAL: {
    id: 'social',
    label: 'Social',
    icon: '👥',
    color: '#EA4335'
  },
  SELF_CARE: {
    id: 'self_care',
    label: 'Self Care',
    icon: '🧘‍♂️',
    color: '#8E44AD'
  },
  SLEEP: {
    id: 'sleep',
    label: 'Sleep',
    icon: '😴',
    color: '#3498DB'
  },
  LEARNING: {
    id: 'learning',
    label: 'Learning',
    icon: '📚',
    color: '#F39C12'
  },
  CHORES: {
    id: 'chores',
    label: 'Chores',
    icon: '🧹',
    color: '#7F8C8D'
  },
  OTHER: {
    id: 'other',
    label: 'Other',
    icon: '❓',
    color: '#95A5A6'
  }
};

// PUBLIC_INTERFACE
/**
 * Creates a new activity object
 * @param {string} category - Activity category ID
 * @param {string} description - Activity description
 * @param {number} duration - Duration in minutes
 * @param {Date} date - Date of the activity
 * @returns {Object} New activity object
 */
export const createActivity = (category, description, duration, date = new Date()) => {
  return {
    id: Date.now().toString(),
    category,
    description,
    duration,
    date: new Date(date),
    createdAt: new Date()
  };
};

// PUBLIC_INTERFACE
/**
 * Gets the list of all activity categories
 * @returns {Array} Array of category objects
 */
export const getActivityCategories = () => {
  return Object.values(ACTIVITY_CATEGORIES);
};

// PUBLIC_INTERFACE
/**
 * Gets a specific activity category by ID
 * @param {string} categoryId - ID of the category
 * @returns {Object|null} Category object or null if not found
 */
export const getActivityCategory = (categoryId) => {
  return ACTIVITY_CATEGORIES[categoryId.toUpperCase()] || null;
};
