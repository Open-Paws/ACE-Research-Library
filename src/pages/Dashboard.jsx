import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../config/api.js';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    papers: [],
    approvedPapers: [],
    keywords: [],
    stats: {
      totalPapers: 0,
      approvedPapers: 0,
      rejectedPapers: 0,
      pendingPapers: 0,
      totalKeywords: 0,
      activeKeywords: 0
    }
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [papers, approvedPapers, keywords] = await Promise.all([
        apiService.getPapers().catch(() => []),
        apiService.getApprovedPapers().catch(() => []),
        apiService.getKeywords().catch(() => [])
      ]);

      // Calculate statistics
      const stats = {
        totalPapers: papers.length,
        approvedPapers: papers.filter(p => p.Status === 'Approved').length,
        rejectedPapers: papers.filter(p => p.Status === 'Rejected').length,
        pendingPapers: papers.filter(p => p.Status === 'Pending').length,
        totalKeywords: keywords.length,
        activeKeywords: keywords.filter(k => k.Status === 'Active').length
      };

      setDashboardData({
        papers,
        approvedPapers,
        keywords,
        stats
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Chart data calculations
  const getInterventionData = () => {
    const interventions = {};
    dashboardData.papers.forEach(paper => {
      const intervention = paper['AI-Intervention'] || 'Unknown';
      interventions[intervention] = (interventions[intervention] || 0) + 1;
    });
    return Object.entries(interventions)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getOutcomeData = () => {
    const outcomes = {};
    dashboardData.papers.forEach(paper => {
      const outcome = paper['AI-Outcomes'] || 'Unknown';
      outcomes[outcome] = (outcomes[outcome] || 0) + 1;
    });
    return Object.entries(outcomes)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  };

  const getYearlyData = () => {
    const years = {};
    dashboardData.papers.forEach(paper => {
      const year = paper['Publication Year'];
      if (year && year !== 'Unknown' && !isNaN(year)) {
        years[year] = (years[year] || 0) + 1;
      }
    });
    
    const sortedYears = Object.entries(years)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year);
    
    // If no data, return sample data for demonstration
    if (sortedYears.length === 0) {
      return [
        { year: 2020, count: 2 },
        { year: 2021, count: 5 },
        { year: 2022, count: 8 },
        { year: 2023, count: 12 },
        { year: 2024, count: 15 },
        { year: 2025, count: 18 }
      ];
    }
    
    return sortedYears.slice(-6); // Last 6 years for better visualization
  };

  const getStatusData = () => {
    const statusData = [
      { name: 'Approved', count: dashboardData.stats.approvedPapers, color: '#00A6A1' },
      { name: 'Pending', count: dashboardData.stats.pendingPapers, color: '#A5AF1B' },
      { name: 'Rejected', count: dashboardData.stats.rejectedPapers, color: '#843468' }
    ].filter(item => item.count > 0);
    
    return statusData.length > 0 ? statusData : [
      { name: 'Approved', count: 45, color: '#00A6A1' },
      { name: 'Pending', count: 12, color: '#A5AF1B' },
      { name: 'Rejected', count: 3, color: '#843468' }
    ];
  };

  const getKeywordPriorityData = () => {
    const priorities = { High: 0, Medium: 0, Low: 0 };
    dashboardData.keywords.forEach(keyword => {
      if (priorities.hasOwnProperty(keyword.Priority)) {
        priorities[keyword.Priority]++;
      }
    });
    return Object.entries(priorities).map(([name, count]) => ({ name, count }));
  };

  const getRecentActivity = () => {
    const allActivity = [
      ...dashboardData.papers.map(p => ({
        type: 'paper',
        title: p.Title,
        status: p.Status,
        date: new Date(p['Date Retrieved'] || Date.now())
      })),
      ...dashboardData.keywords.map(k => ({
        type: 'keyword',
        title: k.Keyword,
        status: k.Status,
        date: new Date() // Keywords don't have date, use current
      }))
    ];
    
    return allActivity
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);
  };

  // Chart components
  const StatCard = ({ title, value, subtitle, icon, color = "primary" }) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    
    return (
    <div 
      className={`glass-panel ${isDark ? 'glass-panel-dark' : ''} rounded-2xl p-8 transition-all duration-500 animate-scale-in hover-lift group relative overflow-hidden`}
      style={{
        animationDelay: '0.1s',
        minHeight: '160px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)'
      }}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-white/20 to-transparent rounded-full -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-150"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <p style={{ 
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)',
            fontSize: '0.875rem',
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            margin: 0
          }}>
            {title}
          </p>
          {icon && (
            <div className="transition-transform duration-500 group-hover:rotate-12" style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, rgba(0, 166, 161, 0.1), rgba(0, 166, 161, 0.2))',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              flexShrink: 0
            }}>
              <span className="material-symbols-outlined" style={{ 
                color: 'var(--ace-teal)',
                fontSize: '28px'
              }}>
                {icon}
              </span>
            </div>
          )}
        </div>
        
        <div style={{ marginTop: '16px' }}>
          <p style={{ 
            fontSize: '3.5rem',
            fontWeight: 800,
            fontFamily: "'Montserrat', sans-serif",
            lineHeight: 1,
            margin: 0,
            color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
            letterSpacing: '-0.02em'
          }}>
            {value}
          </p>
          {subtitle && (
            <p style={{ 
              color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'var(--ace-navy-60)',
              fontSize: '0.875rem',
              marginTop: '8px',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500
            }}>
              {subtitle}
            </p>
          )}
          </div>
      </div>
    </div>
    );
  };

  const BarChart = ({ data, title, color = "#00A6A1" }) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const [animated, setAnimated] = useState(false);
    const maxValue = Math.max(...data.map(d => d.count), 1);
    
    useEffect(() => {
      const timer = setTimeout(() => setAnimated(true), 600);
      return () => clearTimeout(timer);
    }, []);
    
    return (
      <div 
        className={`glass-panel ${isDark ? 'glass-panel-dark' : ''} rounded-2xl p-8 hover-lift`}
        style={{ 
          minHeight: '400px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)'
        }}
      >
        <h3 className="text-xl font-bold mb-8 flex items-center gap-3" style={{ 
          color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', 
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '1.5rem',
          fontWeight: 700
        }}>
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>bar_chart</span>
          {title}
        </h3>
        <div className="space-y-5">
          {data.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 transition-all duration-500"
              style={{
                opacity: animated ? 1 : 0,
                transform: animated ? 'translateY(0)' : 'translateY(10px)',
                transitionDelay: `${index * 0.1}s`
              }}
            >
              <div style={{
                width: '128px',
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)',
                fontSize: '0.875rem',
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }} title={item.name}>
                {item.name.length > 18 ? item.name.substring(0, 18) + '...' : item.name}
              </div>
              <div className="flex-1 rounded-full h-4 relative overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)' }}>
                <div 
                  className="h-full rounded-full relative overflow-hidden"
                  style={{ 
                    width: animated ? `${(item.count / maxValue) * 100}%` : '0%',
                    background: `linear-gradient(90deg, ${color}60, ${color})`,
                    transition: `width ${1.5 + index * 0.1}s ease-out`,
                    transitionDelay: `${0.5 + index * 0.1}s`,
                    boxShadow: `inset 0 0 10px ${color}40, 0 0 10px ${color}20`
                  }}
                >
                  {/* Shimmer effect */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    style={{
                      animation: animated ? 'shimmer 2s ease-out infinite' : 'none',
                      animationDelay: `${1 + index * 0.1}s`
                    }}
                  ></div>
                </div>
              </div>
              <div style={{
                width: '48px',
                color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                fontSize: '0.875rem',
                fontWeight: 700,
                textAlign: 'right',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-5)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontFamily: "'Inter', sans-serif"
              }}>
                {animated ? item.count : 0}
              </div>
              <div style={{
                width: '48px',
                color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'var(--ace-navy-60)',
                fontSize: '0.75rem',
                textAlign: 'right',
                fontFamily: "'Inter', sans-serif"
              }}>
                {animated && maxValue > 0 ? Math.round((item.count / maxValue) * 100) : 0}%
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const LineChart = ({ data, title }) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const [animated, setAnimated] = useState(false);
    const maxValue = Math.max(...data.map(d => d.count), 1);
    
    useEffect(() => {
      const timer = setTimeout(() => setAnimated(true), 500);
      return () => clearTimeout(timer);
    }, []);

    const points = data.map((item, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 90 + 5; // Add padding
      const y = 85 - ((item.count / maxValue) * 70); // More visible range
      return `${x},${y}`;
    }).join(' ');

    const animatedPoints = animated ? points : data.map((_, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 90 + 5;
      return `${x},85`;
    }).join(' ');

    return (
      <div 
        className={`glass-panel ${isDark ? 'glass-panel-dark' : ''} rounded-2xl p-8 hover-lift`}
        style={{ 
          minHeight: '400px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)'
        }}
      >
        <h3 style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '1.5rem',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>show_chart</span>
          {title}
        </h3>
        <div className="h-72 relative rounded-xl p-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 100%)' }}>
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00A6A1" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#00A6A1" stopOpacity="0.1"/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Grid lines */}
            {[20, 40, 60, 80].map(y => (
              <line key={y} x1="5" y1={y} x2="95" y2={y} stroke="rgba(4, 28, 48, 0.1)" strokeWidth="0.5"/>
            ))}
            
            {/* Area under curve */}
            <polygon
              fill="url(#lineGradient)"
              points={`5,85 ${animatedPoints} 95,85`}
              style={{ transition: 'all 2s ease-out' }}
            />
            
            {/* Main line */}
            <polyline
              fill="none"
              stroke="#00A6A1"
              strokeWidth="3"
              points={animatedPoints}
              filter="url(#glow)"
              style={{ 
                transition: 'all 2s ease-out',
                strokeDasharray: animated ? 'none' : '200',
                strokeDashoffset: animated ? '0' : '200'
              }}
            />
            
            {/* Data points */}
            {data.map((item, index) => {
              const x = (index / Math.max(data.length - 1, 1)) * 90 + 5;
              const y = animated ? (85 - ((item.count / maxValue) * 70)) : 85;
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="2"
                    fill="#00A6A1"
                    stroke="#FFFFFF"
                    strokeWidth="1"
                    style={{ 
                      transition: `all ${1.5 + index * 0.1}s ease-out`,
                      transformOrigin: `${x}% ${y}%`
                    }}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill="#00A6A1"
                    fillOpacity="0.3"
                    style={{ 
                      transition: `all ${1.5 + index * 0.1}s ease-out`,
                      transformOrigin: `${x}% ${y}%`
                    }}
                  />
                </g>
              );
            })}
          </svg>
          
          {/* Value labels */}
          {animated && data.map((item, index) => {
            const x = (index / Math.max(data.length - 1, 1)) * 90 + 5;
            const y = 85 - ((item.count / maxValue) * 70);
            return (
              <div
                key={index}
                className="absolute text-xs font-medium px-2 py-1 rounded backdrop-blur-sm"
                style={{
                  left: `${x}%`,
                  top: `${y - 10}%`,
                  transform: 'translate(-50%, -100%)',
                  animation: `fadeIn 0.5s ease-out ${1.5 + index * 0.1}s both`,
                  color: 'var(--ace-teal)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                {item.count}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-6 text-sm font-semibold" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)' }}>
          {data.map((item, index) => (
            <span 
              key={index} 
              className="px-3 py-1.5 rounded-lg text-center min-w-12 transition-colors hover:bg-primary/10 hover:text-primary cursor-default"
              style={{
                fontFamily: "'Inter', sans-serif"
              }}
            >
              {item.year}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const DonutChart = ({ data, title, customColors }) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const [animated, setAnimated] = useState(false);
    const total = data.reduce((sum, item) => sum + item.count, 0);
    let cumulativePercentage = 0;

    useEffect(() => {
      const timer = setTimeout(() => setAnimated(true), 800);
      return () => clearTimeout(timer);
    }, []);

    const colors = customColors || ['#00A6A1', '#0C6DAB', '#A5AF1B', '#843468'];

    return (
      <div 
        className={`glass-panel ${isDark ? 'glass-panel-dark' : ''} rounded-2xl p-8 hover-lift`}
        style={{ 
          minHeight: '400px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)'
        }}
      >
        <h3 className="text-xl font-bold mb-8 flex items-center gap-3" style={{ 
          color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', 
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '1.5rem',
          fontWeight: 700
        }}>
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>pie_chart</span>
          {title}
        </h3>
        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
              {data.map((item, index) => {
                const percentage = (item.count / total) * 100;
                const animatedPercentage = animated ? percentage : 0;
                const strokeDasharray = `${animatedPercentage} ${100 - animatedPercentage}`;
                const strokeDashoffset = -cumulativePercentage;
                cumulativePercentage += percentage;

                return (
                  <circle
                    key={index}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke={item.color || colors[index % colors.length]}
                    strokeWidth="4"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{
                      transition: `all ${2 + index * 0.3}s ease-out`,
                      filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.3))'
                    }}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span style={{ 
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', 
                fontSize: '0.875rem', 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                marginBottom: '4px'
              }}>
                Total
              </span>
              <span 
                className={`font-bold transition-all duration-1000 ${animated ? 'scale-100' : 'scale-0'}`}
                style={{ 
                  color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', 
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '2rem',
                  fontWeight: 800
                }}
              >
                {animated ? total : 0}
              </span>
            </div>
          </div>
          <div className="ml-10 space-y-4">
            {data.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 transition-all duration-500"
                style={{ 
                  opacity: animated ? 1 : 0,
                  transform: animated ? 'translateX(0)' : 'translateX(20px)',
                  transitionDelay: `${1 + index * 0.2}s`
                }}
              >
                <div 
                  className="w-4 h-4 rounded-full shadow-lg" 
                  style={{ 
                    backgroundColor: item.color || colors[index % colors.length],
                    boxShadow: `0 0 8px ${item.color || colors[index % colors.length]}40`
                  }}
                ></div>
                <span style={{ 
                  color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', 
                  fontSize: '0.9375rem', 
                  fontWeight: 600, 
                  minWidth: '80px', 
                  fontFamily: "'Inter', sans-serif" 
                }}>
                  {item.name}
                </span>
                <span style={{ 
                  color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', 
                  fontSize: '1.125rem', 
                  fontWeight: 800, 
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)', 
                  padding: '6px 12px', 
                  borderRadius: '8px', 
                  fontFamily: "'Montserrat', sans-serif",
                  minWidth: '50px',
                  textAlign: 'center'
                }}>
                  {item.count}
                </span>
                <span style={{ 
                  color: 'var(--ace-navy-60)', 
                  fontSize: '0.875rem', 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500
                }}>
                  ({total > 0 ? Math.round((item.count / total) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ActivityFeed = ({ activities }) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    
    return (
    <div 
      className={`glass-panel ${isDark ? 'glass-panel-dark' : ''} rounded-2xl p-8 hover-lift`}
      style={{ 
        minHeight: '400px',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)'
      }}
    >
      <h3 style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '1.5rem',
        fontWeight: 700,
        letterSpacing: '-0.01em',
        color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>history</span>
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={index} 
            className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white/50 group"
            style={{ 
              border: '1px solid transparent',
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
              style={{
                background: activity.type === 'paper' ? 'linear-gradient(135deg, rgba(12, 109, 171, 0.1), rgba(12, 109, 171, 0.2))' : 'linear-gradient(135deg, rgba(0, 166, 161, 0.1), rgba(0, 166, 161, 0.2))',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
              }}
            >
              <span 
                className="material-symbols-outlined text-sm"
                style={{ color: activity.type === 'paper' ? 'var(--ace-ocean)' : 'var(--ace-teal)' }}
              >
                {activity.type === 'paper' ? 'article' : 'label'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ 
                color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                fontSize: '0.875rem',
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {activity.title}
              </p>
              <p style={{ 
                color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'var(--ace-navy-60)',
                fontSize: '0.75rem',
                fontFamily: "'Inter', sans-serif"
              }}>
                {activity.type === 'paper' ? 'Paper' : 'Keyword'} • {activity.status}
              </p>
            </div>
            <div style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'var(--ace-navy-60)', fontSize: '0.75rem', fontFamily: "'Inter', sans-serif" }}>
              {activity.date.toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };

  if (isLoading) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-10 relative" style={{ minHeight: '100vh', background: 'transparent', position: 'relative', zIndex: 0 }}>
        {/* Mesh Background Elements */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20" style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(0, 166, 161, 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(0, 166, 161, 0.15) 0%, transparent 70%)',
            transform: 'translate(-20%, -20%)'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="relative flex flex-col items-center gap-8">
              {/* ACE-branded loading animation */}
              <div className="relative">
                {/* Elegant spinner */}
                <div className="relative">
                  <div 
                    className="w-16 h-16 border-4 rounded-full animate-spin"
                    style={{
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)',
                      borderTopColor: 'var(--ace-teal)',
                      animationDuration: '1s'
                    }}
                  ></div>
                  <div 
                    className="absolute inset-0 w-16 h-16 border-4 rounded-full animate-spin"
                    style={{
                      borderColor: 'transparent',
                      borderRightColor: 'var(--ace-teal)',
                      opacity: 0.5,
                      animationDuration: '1.5s',
                      animationDirection: 'reverse'
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Text */}
              <div className="text-center space-y-3 animate-fade-in">
                <h2 style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)'
                }}>
                  Loading Dashboard
                </h2>
                <p style={{
                  color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)',
                  fontSize: '1rem',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  Analyzing data...
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-10 relative" style={{ minHeight: '100vh', background: 'transparent', position: 'relative', zIndex: 0 }}>
      {/* Mesh Background Elements */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20" style={{
          background: isDark 
            ? 'radial-gradient(circle, rgba(0, 166, 161, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0, 166, 161, 0.15) 0%, transparent 70%)',
          transform: 'translate(-20%, -20%)'
        }}></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full blur-3xl opacity-15" style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(12, 109, 171, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(12, 109, 171, 0.1) 0%, transparent 70%)',
          transform: 'translate(20%, -50%)'
        }}></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-10" style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(165, 175, 27, 0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(165, 175, 27, 0.1) 0%, transparent 70%)',
          transform: 'translate(-30%, 30%)'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-1">
        <div className="mb-12 animate-fade-in-up">
          <div className="relative inline-block">
            <h1 style={{ 
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '3.5rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
              marginBottom: '12px',
              lineHeight: '1.1',
              position: 'relative',
              zIndex: 1
            }}>
              Dashboard
            </h1>
            <div className="absolute -bottom-2 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10 animate-pulse"></div>
          </div>
          <p style={{ 
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)',
            marginTop: '8px',
            fontSize: '1.25rem',
            fontFamily: "'Inter', sans-serif",
            lineHeight: '1.6',
            maxWidth: '600px'
          }}>
            Welcome back to your research command center.
          </p>
        </div>

        {error && (
          <div 
            className="mb-6 p-4 border rounded-lg" 
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderColor: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444'
            }}
          >
            {error}
          </div>
        )}

        {/* Key Metrics */}
        <section className="mb-16">
          <h2 className="animate-fade-in-up mb-10" style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
            marginBottom: '40px'
          }}>
            Key Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard
              title="Total Papers"
              value={dashboardData.stats.totalPapers}
              subtitle="All research papers"
              icon="article"
              color="primary"
            />
            <StatCard
              title="Approved Papers"
              value={dashboardData.stats.approvedPapers}
              subtitle="Ready for library"
              icon="check_circle"
              color="teal"
            />
            <StatCard
              title="Pending Reviews"
              value={dashboardData.stats.pendingPapers}
              subtitle="Awaiting approval"
              icon="schedule"
              color="teal"
            />
            <StatCard
              title="Active Keywords"
              value={dashboardData.stats.activeKeywords}
              subtitle={`of ${dashboardData.stats.totalKeywords} total`}
              icon="label"
              color="teal"
            />
          </div>
        </section>

        {/* Charts Section */}
        <section className="mb-12">
          <h2 className="animate-fade-in-up" style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '2rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
            marginBottom: '32px'
          }}>
            Analytics & Insights
          </h2>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <DonutChart
              data={getStatusData()}
              title="Paper Review Status"
              customColors={['#00A6A1', '#A5AF1B', '#843468']}
            />
            <DonutChart
              data={getKeywordPriorityData()}
              title="Keywords by Priority"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BarChart
              data={getInterventionData()}
              title="Research Intervention Types"
              color="#0C6DAB"
            />
            <BarChart
              data={getOutcomeData()}
              title="Expected Research Outcomes"
              color="#A5AF1B"
            />
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-16">
          <h2 className="animate-fade-in-up mb-10" style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--ace-navy)',
            marginBottom: '40px'
          }}>
            Recent Activity
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityFeed activities={getRecentActivity()} />
            
            {/* Quick Stats */}
            <div 
              className={`glass-panel ${isDark ? 'glass-panel-dark' : ''} rounded-2xl p-8 hover-lift`}
              style={{ 
                minHeight: '400px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)'
              }}
            >
              <h3 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--ace-teal)' }}>bolt</span>
                Quick Statistics
              </h3>
              <div className="space-y-4">
                <div 
                  className="flex justify-between items-center p-6 rounded-xl transition-all duration-300"
                  style={{ 
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.4)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.6)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.6)';
                    e.currentTarget.style.boxShadow = isDark ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(4, 28, 48, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.4)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ 
                    color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', 
                    fontFamily: "'Inter', sans-serif", 
                    fontSize: '1rem',
                    fontWeight: 600
                  }}>
                    Approval Rate
                  </span>
                  <span style={{ 
                    color: 'var(--ace-teal)', 
                    fontWeight: 800, 
                    fontFamily: "'Montserrat', sans-serif", 
                    fontSize: '1.5rem'
                  }}>
                    {dashboardData.stats.totalPapers > 0 
                      ? Math.round((dashboardData.stats.approvedPapers / dashboardData.stats.totalPapers) * 100)
                      : 0}%
                  </span>
                </div>
                {[
                  { label: 'Keywords Active', value: dashboardData.stats.totalKeywords > 0 ? Math.round((dashboardData.stats.activeKeywords / dashboardData.stats.totalKeywords) * 100) : 0, suffix: '%', color: 'var(--ace-teal)' },
                  { label: 'Rejection Rate', value: dashboardData.stats.totalPapers > 0 ? Math.round((dashboardData.stats.rejectedPapers / dashboardData.stats.totalPapers) * 100) : 0, suffix: '%', color: 'var(--ace-berry)' },
                  { label: 'Avg. Papers/Keyword', value: dashboardData.stats.totalKeywords > 0 ? Math.round(dashboardData.stats.totalPapers / dashboardData.stats.totalKeywords * 10) / 10 : 0, suffix: '', color: 'var(--ace-ocean)' }
                ].map((stat, idx) => (
                  <div 
                    key={stat.label}
                    className="flex justify-between items-center p-6 rounded-xl transition-all duration-300"
                    style={{ 
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.4)',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.6)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.6)';
                      e.currentTarget.style.boxShadow = isDark ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(4, 28, 48, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.4)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span style={{ 
                      color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', 
                      fontFamily: "'Inter', sans-serif", 
                      fontSize: '1rem',
                      fontWeight: 600
                    }}>
                      {stat.label}
                  </span>
                    <span style={{ 
                      color: stat.color, 
                      fontWeight: 800, 
                      fontFamily: "'Montserrat', sans-serif", 
                      fontSize: '1.5rem'
                    }}>
                      {stat.value}{stat.suffix}
                  </span>
                </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;