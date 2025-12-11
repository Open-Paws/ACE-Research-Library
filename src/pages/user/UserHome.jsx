import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../config/api.js';
import { useTheme } from '../../context/ThemeContext';

const UserHome = () => {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('year');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedKeyword, setSelectedKeyword] = useState('all');
  const [expandedPaperId, setExpandedPaperId] = useState(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    loadAllPapers();
  }, []);

  useEffect(() => {
    filterAndSortPapers();
  }, [papers, searchTerm, sortBy, sortOrder, selectedYear, selectedKeyword]);

  const loadAllPapers = async () => {
    try {
      setIsLoading(true);
      // Simulate loading delay for shimmer effect
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = await apiService.getPapers();
      setPapers(data || []);
    } catch (err) {
      console.error('Error loading papers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortPapers = () => {
    let filtered = [...papers];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(paper => 
        paper.Title?.toLowerCase().includes(term) ||
        paper.Authors?.toLowerCase().includes(term) ||
        paper['AI-Generated Summary']?.toLowerCase().includes(term) ||
        paper['Source Keyword']?.toLowerCase().includes(term) ||
        paper['AI-Intervention']?.toLowerCase().includes(term) ||
        paper['AI-Outcomes']?.toLowerCase().includes(term)
      );
    }

    if (selectedYear !== 'all') {
      filtered = filtered.filter(paper => paper['Publication Year']?.toString() === selectedYear);
    }

    if (selectedKeyword !== 'all') {
      filtered = filtered.filter(paper => paper['Source Keyword'] === selectedKeyword);
    }

    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'title':
          aVal = a.Title || '';
          bVal = b.Title || '';
          break;
        case 'year':
          aVal = parseInt(a['Publication Year']) || 0;
          bVal = parseInt(b['Publication Year']) || 0;
          break;
        case 'score':
          aVal = parseFloat(a['AI Filtering Score']) || 0;
          bVal = parseFloat(b['AI Filtering Score']) || 0;
          break;
        default:
          return 0;
      }
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    setFilteredPapers(filtered);
  };

  const getUniqueYears = () => {
    const years = [...new Set(papers.map(p => p['Publication Year']).filter(Boolean))].sort((a, b) => b - a);
    return years;
  };

  const getUniqueKeywords = () => {
    const keywords = [...new Set(papers.map(p => p['Source Keyword']).filter(Boolean))].sort();
    return keywords;
  };

  const handleViewDetails = (paper) => {
    localStorage.setItem('selectedPaper', JSON.stringify(paper));
    navigate('/paper-details');
  };

  const toggleSummary = (paperId) => {
    setExpandedPaperId(expandedPaperId === paperId ? null : paperId);
  };

  // Shimmer loading skeleton
  const PaperCardSkeleton = () => (
    <div 
      className={`glass-panel ${isDark ? 'glass-panel-dark' : ''} rounded-2xl p-6 animate-pulse`}
      style={{ 
        minHeight: '380px',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-lg"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 166, 161, 0.1)'
          }}
        ></div>
        <div 
          className="w-20 h-6 rounded"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 166, 161, 0.1)'
          }}
        ></div>
      </div>
      <div 
        className="h-6 rounded mb-3 w-3/4"
        style={{
          background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.1)'
        }}
      ></div>
      <div 
        className="h-4 rounded mb-4 w-1/2"
        style={{
          background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(4, 28, 48, 0.08)'
        }}
      ></div>
      <div className="space-y-2 mb-6">
        <div 
          className="h-3 rounded w-full"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(4, 28, 48, 0.08)'
          }}
        ></div>
        <div 
          className="h-3 rounded w-5/6"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(4, 28, 48, 0.08)'
          }}
        ></div>
        <div 
          className="h-3 rounded w-4/6"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(4, 28, 48, 0.08)'
          }}
        ></div>
      </div>
      <div className="flex gap-3 mt-auto">
        <div 
          className="h-10 rounded-lg flex-1"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 166, 161, 0.1)'
          }}
        ></div>
        <div 
          className="h-10 rounded-lg w-32"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 166, 161, 0.1)'
          }}
        ></div>
      </div>
    </div>
  );

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        background: 'transparent', 
        padding: '32px 16px',
        position: 'relative',
        zIndex: 0
      }}
    >
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

        {/* Minimalistic decorative icons */}

      </div>

      <div style={{ maxWidth: 1600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="relative inline-block">
            <h1 className="text-gradient-ace text-5xl md:text-7xl" style={{
              fontFamily: "'Montserrat', sans-serif",
              lineHeight: 1.1,
              margin: 0,
              fontWeight: 800,
              letterSpacing: '0.005em',
              marginBottom: '20px',
              color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)'
            }}>
              Research Papers
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
          </div>
          <p style={{
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)',
            fontSize: '1.5rem',
            lineHeight: 1.6,
            fontFamily: "'Inter', sans-serif",
            maxWidth: '700px',
            margin: '0 auto',
            fontWeight: 500
          }}>
            Explore our comprehensive collection of animal welfare research papers
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className={`glass-panel ${isDark ? 'glass-panel-dark' : ''} rounded-2xl p-6 mb-8 animate-fade-in-up`} style={{ 
          animationDelay: '0.1s',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)'
        }}>
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="relative flex-1 group">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search papers by title, authors, keywords, or content..."
                className="w-full rounded-xl border pl-14 pr-4 py-3.5 text-base transition-all duration-300"
                style={{
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.1)',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
                  color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                  fontFamily: "'Inter', sans-serif"
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'white';
                  e.target.style.borderColor = 'var(--ace-teal)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(0, 166, 161, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)';
                  e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div className="flex gap-3 flex-wrap">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-3 rounded-xl border transition-all duration-300"
                style={{
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.1)',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
                  color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                  fontFamily: "'Inter', sans-serif",
                  minWidth: '140px'
                }}
              >
                <option value="all">All Years</option>
                {getUniqueYears().map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>

              <select
                value={selectedKeyword}
                onChange={(e) => setSelectedKeyword(e.target.value)}
                className="px-4 py-3 rounded-xl border transition-all duration-300"
                style={{
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.1)',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
                  color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                  fontFamily: "'Inter', sans-serif",
                  minWidth: '160px'
                }}
              >
                <option value="all">All Keywords</option>
                {getUniqueKeywords().map(keyword => (
                  <option key={keyword} value={keyword}>{keyword}</option>
                ))}
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-4 py-3 rounded-xl border transition-all duration-300"
                style={{
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.1)',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
                  color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                  fontFamily: "'Inter', sans-serif",
                  minWidth: '180px'
                }}
              >
                <option value="year-desc">Year: Newest First</option>
                <option value="year-asc">Year: Oldest First</option>
                <option value="title-asc">Title: A-Z</option>
                <option value="title-desc">Title: Z-A</option>
                <option value="score-desc">Score: Highest</option>
                <option value="score-asc">Score: Lowest</option>
              </select>
            </div>
          </div>

          <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.1)'}` }}>
            <p style={{
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)',
              fontSize: '0.9375rem',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500
            }}>
              Showing <strong style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)' }}>{filteredPapers.length}</strong> of <strong style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)' }}>{papers.length}</strong> papers
            </p>
          </div>
        </div>

        {/* Papers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <PaperCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredPapers.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-24 h-24 mx-auto mb-6 rounded-xl flex items-center justify-center" style={{
              background: isDark ? 'rgba(0, 166, 161, 0.2)' : 'linear-gradient(135deg, rgba(0, 166, 161, 0.1), rgba(0, 166, 161, 0.2))'
            }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--ace-teal)', fontSize: '48px' }}>search_off</span>
            </div>
            <h3 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
              marginBottom: '8px'
            }}>
              No papers found
            </h3>
            <p style={{
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)',
              fontSize: '1rem',
              fontFamily: "'Inter', sans-serif"
            }}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPapers.map((paper, index) => {
              const isExpanded = expandedPaperId === paper['Paper ID'];
              const summary = paper['AI-Generated Summary'] || '';
              
              // Color variations for cards - cycle through different accent colors
              const colorVariations = [
                { primary: 'var(--ace-teal)', secondary: 'rgba(0, 166, 161, 0.15)', icon: 'article' },
                { primary: 'var(--ace-ocean)', secondary: 'rgba(12, 109, 171, 0.15)', icon: 'science' },
                { primary: 'var(--ace-apple)', secondary: 'rgba(165, 175, 27, 0.15)', icon: 'eco' },
                { primary: '#8B5CF6', secondary: 'rgba(139, 92, 246, 0.15)', icon: 'insights' } // Purple instead of pink
              ];
              const cardColor = colorVariations[index % colorVariations.length];
              
              return (
                <div
                  key={paper['Paper ID']}
                  className={`glass-panel ${isDark ? 'glass-panel-dark' : ''} rounded-2xl p-6 cursor-pointer animate-scale-in relative overflow-hidden group transition-all duration-300`}
                  style={{ 
                    animationDelay: `${index * 0.03}s`,
                    minHeight: isExpanded ? 'auto' : '380px',
                    display: 'flex',
                    flexDirection: 'column',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)',
                    zIndex: isExpanded ? 10 : 1,
                    transform: 'translateY(0)',
                    boxShadow: isDark 
                      ? '0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                      : '0 2px 12px rgba(4, 28, 48, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                    borderLeft: `3px solid ${cardColor.primary}`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)';
                    e.currentTarget.style.boxShadow = isDark
                      ? '0 12px 32px rgba(0, 166, 161, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
                      : '0 8px 24px rgba(4, 28, 48, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.borderColor = isDark ? 'rgba(0, 166, 161, 0.3)' : 'rgba(0, 166, 161, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = isDark 
                      ? '0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                      : '0 2px 12px rgba(4, 28, 48, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
                    e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)';
                  }}
                >
                  {/* Animated shimmer effect on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: isDark
                        ? 'linear-gradient(110deg, transparent 40%, rgba(0, 166, 161, 0.15) 50%, transparent 60%)'
                        : 'linear-gradient(110deg, transparent 40%, rgba(0, 166, 161, 0.08) 50%, transparent 60%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s infinite'
                    }}
                  ></div>
                  
                  {/* Decorative gradient orb with pulse animation */}
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 rounded-full transition-all duration-700 group-hover:scale-150 group-hover:opacity-100" 
                    style={{
                      background: isDark 
                        ? `radial-gradient(circle, ${cardColor.secondary.replace('0.15', '0.25')} 0%, transparent 70%)`
                        : `radial-gradient(circle, ${cardColor.secondary} 0%, transparent 70%)`,
                      transform: 'translate(30%, -30%)',
                      opacity: 0.7,
                      animation: 'pulse-glow 3s ease-in-out infinite'
                    }}
                  ></div>
                  
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <div 
                      className="rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" 
                      style={{
                        width: '56px',
                        height: '56px',
                        background: isDark 
                          ? `linear-gradient(135deg, ${cardColor.secondary.replace('0.15', '0.25')}, ${cardColor.secondary.replace('0.15', '0.35')})`
                          : `linear-gradient(135deg, ${cardColor.secondary}, ${cardColor.secondary.replace('0.15', '0.25')})`,
                        border: isDark ? `1px solid ${cardColor.primary}40` : 'none',
                        boxShadow: isDark 
                          ? `0 2px 8px ${cardColor.secondary.replace('0.15', '0.2')}`
                          : `0 2px 6px ${cardColor.secondary}`
                      }}
                    >
                      <span 
                        className="material-symbols-outlined transition-transform duration-300 group-hover:scale-110" 
                        style={{ 
                          color: cardColor.primary, 
                          fontSize: '28px',
                          filter: `drop-shadow(0 1px 2px ${cardColor.secondary.replace('0.15', '0.3')})`
                        }}
                      >
                        {cardColor.icon}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {paper['Publication Year'] && (
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="material-symbols-outlined" 
                            style={{ 
                              color: cardColor.primary,
                              fontSize: '14px'
                            }}
                          >
                            calendar_today
                          </span>
                          <span 
                            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 group-hover:scale-105" 
                            style={{
                              backgroundColor: isDark ? cardColor.secondary.replace('0.15', '0.25') : cardColor.secondary,
                              color: cardColor.primary,
                              fontFamily: "'Inter', sans-serif",
                              border: isDark ? `1px solid ${cardColor.primary}40` : 'none',
                              boxShadow: isDark 
                                ? `0 2px 6px ${cardColor.secondary.replace('0.15', '0.15')}`
                                : `0 1px 3px ${cardColor.secondary}`
                            }}
                          >
                            {paper['Publication Year']}
                          </span>
                        </div>
                      )}
                      {paper['AI Filtering Score'] && (
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="material-symbols-outlined" 
                            style={{ 
                              color: cardColor.primary,
                              fontSize: '14px'
                            }}
                          >
                            star
                          </span>
                          <span 
                            className="px-2.5 py-0.5 rounded text-xs font-semibold transition-all duration-300 group-hover:scale-105" 
                            style={{
                              backgroundColor: isDark ? cardColor.secondary.replace('0.15', '0.25') : cardColor.secondary,
                              color: cardColor.primary,
                              fontFamily: "'Inter', sans-serif",
                              border: isDark ? `1px solid ${cardColor.primary}40` : 'none',
                              boxShadow: isDark 
                                ? `0 2px 6px ${cardColor.secondary.replace('0.15', '0.15')}`
                                : `0 1px 3px ${cardColor.secondary}`
                            }}
                          >
                            {parseFloat(paper['AI Filtering Score']).toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => handleViewDetails(paper)}
                    className="transition-all duration-300 group-hover:text-primary cursor-pointer"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                      marginBottom: '10px',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flexShrink: 0,
                      letterSpacing: '-0.01em'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--ace-teal)';
                      e.target.style.transform = 'translateX(2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = isDark ? 'var(--ace-white)' : 'var(--ace-navy)';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    {paper.Title || 'Untitled'}
                  </h3>

                  {/* Authors */}
                  <div 
                    className="flex items-center gap-2 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      marginBottom: '14px',
                      flexShrink: 0,
                      opacity: 0.9
                    }}
                  >
                    <span 
                      className="material-symbols-outlined" 
                      style={{ 
                        color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'var(--ace-navy-60)',
                        fontSize: '16px'
                      }}
                    >
                      person
                    </span>
                    <p 
                      style={{
                        color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'var(--ace-navy-60)',
                        fontSize: '0.8125rem',
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        margin: 0
                      }}
                    >
                      {paper.Authors || 'Unknown Authors'}
                    </p>
                  </div>

                  {/* Summary Section */}
                  <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    {/* Abstract - Always visible if available */}
                    {paper.Abstract ? (
                      <div>
                        <div className="flex items-start gap-2 mb-3">
                          <span 
                            className="material-symbols-outlined" 
                            style={{ 
                              color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'var(--ace-navy-60)',
                              fontSize: '16px',
                              marginTop: '2px',
                              flexShrink: 0
                            }}
                          >
                            description
                          </span>
                          <div style={{ flex: 1 }}>
                            {paper.Abstract.length > 320 ? (
                              <p 
                                className="transition-all duration-500"
                                style={{
                                  color: isDark ? 'rgba(255, 255, 255, 0.75)' : 'var(--ace-navy-60)',
                                  fontSize: '0.875rem',
                                  fontFamily: "'Inter', sans-serif",
                                  lineHeight: '1.65',
                                  marginBottom: 0,
                                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                              >
                                {paper.Abstract.substring(0, 600)}
                                <span style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'var(--ace-navy-60)' }}>...</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(paper);
                                  }}
                                  className="ml-1 transition-all duration-300 hover:opacity-80"
                                  style={{
                                    color: cardColor.primary,
                                    fontSize: '0.875rem',
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 600,
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    textDecoration: 'none'
                                  }}
                                >
                                  Show More
                                </button>
                              </p>
                            ) : (
                              <p 
                                className="transition-all duration-500"
                                style={{
                                  color: isDark ? 'rgba(255, 255, 255, 0.75)' : 'var(--ace-navy-60)',
                                  fontSize: '0.875rem',
                                  fontFamily: "'Inter', sans-serif",
                                  lineHeight: '1.65',
                                  marginBottom: 0,
                                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                              >
                                {paper.Abstract}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* If no abstract, show AI summary directly (if available) */
                      summary && !isExpanded && (
                        <div className="flex items-start gap-2 mb-3">
                          <span 
                            className="material-symbols-outlined" 
                            style={{ 
                              color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'var(--ace-navy-60)',
                              fontSize: '16px',
                              marginTop: '2px',
                              flexShrink: 0
                            }}
                          >
                            auto_awesome
                          </span>
                          <p 
                            className="transition-all duration-500"
                            style={{
                              color: isDark ? 'rgba(255, 255, 255, 0.75)' : 'var(--ace-navy-60)',
                              fontSize: '0.875rem',
                              fontFamily: "'Inter', sans-serif",
                              lineHeight: '1.65',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              marginBottom: 0,
                              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                          >
                            {summary}
                          </p>
                        </div>
                      )
                    )}
                    
                    {/* AI Summary - Only visible when expanded */}
                    {isExpanded && summary && (
                      <div 
                        className="mb-3 animate-fade-in flex items-start gap-2"
                        style={{
                          animation: 'fadeIn 0.3s ease-out'
                        }}
                      >
                        <span 
                          className="material-symbols-outlined" 
                          style={{ 
                            color: 'var(--ace-teal)',
                            fontSize: '18px',
                            marginTop: '2px',
                            flexShrink: 0
                          }}
                        >
                          auto_awesome
                        </span>
                        <p 
                          className="transition-all duration-500"
                          style={{
                            color: isDark ? 'rgba(255, 255, 255, 0.85)' : 'var(--ace-navy-60)',
                            fontSize: '0.875rem',
                            fontFamily: "'Inter', sans-serif",
                            lineHeight: '1.7',
                            marginBottom: 0,
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            fontWeight: 500
                          }}
                        >
                          {summary}
                        </p>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div 
                      className="flex items-center pt-4 transition-all duration-300" 
                      style={{
                        borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(4, 28, 48, 0.08)'}`,
                        gap: summary ? '10px' : '0'
                      }}
                    >
                      {summary && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSummary(paper['Paper ID']);
                          }}
                          className="px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 relative overflow-hidden group/btn"
                          style={{
                            backgroundColor: isExpanded 
                              ? (isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(4, 28, 48, 0.08)')
                              : 'var(--ace-teal)',
                            color: 'var(--ace-white)',
                            fontFamily: "'Inter', sans-serif",
                            boxShadow: isExpanded 
                              ? 'none'
                              : '0 2px 8px rgba(0, 166, 161, 0.25)',
                            border: 'none',
                            cursor: 'pointer',
                            transform: 'scale(1)'
                          }}
                          onMouseEnter={(e) => {
                            if (!isExpanded) {
                              e.target.style.transform = 'scale(1.05)';
                              e.target.style.boxShadow = '0 4px 12px rgba(0, 166, 161, 0.35)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = isExpanded 
                              ? 'none'
                              : '0 2px 8px rgba(0, 166, 161, 0.25)';
                          }}
                        >
                          <span className="relative z-10">{isExpanded ? 'Hide Summary' : 'AI Summary'}</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleViewDetails(paper)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center gap-1.5 ${summary ? 'flex-1' : 'w-full'} justify-center group/read`}
                        style={{
                          backgroundColor: 'transparent',
                          border: `1px solid ${isDark ? 'rgba(0, 166, 161, 0.4)' : 'rgba(0, 166, 161, 0.3)'}`,
                          color: 'var(--ace-teal)',
                          fontFamily: "'Inter', sans-serif",
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = isDark ? 'rgba(0, 166, 161, 0.15)' : 'rgba(0, 166, 161, 0.08)';
                          e.currentTarget.style.borderColor = 'var(--ace-teal)';
                          e.currentTarget.style.transform = 'translateX(2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = isDark ? 'rgba(0, 166, 161, 0.4)' : 'rgba(0, 166, 161, 0.3)';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <span>Read Full</span>
                        <span 
                          className="material-symbols-outlined transition-transform duration-300 group-hover/read:translate-x-1" 
                          style={{ fontSize: '16px' }}
                        >
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  {(paper['Source Keyword'] || paper['AI-Intervention']) && (
                    <div 
                      className="flex flex-wrap gap-2 mt-4 pt-3 transition-opacity duration-300 group-hover:opacity-100" 
                      style={{
                        borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(4, 28, 48, 0.08)'}`,
                        opacity: 0.9
                      }}
                    >
                      {paper['Source Keyword'] && (
                        <span 
                          className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 cursor-default flex items-center gap-1.5" 
                          style={{
                            backgroundColor: isDark ? cardColor.secondary.replace('0.15', '0.2') : cardColor.secondary,
                            color: cardColor.primary,
                            fontFamily: "'Inter', sans-serif",
                            border: isDark ? `1px solid ${cardColor.primary}30` : 'none'
                          }}
                        >
                          <span 
                            className="material-symbols-outlined" 
                            style={{ fontSize: '14px' }}
                          >
                            label
                          </span>
                          {paper['Source Keyword']}
                        </span>
                      )}
                      {paper['AI-Intervention'] && (
                        <span 
                          className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 cursor-default flex items-center gap-1.5" 
                          style={{
                            backgroundColor: isDark ? cardColor.secondary.replace('0.15', '0.2') : cardColor.secondary,
                            color: cardColor.primary,
                            fontFamily: "'Inter', sans-serif",
                            border: isDark ? `1px solid ${cardColor.primary}30` : 'none'
                          }}
                        >
                          <span 
                            className="material-symbols-outlined" 
                            style={{ fontSize: '14px' }}
                          >
                            category
                          </span>
                          {paper['AI-Intervention']}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHome;
