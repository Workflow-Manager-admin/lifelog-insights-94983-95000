import React, { useState, useEffect } from 'react';
import { formatDate, getToday } from '../../utils/dateUtils';
import { getActivitiesForDate, getMoodForDate } from '../../utils/dataUtils';
import { getActivityCategory } from '../../models/activityModel';
import { getMoodLevel } from '../../models/moodModel';
import './Dashboard.css';

/**
 * Dashboard component serving as the home view
 * @param {Object} props - Component properties
 * @param {Function} props.onNavChange - Function to navigate to other views
 * @returns {JSX.Element} Dashboard component
 */
const Dashboard = ({ onNavChange }) => {
  const [todayDate] = useState(getToday());
  const [activities, setActivities] = useState([]);
  const [mood, setMood] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);

  // Load today's data
  useEffect(() => {
    const loadTodayData = () => {
      const todayActivities = getActivitiesForDate(todayDate);
      const todayMood = getMoodForDate(todayDate);
      
      setActivities(todayActivities);
      setMood(todayMood);
      
      // Calculate total activity minutes
      const total = todayActivities.reduce(
        (sum, activity) => sum + activity.duration, 
        0
      );
      setTotalMinutes(total);
    };
    
    loadTodayData();
    
    // Refresh data every 30 seconds in case user adds data in another component
    const interval = setInterval(loadTodayData, 30000);
    
    return () => clearInterval(interval);
  }, [todayDate]);

  // Group activities by category
  const activitiesByCategory = {};
  activities.forEach(activity => {
    if (!activitiesByCategory[activity.category]) {
      activitiesByCategory[activity.category] = [];
    }
    activitiesByCategory[activity.category].push(activity);
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Your LifeLog Dashboard</h2>
        <p className="date-display">{formatDate(todayDate)}</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-box">
          <div className="stat-value">{activities.length}</div>
          <div className="stat-label">Activities Today</div>
        </div>
        
        <div className="stat-box">
          <div className="stat-value">
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </div>
          <div className="stat-label">Total Time</div>
        </div>
        
        <div className="stat-box">
          <div className="stat-value">
            {mood ? (
              <span className="mood-emoji">
                {getMoodLevel(mood.level)?.icon || '❓'}
              </span>
            ) : (
              'Not Set'
            )}
          </div>
          <div className="stat-label">Today's Mood</div>
        </div>
      </div>
      
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Today's Activities</h3>
            <button 
              className="btn-sm" 
              onClick={() => onNavChange('activity')}
            >
              Add Activity
            </button>
          </div>
          
          {activities.length > 0 ? (
            <div className="activities-list">
              {Object.entries(activitiesByCategory).map(([category, categoryActivities]) => {
                const categoryInfo = getActivityCategory(category);
                return (
                  <div key={category} className="category-group">
                    <div 
                      className="category-header"
                      style={{ backgroundColor: `${categoryInfo?.color}20` }}
                    >
                      <span className="category-icon">
                        {categoryInfo?.icon}
                      </span>
                      <span className="category-name">
                        {categoryInfo?.label || category}
                      </span>
                      <span className="category-total">
                        {categoryActivities.reduce((sum, act) => sum + act.duration, 0)} min
                      </span>
                    </div>
                    
                    {categoryActivities.map(activity => (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-description">
                          {activity.description}
                        </div>
                        <div className="activity-duration">
                          {activity.duration} min
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <p>No activities logged for today</p>
              <button 
                className="btn" 
                onClick={() => onNavChange('activity')}
              >
                Log Your First Activity
              </button>
            </div>
          )}
        </div>
        
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Today's Mood</h3>
            <button 
              className="btn-sm" 
              onClick={() => onNavChange('mood')}
            >
              {mood ? 'Update Mood' : 'Set Mood'}
            </button>
          </div>
          
          {mood ? (
            <div className="mood-card">
              <div 
                className="mood-card-header"
                style={{ 
                  backgroundColor: `${getMoodLevel(mood.level)?.color}20`,
                  borderColor: getMoodLevel(mood.level)?.color 
                }}
              >
                <span className="mood-emoji-large">
                  {getMoodLevel(mood.level)?.icon}
                </span>
                <span className="mood-level-name">
                  {getMoodLevel(mood.level)?.label}
                </span>
              </div>
              
              {mood.factors && mood.factors.length > 0 && (
                <div className="mood-factors">
                  <h4>Affecting Factors</h4>
                  <div className="factors-list">
                    {mood.factors.map(factor => (
                      <div key={factor} className="factor-tag">
                        {factor}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {mood.note && (
                <div className="mood-note">
                  <h4>Notes</h4>
                  <p>{mood.note}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <p>No mood tracked for today</p>
              <button 
                className="btn" 
                onClick={() => onNavChange('mood')}
              >
                Track Your Mood
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="insights-preview">
        <div className="insights-preview-header">
          <h3>Your Insights</h3>
          <button 
            className="btn-sm"
            onClick={() => onNavChange('insights')}
          >
            View All Insights
          </button>
        </div>
        
        <div className="insights-preview-content">
          <p>
            Track your activities and moods regularly to unlock powerful insights
            about your lifestyle patterns, productivity trends, and emotional wellbeing.
          </p>
          <button 
            className="btn"
            onClick={() => onNavChange('insights')}
          >
            Explore Your Insights
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
