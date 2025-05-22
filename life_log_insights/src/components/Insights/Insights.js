import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { getActivitiesInRange, getMoodsInRange } from '../../utils/dataUtils';
import { getPastDays, formatShortDate, getISODateString } from '../../utils/dateUtils';
import { ACTIVITY_CATEGORIES } from '../../models/activityModel';
import { getMoodLevels } from '../../models/moodModel';
import './Insights.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Component for visualizing insights from activity and mood data
 * @returns {JSX.Element} Insights component
 */
const Insights = () => {
  // State for date range
  const [dateRange, setDateRange] = useState(7);
  const [activities, setActivities] = useState({});
  const [moods, setMoods] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  };

  // Fetch data when date range changes
  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      
      const startDate = new Date();
      startDate.setDate(today.getDate() - (dateRange - 1));
      startDate.setHours(0, 0, 0, 0); // Start of the first day
      
      const activitiesData = getActivitiesInRange(startDate, today);
      const moodsData = getMoodsInRange(startDate, today);
      
      setActivities(activitiesData);
      setMoods(moodsData);
      setIsLoading(false);
    };
    
    fetchData();
  }, [dateRange]);

  // Generate dates array for the selected range
  const dates = getPastDays(dateRange).map(date => getISODateString(date));
  const dateLabels = getPastDays(dateRange).map(date => formatShortDate(date));

  // Prepare mood data for chart
  const moodData = {
    labels: dateLabels,
    datasets: [
      {
        label: 'Mood Level',
        data: dates.map(date => {
          const mood = moods[date];
          return mood ? mood.level : null;
        }),
        borderColor: '#E87A41',
        backgroundColor: 'rgba(232, 122, 65, 0.5)',
        tension: 0.3,
        fill: false,
      },
    ],
  };

  // Calculate total minutes per category
  const categoryTotals = {};
  
  Object.values(activities).flat().forEach(activity => {
    if (!categoryTotals[activity.category]) {
      categoryTotals[activity.category] = 0;
    }
    categoryTotals[activity.category] += activity.duration;
  });

  // Prepare activity data for chart
  const activityPieData = {
    labels: Object.keys(categoryTotals).map(
      catId => ACTIVITY_CATEGORIES[catId.toUpperCase()].label
    ),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: Object.keys(categoryTotals).map(
          catId => ACTIVITY_CATEGORIES[catId.toUpperCase()].color
        ),
        borderWidth: 1,
        borderColor: '#1A1A1A',
      },
    ],
  };

  // Prepare activity duration per day
  const activityBarData = {
    labels: dateLabels,
    datasets: Object.keys(categoryTotals).map(category => {
      const categoryInfo = ACTIVITY_CATEGORIES[category.toUpperCase()];
      return {
        label: categoryInfo.label,
        data: dates.map(date => {
          const dayActivities = activities[date] || [];
          const categoryActivities = dayActivities.filter(a => a.category === category);
          return categoryActivities.reduce((total, act) => total + act.duration, 0);
        }),
        backgroundColor: categoryInfo.color,
      };
    }),
  };

  // Calculate average mood level
  const moodValues = Object.values(moods).map(mood => mood.level);
  const averageMood = moodValues.length > 0 
    ? (moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length).toFixed(1)
    : 'N/A';
  
  // Get mood level label
  const moodLevels = getMoodLevels();
  const closestMoodLevel = moodLevels.find(level => 
    level.id === Math.round(parseFloat(averageMood))
  );

  // Calculate total activity time
  const totalActivityMinutes = Object.values(categoryTotals).reduce(
    (sum, minutes) => sum + minutes, 0
  );
  
  // Format as hours and minutes
  const totalActivityHours = Math.floor(totalActivityMinutes / 60);
  const totalActivityRemainingMinutes = totalActivityMinutes % 60;
  const totalActivityFormatted = `${totalActivityHours}h ${totalActivityRemainingMinutes}m`;

  // Handle range change
  const handleRangeChange = (range) => {
    setDateRange(range);
  };

  return (
    <div className="insights">
      <div className="insights-header">
        <h2>Your Insights</h2>
        <p>Visualize your lifestyle patterns over time</p>
        
        <div className="date-range-selector">
          <button 
            className={`range-btn ${dateRange === 7 ? 'active' : ''}`}
            onClick={() => handleRangeChange(7)}
          >
            Last Week
          </button>
          <button 
            className={`range-btn ${dateRange === 14 ? 'active' : ''}`}
            onClick={() => handleRangeChange(14)}
          >
            Last 2 Weeks
          </button>
          <button 
            className={`range-btn ${dateRange === 30 ? 'active' : ''}`}
            onClick={() => handleRangeChange(30)}
          >
            Last Month
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading">Loading your insights...</div>
      ) : (
        <div className="insights-content">
          {Object.keys(activities).length === 0 && Object.keys(moods).length === 0 ? (
            <div className="no-data">
              <h3>No data to display</h3>
              <p>Start tracking your activities and moods to see insights here!</p>
            </div>
          ) : (
            <>
              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-title">Average Mood</div>
                  <div className="stat-value">
                    {averageMood !== 'N/A' ? (
                      <>
                        <span className="stat-emoji">
                          {closestMoodLevel ? closestMoodLevel.icon : ''}
                        </span>
                        <span>{averageMood}</span>
                        <span className="stat-label">
                          {closestMoodLevel ? closestMoodLevel.label : ''}
                        </span>
                      </>
                    ) : (
                      'No mood data'
                    )}
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-title">Total Activity Time</div>
                  <div className="stat-value">
                    {totalActivityMinutes > 0 ? (
                      <>
                        <span className="stat-emoji">⏱️</span>
                        <span>{totalActivityFormatted}</span>
                      </>
                    ) : (
                      'No activity data'
                    )}
                  </div>
                </div>
              </div>
              
              <div className="chart-grid">
                {Object.keys(moods).length > 0 && (
                  <div className="chart-container">
                    <h3>Mood Trend</h3>
                    <div className="chart-wrapper">
                      <Line options={chartOptions} data={moodData} />
                    </div>
                  </div>
                )}
                
                {Object.keys(categoryTotals).length > 0 && (
                  <>
                    <div className="chart-container">
                      <h3>Activity Distribution</h3>
                      <div className="chart-wrapper">
                        <Pie 
                          options={{
                            ...chartOptions,
                            maintainAspectRatio: true,
                            aspectRatio: 1
                          }} 
                          data={activityPieData} 
                        />
                      </div>
                    </div>
                    
                    <div className="chart-container wide">
                      <h3>Daily Activity Breakdown</h3>
                      <div className="chart-wrapper">
                        <Bar 
                          options={{
                            ...chartOptions,
                            scales: {
                              ...chartOptions.scales,
                              x: {
                                ...chartOptions.scales.x,
                                stacked: true,
                              },
                              y: {
                                ...chartOptions.scales.y,
                                stacked: true,
                                title: {
                                  display: true,
                                  text: 'Minutes',
                                  color: 'rgba(255, 255, 255, 0.7)'
                                }
                              }
                            }
                          }} 
                          data={activityBarData} 
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Insights;
