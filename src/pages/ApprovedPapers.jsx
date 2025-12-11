import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../config/api.js';
import { useTheme } from '../context/ThemeContext';

const ApprovedPapers = () => {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  // Load papers on component mount
  useEffect(() => {
    loadApprovedPapers();
  }, []);

  // Filter and sort papers when dependencies change
  useEffect(() => {
    let filtered = [...papers];

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(paper => 
        paper.Title?.toLowerCase().includes(term) ||
        paper.Authors?.toLowerCase().includes(term) ||
        paper['AI-Generated Summary']?.toLowerCase().includes(term) ||
        paper['Source Keyword']?.toLowerCase().includes(term) ||
        paper['AI-Outcomes']?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'title':
          aVal = a.Title || '';
          bVal = b.Title || '';
          break;
        case 'authors':
          aVal = a.Authors || '';
          bVal = b.Authors || '';
          break;
        case 'year':
          aVal = a['Publication Year'] || 0;
          bVal = b['Publication Year'] || 0;
          break;
        case 'date':
          aVal = new Date(a['Date Retrieved'] || 0);
          bVal = new Date(b['Date Retrieved'] || 0);
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredPapers(filtered);
  }, [papers, searchTerm, sortBy, sortOrder]);

  // Helper functions for filters
  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('title');
    setSortOrder('asc');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm.trim()) count++;
    return count;
  };

  const getActiveFilters = () => {
    const filters = [];
    if (searchTerm.trim()) {
      filters.push({ type: 'Search', value: searchTerm, key: 'search' });
    }
    return filters;
  };

  const removeFilter = (filterKey) => {
    switch (filterKey) {
      case 'search':
        setSearchTerm('');
        break;
      default:
        break;
    }
  };

  const loadApprovedPapers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getApprovedPapers();
      setPapers(data || []);
    } catch (err) {
      console.error('Error loading approved papers:', err);
      setError('Failed to load approved papers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleViewDetails = (paper) => {
    // Store paper data in localStorage for PaperDetails component
    localStorage.setItem('selectedPaper', JSON.stringify(paper));
    navigate('/paper-details');
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return 'unfold_more';
    return sortOrder === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <main className="flex-1 w-full px-4 sm:px-6 lg:px-14 py-8 relative" style={{ background: 'transparent', position: 'relative', zIndex: 0 }}>
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
      </div>

      <div className="mx-auto max-w-[1360px] relative z-1">
        <div className="mb-10 animate-fade-in-up">
          <h1 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '3rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
            marginBottom: '12px',
            lineHeight: '1.1'
          }}>
            Approved Papers
          </h1>
          <p style={{ 
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)',
            marginTop: '8px',
            fontSize: '1.125rem',
            fontFamily: "'Inter', sans-serif",
            lineHeight: '1.6'
          }}>
            Browse and manage approved research papers in the library.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Papers Table Container */}
        <div className={`glass-panel ${isDark ? 'glass-panel-dark' : ''} rounded-xl border animate-fade-in-up`} style={{ border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)', boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(4, 28, 48, 0.08)' }}>
          {/* Search and Filter Bar */}
          <div className="p-4 border-b" style={{ borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)' }}>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-4">
              <div className="relative w-full sm:w-80">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2" style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(4, 28, 48, 0.4)' }}>search</span>
                <input 
                  className="w-full rounded-lg border pl-10 text-sm transition-all duration-300" 
                  placeholder="Search papers, authors, keywords..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              <div className="flex items-center gap-3">
                {getActiveFiltersCount() > 0 && (
                  <span className="text-sm" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)' }}>
                    {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} applied
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
                  style={{
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.1)',
                    color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                    fontFamily: "'Inter', sans-serif"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(4, 28, 48, 0.15)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.1)'}
                >
                  <span className="material-symbols-outlined text-base">refresh</span>
                  Reset
                </button>
              </div>
            </div>
            
            {/* Applied Filters */}
            {getActiveFilters().length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium" style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'var(--ace-navy-60)' }}>Active filters:</span>
                  {getActiveFilters().map((filter) => (
                    <span
                      key={filter.key}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors"
                      style={{
                        backgroundColor: isDark ? 'rgba(0, 166, 161, 0.2)' : 'rgba(0, 166, 161, 0.1)',
                        color: 'var(--ace-teal)',
                        borderColor: 'rgba(0, 166, 161, 0.3)',
                        fontFamily: "'Inter', sans-serif"
                      }}
                    >
                      <span>{filter.type}: {filter.value}</span>
                      <button
                        onClick={() => removeFilter(filter.key)}
                        className="hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--ace-teal)' }}
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sort Controls */}
            <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
              <button 
                onClick={() => handleSort('title')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor: isDark ? 'rgba(0, 166, 161, 0.2)' : 'rgba(0, 166, 161, 0.1)',
                  color: 'var(--ace-teal)',
                  borderColor: 'rgba(0, 166, 161, 0.3)',
                  fontFamily: "'Inter', sans-serif"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? 'rgba(0, 166, 161, 0.3)' : 'rgba(0, 166, 161, 0.15)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = isDark ? 'rgba(0, 166, 161, 0.2)' : 'rgba(0, 166, 161, 0.1)'}
              >
                <span>Title</span>
                <span className="material-symbols-outlined text-base">{getSortIcon('title')}</span>
              </button>
              <button 
                onClick={() => handleSort('authors')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor: isDark ? 'rgba(0, 166, 161, 0.2)' : 'rgba(0, 166, 161, 0.1)',
                  color: 'var(--ace-teal)',
                  borderColor: 'rgba(0, 166, 161, 0.3)',
                  fontFamily: "'Inter', sans-serif"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? 'rgba(0, 166, 161, 0.3)' : 'rgba(0, 166, 161, 0.15)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = isDark ? 'rgba(0, 166, 161, 0.2)' : 'rgba(0, 166, 161, 0.1)'}
              >
                <span>Authors</span>
                <span className="material-symbols-outlined text-base">{getSortIcon('authors')}</span>
              </button>
              <button 
                onClick={() => handleSort('year')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor: isDark ? 'rgba(0, 166, 161, 0.2)' : 'rgba(0, 166, 161, 0.1)',
                  color: 'var(--ace-teal)',
                  borderColor: 'rgba(0, 166, 161, 0.3)',
                  fontFamily: "'Inter', sans-serif"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? 'rgba(0, 166, 161, 0.3)' : 'rgba(0, 166, 161, 0.15)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = isDark ? 'rgba(0, 166, 161, 0.2)' : 'rgba(0, 166, 161, 0.1)'}
              >
                <span>Year</span>
                <span className="material-symbols-outlined text-base">{getSortIcon('year')}</span>
              </button>
              <button 
                onClick={() => handleSort('date')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor: isDark ? 'rgba(0, 166, 161, 0.2)' : 'rgba(0, 166, 161, 0.1)',
                  color: 'var(--ace-teal)',
                  borderColor: 'rgba(0, 166, 161, 0.3)',
                  fontFamily: "'Inter', sans-serif"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? 'rgba(0, 166, 161, 0.3)' : 'rgba(0, 166, 161, 0.15)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = isDark ? 'rgba(0, 166, 161, 0.2)' : 'rgba(0, 166, 161, 0.1)'}
              >
                <span>Date Added</span>
                <span className="material-symbols-outlined text-base">{getSortIcon('date')}</span>
              </button>
            </div>
          </div>

          {/* Papers Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-base text-left">
              <thead className="text-sm uppercase" style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(4, 28, 48, 0.03)' }}>
                <tr>
                  <th className="px-6 py-3 font-medium" scope="col" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Montserrat', sans-serif" }}>Title</th>
                  <th className="px-6 py-3 font-medium" scope="col" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Montserrat', sans-serif" }}>Authors</th>
                  <th className="px-6 py-3 font-medium" scope="col" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Montserrat', sans-serif" }}>Year</th>
                  <th className="px-6 py-3 font-medium" scope="col" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Montserrat', sans-serif" }}>Outcome</th>
                  <th className="px-6 py-3 font-medium" scope="col" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Montserrat', sans-serif" }}>Date Added</th>
                  <th className="px-6 py-3 font-medium text-right" scope="col" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Montserrat', sans-serif" }}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)' }}>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)' }}>
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="relative">
                          <div className="w-8 h-8 border-3 rounded-full animate-spin" style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 166, 161, 0.3)', borderTopColor: 'var(--ace-teal)' }}></div>
                          <div className="absolute inset-0 w-8 h-8 border-3 border-transparent rounded-full animate-spin" style={{ borderTopColor: 'rgba(0, 166, 161, 0.6)', animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                        </div>
                        <p className="text-base font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Loading approved papers...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredPapers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)' }}>
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(4, 28, 48, 0.05)' }}>
                          <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--ace-teal)' }}>article</span>
                        </div>
                        <p className="text-base font-medium" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>No approved papers found</p>
                        <p className="text-sm" style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>
                          {searchTerm ? 'Try adjusting your search terms' : 'No approved papers available at the moment'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPapers.map((paper) => (
                    <tr 
                      key={paper['Paper ID']} 
                      className="transition-colors"
                      style={{ borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td className="px-6 py-4 font-medium" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Montserrat', sans-serif" }}>
                        <div className="max-w-xs truncate">
                          {paper.Title || 'Untitled'}
                        </div>
                      </td>
                      <td className="px-6 py-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>
                        <div className="max-w-xs truncate">
                          {paper.Authors || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>
                        {paper['Publication Year'] || 'N/A'}
                      </td>
                      <td className="px-6 py-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>
                        <div className="max-w-xs truncate">
                          {paper['AI-Outcomes'] || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>
                        {formatDate(paper['Date Retrieved'])}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => handleViewDetails(paper)}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)' }}
                            title="View Details"
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = isDark ? 'rgba(0, 166, 161, 0.2)' : 'rgba(0, 166, 161, 0.1)';
                              e.target.style.color = 'var(--ace-teal)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                              e.target.style.color = isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)';
                            }}
                          >
                            <span className="material-symbols-outlined text-lg">open_in_new</span>
                          </button>
                          {paper['DOI / URL'] && (
                            <a
                              href={paper['DOI / URL']}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)' }}
                              title="View Original Paper"
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = isDark ? 'rgba(0, 166, 161, 0.2)' : 'rgba(0, 166, 161, 0.1)';
                                e.target.style.color = 'var(--ace-teal)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)';
                              }}
                            >
                              <span className="material-symbols-outlined text-lg">link</span>
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Bar */}
          {!isLoading && (
            <div className="p-4 border-t text-center text-sm" style={{ borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)', color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>
              Showing {filteredPapers.length} of {papers.length} approved papers
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ApprovedPapers;