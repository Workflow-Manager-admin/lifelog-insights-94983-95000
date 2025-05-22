import React, { useState } from 'react';
import { createActivity, getActivityCategories } from '../../models/activityModel';
import { saveActivity } from '../../utils/dataUtils';
import { formatDate } from '../../utils/dateUtils';
import './ActivityLog.css';

/**
 * Component for logging daily activities
 * @returns {JSX.Element} ActivityLog component
 */
const ActivityLog = () => {
  // State for form fields
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Get all activity categories
  const categories = getActivityCategories();
  
  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Validate form
    if (!category) {
      setError('Please select an activity category');
      return;
    }
    
    if (!description) {
      setError('Please enter a description');
      return;
    }
    
    if (!duration || isNaN(duration) || parseInt(duration) <= 0) {
      setError('Please enter a valid duration in minutes');
      return;
    }

    // Create and save activity
    const activity = createActivity(
      category,
      description,
      parseInt(duration),
      new Date(date)
    );
    
    const success = saveActivity(activity);
    
    if (success) {
      setSuccessMessage('Activity logged successfully!');
      // Reset form
      setCategory('');
      setDescription('');
      setDuration('');
      setDate(new Date().toISOString().split('T')[0]);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } else {
      setError('Failed to save activity. Please try again.');
    }
  };

  return (
    <div className="activity-log">
      <div className="activity-log-header">
        <h2>Log Your Activity</h2>
        <p>Record your daily activities to track how you spend your time</p>
      </div>
      
      <form className="activity-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <div className="form-group">
          <label htmlFor="activity-date">Date</label>
          <input
            type="date"
            id="activity-date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
          <div className="form-note">
            {date && `Logging activity for ${formatDate(new Date(date))}`}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="activity-category">Category</label>
          <select
            id="activity-category"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="activity-description">Description</label>
          <textarea
            id="activity-description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you do? Be specific."
            rows={3}
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="activity-duration">Duration (minutes)</label>
          <input
            type="number"
            id="activity-duration"
            className="form-control"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="How long did it take?"
            min="1"
          />
        </div>
        
        <button type="submit" className="btn btn-large">
          Log Activity
        </button>
      </form>
    </div>
  );
};

export default ActivityLog;
