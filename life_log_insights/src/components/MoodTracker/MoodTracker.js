import React, { useState, useEffect } from 'react';
import { createMood, getMoodLevels, getMoodFactors } from '../../models/moodModel';
import { saveMood, getMoodForDate } from '../../utils/dataUtils';
import { formatDate } from '../../utils/dateUtils';
import './MoodTracker.css';

/**
 * Component for tracking daily mood
 * @returns {JSX.Element} MoodTracker component
 */
const MoodTracker = () => {
  // State for form fields
  const [moodLevel, setMoodLevel] = useState(null);
  const [note, setNote] = useState('');
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  
  // Get mood levels and factors from model
  const moodLevels = getMoodLevels();
  const moodFactors = getMoodFactors();
  
  // Check if there's already a mood entry for today
  useEffect(() => {
    const checkExistingMood = () => {
      const existingMood = getMoodForDate(new Date(date));
      if (existingMood) {
        setMoodLevel(existingMood.level);
        setNote(existingMood.note || '');
        setSelectedFactors(existingMood.factors || []);
      } else {
        // Reset form if no existing mood
        setMoodLevel(null);
        setNote('');
        setSelectedFactors([]);
      }
    };
    
    checkExistingMood();
  }, [date]);
  
  /**
   * Toggle a factor in the selected factors list
   * @param {string} factorId - ID of the factor to toggle
   */
  const toggleFactor = (factorId) => {
    if (selectedFactors.includes(factorId)) {
      setSelectedFactors(selectedFactors.filter(id => id !== factorId));
    } else {
      setSelectedFactors([...selectedFactors, factorId]);
    }
  };
  
  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Validate form
    if (!moodLevel) {
      setError('Please select your mood level');
      return;
    }
    
    // Create and save mood
    const mood = createMood(
      moodLevel,
      note,
      selectedFactors,
      new Date(date)
    );
    
    const success = saveMood(mood);
    
    if (success) {
      setSuccessMessage('Mood tracked successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } else {
      setError('Failed to save mood. Please try again.');
    }
  };

  return (
    <div className="mood-tracker">
      <div className="mood-tracker-header">
        <h2>Track Your Mood</h2>
        <p>Record how you're feeling and what might be affecting your mood</p>
      </div>
      
      <form className="mood-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <div className="form-group">
          <label htmlFor="mood-date">Date</label>
          <input
            type="date"
            id="mood-date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
          <div className="form-note">
            {date && `Tracking mood for ${formatDate(new Date(date))}`}
          </div>
        </div>
        
        <div className="form-group">
          <label>How are you feeling today?</label>
          <div className="mood-level-selector">
            {moodLevels.map(level => (
              <button
                key={level.id}
                type="button"
                className={`mood-level-btn ${moodLevel === level.id ? 'selected' : ''}`}
                onClick={() => setMoodLevel(level.id)}
                style={{ 
                  '--hover-color': level.color,
                  '--selected-color': level.color 
                }}
              >
                <span className="mood-emoji">{level.icon}</span>
                <span className="mood-label">{level.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label>What's affecting your mood? (Select all that apply)</label>
          <div className="mood-factors-grid">
            {moodFactors.map(factor => (
              <button
                key={factor.id}
                type="button"
                className={`mood-factor-btn ${selectedFactors.includes(factor.id) ? 'selected' : ''}`}
                onClick={() => toggleFactor(factor.id)}
              >
                <span className="factor-emoji">{factor.icon}</span>
                <span className="factor-label">{factor.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="mood-note">Additional Notes (Optional)</label>
          <textarea
            id="mood-note"
            className="form-control"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add any notes about how you're feeling..."
            rows={3}
          ></textarea>
        </div>
        
        <button type="submit" className="btn btn-large">
          Save Mood
        </button>
      </form>
    </div>
  );
};

export default MoodTracker;
