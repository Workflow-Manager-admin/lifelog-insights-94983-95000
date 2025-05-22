import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Dashboard from '../../components/Dashboard/Dashboard';
import ActivityLog from '../../components/ActivityLog/ActivityLog';
import MoodTracker from '../../components/MoodTracker/MoodTracker';
import Insights from '../../components/Insights/Insights';
import './MainContainer.css';

/**
 * Main container component for the LifeLog Insights app
 * Integrates all app components and handles view switching
 * @returns {JSX.Element} MainContainer component
 */
const MainContainer = () => {
  // State to track the current active view
  const [activeView, setActiveView] = useState('dashboard');
  
  /**
   * Handle navigation changes
   * @param {string} view - View to navigate to
   */
  const handleNavChange = (view) => {
    setActiveView(view);
    // Scroll to top when changing views
    window.scrollTo(0, 0);
  };
  
  // Render the currently active view
  const renderActiveView = () => {
    switch (activeView) {
      case 'activity':
        return <ActivityLog />;
      case 'mood':
        return <MoodTracker />;
      case 'insights':
        return <Insights />;
      case 'dashboard':
      default:
        return <Dashboard onNavChange={handleNavChange} />;
    }
  };

  return (
    <div className="main-container">
      <Navbar 
        activeView={activeView} 
        onNavChange={handleNavChange} 
      />
      
      <main className="main-content">
        <div className="container">
          {renderActiveView()}
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>LifeLog Insights - Track your life, gain insights</p>
        </div>
      </footer>
    </div>
  );
};

export default MainContainer;
