/**
 * Mood data model for the LifeLog Insights app
 */

// Mood levels with labels, icons, and colors
export const MOOD_LEVELS = {
  VERY_HAPPY: {
    id: 5,
    label: 'Very Happy',
    icon: '😄',
    color: '#34A853'
  },
  HAPPY: {
    id: 4,
    label: 'Happy',
    icon: '🙂',
    color: '#93C47D'
  },
  NEUTRAL: {
    id: 3,
    label: 'Neutral',
    icon: '😐',
    color: '#FBBC05'
  },
  SAD: {
    id: 2,
    label: 'Sad',
    icon: '🙁',
    color: '#F29871'
  },
  VERY_SAD: {
    id: 1,
    label: 'Very Sad',
    icon: '😢',
    color: '#EA4335'
  }
};

// Mood factors that can influence mood
export const MOOD_FACTORS = [
  { id: 'sleep', label: 'Sleep', icon: '😴' },
  { id: 'stress', label: 'Stress', icon: '😰' },
  { id: 'nutrition', label: 'Nutrition', icon: '🍎' },
  { id: 'exercise', label: 'Exercise', icon: '🏃‍♂️' },
  { id: 'social', label: 'Social Interaction', icon: '👥' },
  { id: 'work', label: 'Work Satisfaction', icon: '💼' },
  { id: 'weather', label: 'Weather', icon: '🌦️' }
];

// PUBLIC_INTERFACE
/**
 * Creates a new mood object
 * @param {number} level - Mood level (1-5)
 * @param {string} note - Note about the mood
 * @param {Array} factors - Array of factor IDs affecting the mood
 * @param {Date} date - Date of the mood entry
 * @returns {Object} New mood object
 */
export const createMood = (level, note = '', factors = [], date = new Date()) => {
  return {
    id: Date.now().toString(),
    level,
    note,
    factors,
    date: new Date(date),
    createdAt: new Date()
  };
};

// PUBLIC_INTERFACE
/**
 * Gets the list of all mood levels
 * @returns {Array} Array of mood level objects
 */
export const getMoodLevels = () => {
  return Object.values(MOOD_LEVELS).sort((a, b) => b.id - a.id);
};

// PUBLIC_INTERFACE
/**
 * Gets a specific mood level by ID
 * @param {number} levelId - ID of the level
 * @returns {Object|null} Mood level object or null if not found
 */
export const getMoodLevel = (levelId) => {
  return Object.values(MOOD_LEVELS).find(level => level.id === levelId) || null;
};

// PUBLIC_INTERFACE
/**
 * Gets the list of all mood factors
 * @returns {Array} Array of mood factor objects
 */
export const getMoodFactors = () => {
  return MOOD_FACTORS;
};
