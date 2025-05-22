import React from 'react';
import './Navbar.css';

/**
 * Navigation bar component for the LifeLog Insights app
 * @param {Object} props - Component properties
 * @param {Function} props.onNavChange - Function to call when nav item is clicked
 * @param {string} props.activeView - Currently active view
 * @returns {JSX.Element} Navbar component
 */
const Navbar = ({ onNavChange, activeView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'activity', label: 'Log Activity' },
    { id: 'mood', label: 'Track Mood' },
    { id: 'insights', label: 'Insights' }
  ];

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="logo">
            <span className="logo-symbol">📊</span> LifeLog Insights
          </div>

          <div className="nav-links">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={() => onNavChange(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
