import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../config/api.js';

const Dashboard = () => {
  const navigate = useNavigate();
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
      { name: 'Approved', count: dashboardData.stats.approvedPapers, color: '#22c55e' },
      { name: 'Pending', count: dashboardData.stats.pendingPapers, color: '#f59e0b' },
      { name: 'Rejected', count: dashboardData.stats.rejectedPapers, color: '#ef4444' }
    ].filter(item => item.count > 0);
    
    return statusData.length > 0 ? statusData : [
      { name: 'Approved', count: 45, color: '#22c55e' },
      { name: 'Pending', count: 12, color: '#f59e0b' },
      { name: 'Rejected', count: 3, color: '#ef4444' }
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
  const StatCard = ({ title, value, subtitle, icon, color = "primary" }) => (
    <div className="bg-panel border border-white/10 rounded-xl p-6 transition-all hover:bg-white/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/70 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold text-${color} mt-1`}>{value}</p>
          {subtitle && <p className="text-white/50 text-xs mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`w-12 h-12 bg-${color}/20 rounded-lg flex items-center justify-center`}>
            <span className={`material-symbols-outlined text-${color} text-xl`}>{icon}</span>
          </div>
        )}
      </div>
    </div>
  );

  const BarChart = ({ data, title, color = "#22c55e" }) => {
    const [animated, setAnimated] = useState(false);
    const maxValue = Math.max(...data.map(d => d.count), 1);
    
    useEffect(() => {
      const timer = setTimeout(() => setAnimated(true), 600);
      return () => clearTimeout(timer);
    }, []);
    
    return (
      <div className="bg-panel border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
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
              <div className="w-32 text-white/70 text-sm font-medium truncate" title={item.name}>
                {item.name.length > 18 ? item.name.substring(0, 18) + '...' : item.name}
              </div>
              <div className="flex-1 bg-white/10 rounded-full h-4 relative overflow-hidden shadow-inner">
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
              <div className="w-12 text-white/90 text-sm font-bold text-right bg-white/5 px-2 py-1 rounded">
                {animated ? item.count : 0}
              </div>
              <div className="w-12 text-white/50 text-xs text-right">
                {animated && maxValue > 0 ? Math.round((item.count / maxValue) * 100) : 0}%
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const LineChart = ({ data, title }) => {
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
      <div className="bg-panel border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
        <div className="h-64 relative bg-gray-900/30 rounded-lg p-4">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.1"/>
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
              <line key={y} x1="5" y1={y} x2="95" y2={y} stroke="#ffffff10" strokeWidth="0.5"/>
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
              stroke="#22c55e"
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
                    fill="#22c55e"
                    stroke="#ffffff"
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
                    fill="#22c55e"
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
                className="absolute text-xs font-medium text-primary bg-gray-900/80 px-2 py-1 rounded backdrop-blur-sm"
                style={{
                  left: `${x}%`,
                  top: `${y - 10}%`,
                  transform: 'translate(-50%, -100%)',
                  animation: `fadeIn 0.5s ease-out ${1.5 + index * 0.1}s both`
                }}
              >
                {item.count}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-4 text-sm text-white/70 font-medium">
          {data.map((item, index) => (
            <span key={index} className="px-2 py-1 bg-white/5 rounded text-center min-w-12">
              {item.year}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const DonutChart = ({ data, title, customColors }) => {
    const [animated, setAnimated] = useState(false);
    const total = data.reduce((sum, item) => sum + item.count, 0);
    let cumulativePercentage = 0;

    useEffect(() => {
      const timer = setTimeout(() => setAnimated(true), 800);
      return () => clearTimeout(timer);
    }, []);

    const colors = customColors || ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

    return (
      <div className="bg-panel border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
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
              <span className="text-white/50 text-xs">Total</span>
              <span className={`text-white font-bold text-2xl transition-all duration-1000 ${animated ? 'scale-100' : 'scale-0'}`}>
                {animated ? total : 0}
              </span>
            </div>
          </div>
          <div className="ml-8 space-y-3">
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
                <span className="text-white/70 text-sm font-medium min-w-16">{item.name}</span>
                <span className="text-white/90 text-sm font-bold bg-white/5 px-2 py-1 rounded">
                  {item.count}
                </span>
                <span className="text-white/50 text-xs">
                  ({total > 0 ? Math.round((item.count / total) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ActivityFeed = ({ activities }) => (
    <div className="bg-panel border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activity.type === 'paper' ? 'bg-blue-500/20' : 'bg-green-500/20'
            }`}>
              <span className={`material-symbols-outlined text-sm ${
                activity.type === 'paper' ? 'text-blue-400' : 'text-green-400'
              }`}>
                {activity.type === 'paper' ? 'article' : 'label'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/90 text-sm font-medium truncate">
                {activity.title}
              </p>
              <p className="text-white/50 text-xs">
                {activity.type === 'paper' ? 'Paper' : 'Keyword'} • {activity.status}
              </p>
            </div>
            <div className="text-white/50 text-xs">
              {activity.date.toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="relative flex flex-col items-center gap-8">
              {/* Overwhelming loading animation */}
              <div className="relative">
                {/* Outer ring */}
                <div className="w-32 h-32 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                {/* Middle ring */}
                <div className="absolute inset-2 w-28 h-28 border-4 border-blue-400/20 border-r-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                {/* Inner ring */}
                <div className="absolute inset-4 w-24 h-24 border-4 border-yellow-400/20 border-b-yellow-400 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
                {/* Core */}
                <div className="absolute inset-8 w-16 h-16 border-4 border-red-400/20 border-l-red-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                {/* Center pulse */}
                <div className="absolute inset-12 w-8 h-8 bg-primary rounded-full animate-pulse"></div>
              </div>
              
              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                    style={{
                      left: `${20 + (i * 10)}%`,
                      top: `${30 + (i % 3) * 20}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: `${1 + (i % 3) * 0.5}s`
                    }}
                  ></div>
                ))}
              </div>
              
              {/* Text with typing animation */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white animate-pulse">Loading Dashboard</h2>
                <div className="flex items-center gap-1">
                  <p className="text-white/70 text-lg">Analyzing data</p>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
                
                {/* Progress indicators */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-white/60">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Fetching papers data...</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/60">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" style={{ animationDelay: '0.5s' }}></div>
                    <span>Loading keywords...</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/60">
                    <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" style={{ animationDelay: '1s' }}></div>
                    <span>Generating analytics...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <p className="text-white/70 mt-1 text-base">Overview of your research management system</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Key Metrics */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              color="green-400"
            />
            <StatCard
              title="Pending Reviews"
              value={dashboardData.stats.pendingPapers}
              subtitle="Awaiting approval"
              icon="schedule"
              color="yellow-400"
            />
            <StatCard
              title="Active Keywords"
              value={dashboardData.stats.activeKeywords}
              subtitle={`of ${dashboardData.stats.totalKeywords} total`}
              icon="label"
              color="blue-400"
            />
          </div>
        </section>

        {/* Charts Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Analytics & Insights</h2>

          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DonutChart
              data={getStatusData()}
              title="Paper Review Status Distribution"
              customColors={['#22c55e', '#f59e0b', '#ef4444']}
            />
          </div>
          
          {/* Secondary Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DonutChart
              data={getKeywordPriorityData()}
              title="Keywords by Priority Level"
            />
            <BarChart
              data={getInterventionData()}
              title="Research Intervention Types"
              color="#3b82f6"
            />
          </div>
          
          {/* Bottom Chart Row */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <BarChart
              data={getOutcomeData()}
              title="Expected Research Outcomes"
              color="#f59e0b"
            />
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityFeed activities={getRecentActivity()} />
            
            {/* Quick Stats */}
            <div className="bg-panel border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Quick Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Approval Rate</span>
                  <span className="text-primary font-semibold">
                    {dashboardData.stats.totalPapers > 0 
                      ? Math.round((dashboardData.stats.approvedPapers / dashboardData.stats.totalPapers) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Keywords Active</span>
                  <span className="text-green-400 font-semibold">
                    {dashboardData.stats.totalKeywords > 0 
                      ? Math.round((dashboardData.stats.activeKeywords / dashboardData.stats.totalKeywords) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Rejection Rate</span>
                  <span className="text-red-400 font-semibold">
                    {dashboardData.stats.totalPapers > 0 
                      ? Math.round((dashboardData.stats.rejectedPapers / dashboardData.stats.totalPapers) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Avg. Papers/Keyword</span>
                  <span className="text-blue-400 font-semibold">
                    {dashboardData.stats.totalKeywords > 0 
                      ? Math.round(dashboardData.stats.totalPapers / dashboardData.stats.totalKeywords * 10) / 10
                      : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;