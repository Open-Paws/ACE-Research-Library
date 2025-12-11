import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService, PAPER_CONSTANTS } from '../config/api.js';
import { useTheme } from '../context/ThemeContext';

const ResearchFeed = () => {
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
  const [statusFilter, setStatusFilter] = useState('all');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [approvalData, setApprovalData] = useState({
    status: 'Approved',
    comments: '',
    notes: ''
  });
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);

  // Helper functions for filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortBy('title');
    setSortOrder('asc');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm.trim()) count++;
    if (statusFilter !== 'all') count++;
    return count;
  };

  const getActiveFilters = () => {
    const filters = [];
    if (searchTerm.trim()) {
      filters.push({ type: 'Search', value: searchTerm, key: 'search' });
    }
    if (statusFilter !== 'all') {
      filters.push({ type: 'Status', value: statusFilter, key: 'status' });
    }
    return filters;
  };

  const removeFilter = (filterKey) => {
    switch (filterKey) {
      case 'search':
        setSearchTerm('');
        break;
      case 'status':
        setStatusFilter('all');
        break;
      default:
        break;
    }
  };

  // Load papers on component mount
  useEffect(() => {
    loadPapers();
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
        paper['Source Keyword']?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(paper => paper.Status === statusFilter);
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
        case 'score':
          aVal = parseFloat(a['AI Filtering Score']) || 0;
          bVal = parseFloat(b['AI Filtering Score']) || 0;
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
  }, [papers, searchTerm, sortBy, sortOrder, statusFilter]);

  const loadPapers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getPapers();
      setPapers(data || []);
    } catch (err) {
      console.error('Error loading papers:', err);
      setError('Failed to load papers. Please try again.');
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

  const handleApprovalClick = (paper, status) => {
    setSelectedPaper(paper);
    setApprovalData({
      status,
      comments: '',
      notes: ''
    });
    setShowApprovalDialog(true);
  };

  const handleApprovalSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPaper || !approvalData.comments.trim()) return;

    try {
      setIsSubmittingApproval(true);
      await apiService.approvePaper(
        selectedPaper['Paper ID'],
        approvalData.status,
        approvalData.comments.trim(),
        approvalData.notes.trim()
      );

      // Update paper status locally
      setPapers(prevPapers => 
        prevPapers.map(paper => 
          paper['Paper ID'] === selectedPaper['Paper ID']
            ? { ...paper, Status: approvalData.status }
            : paper
        )
      );

      setShowApprovalDialog(false);
      setSelectedPaper(null);
      setApprovalData({ status: 'Approved', comments: '', notes: '' });
    } catch (err) {
      console.error('Error submitting approval:', err);
      setError('Failed to submit approval. Please try again.');
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  const handleViewDetails = (paper) => {
    // Store paper data in localStorage for PaperDetails component
    localStorage.setItem('selectedPaper', JSON.stringify(paper));
    navigate('/paper-details');
  };

  const getStatusBadge = (status) => {
    const styleMap = {
      Approved: { bg: 'rgba(0, 166, 161, 0.1)', text: 'var(--ace-teal)', border: 'rgba(0, 166, 161, 0.3)' },
      Rejected: { bg: 'rgba(132, 52, 104, 0.1)', text: 'var(--ace-berry)', border: 'rgba(132, 52, 104, 0.3)' },
      Pending: { bg: 'rgba(165, 175, 27, 0.1)', text: 'var(--ace-apple)', border: 'rgba(165, 175, 27, 0.3)' }
    };
    const style = styleMap[status] || styleMap.Pending;
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border" style={{ 
        backgroundColor: style.bg,
        color: style.text,
        borderColor: style.border,
        fontFamily: "'Inter', sans-serif"
      }}>
        {status}
      </span>
    );
  };

  const getScoreBadge = (score) => {
    const numScore = parseFloat(score) || 0;
    let className = 'bg-gray-100 text-gray-800';
    
    if (numScore >= 90) className = 'bg-green-100 text-green-800';
    else if (numScore >= 70) className = 'bg-yellow-100 text-yellow-800';
    else if (numScore >= 50) className = 'bg-red-100 text-red-800';
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
        {numScore > 0 ? numScore : 'N/A'}
      </span>
    );
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return 'unfold_more';
    return sortOrder === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  };

  return (
    <main className="flex-1 w-full px-4 sm:px-6 lg:px-14 py-8 relative" style={{ minHeight: '100vh', background: 'transparent', position: 'relative', zIndex: 0 }}>
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
              Research Papers
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
            Review and approve research papers before they are added to the library.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Papers Table Container */}
        <div className={`glass-panel ${isDark ? 'glass-panel-dark' : ''} rounded-2xl overflow-hidden animate-fade-in-up`} style={{ border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)' }}>
          {/* Search and Filter Bar */}
          <div className="p-6 border-b" style={{ borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)' }}>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
              <div className="relative w-full sm:w-96 group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(4, 28, 48, 0.4)' }}>search</span>
                <input 
                  className="w-full rounded-xl border pl-12 py-3 text-sm transition-all duration-300" 
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

            {/* Filter and Sort Controls */}
            <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border focus:ring-primary focus:border-primary transition-colors"
                style={{
                  backgroundColor: isDark ? 'rgba(0, 166, 161, 0.2)' : 'rgba(0, 166, 161, 0.1)',
                  color: 'var(--ace-teal)',
                  borderColor: 'rgba(0, 166, 161, 0.3)',
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                <option value="all" style={{ backgroundColor: isDark ? '#1e293b' : 'white', color: isDark ? 'white' : 'var(--ace-navy)' }}>All Status</option>
                {PAPER_CONSTANTS.STATUSES.map(status => (
                  <option key={status} value={status} style={{ backgroundColor: isDark ? '#1e293b' : 'white', color: isDark ? 'white' : 'var(--ace-navy)' }}>{status}</option>
                ))}
              </select>
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
                onClick={() => handleSort('score')}
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
                <span>Score</span>
                <span className="material-symbols-outlined text-base">{getSortIcon('score')}</span>
              </button>
            </div>
          </div>

          {/* Papers Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-base text-left">
              <thead className="text-sm uppercase" style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(4, 28, 48, 0.03)' }}>
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider" scope="col" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Montserrat', sans-serif" }}>Title</th>
                  <th className="px-6 py-4 font-bold tracking-wider" scope="col" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Montserrat', sans-serif" }}>Authors</th>
                  <th className="px-6 py-4 font-bold tracking-wider" scope="col" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Montserrat', sans-serif" }}>Year</th>
                  <th className="px-6 py-4 font-bold tracking-wider" scope="col" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Montserrat', sans-serif" }}>Status</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right" scope="col" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Montserrat', sans-serif" }}>Actions</th>
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
                        <p className="text-base font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Loading papers...</p>
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
                        <p className="text-base font-medium" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>No papers found</p>
                        <p className="text-sm" style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>
                          {searchTerm ? 'Try adjusting your search terms' : 'No papers available at the moment'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPapers.map((paper, index) => (
                    <tr 
                      key={paper['Paper ID']} 
                      className="transition-all duration-300 animate-fade-in-up group" 
                      style={{ 
                        animationDelay: `${index * 0.03}s`,
                        borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td className="px-6 py-5 font-semibold" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Montserrat', sans-serif", fontSize: '0.9375rem' }}>
                        <div className="max-w-xs truncate transition-colors" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)' }} onMouseEnter={(e) => e.target.style.color = 'var(--ace-teal)'} onMouseLeave={(e) => e.target.style.color = isDark ? 'var(--ace-white)' : 'var(--ace-navy)'}>
                          {paper.Title || 'Untitled'}
                        </div>
                      </td>
                      <td className="px-6 py-5" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem' }}>
                        <div className="max-w-xs truncate">
                          {paper.Authors || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-5" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem' }}>
                        {paper['Publication Year'] || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(paper.Status)}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => handleApprovalClick(paper, 'Approved')}
                            className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                            style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)' }}
                            title="Approve Paper"
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = isDark ? 'rgba(0, 166, 161, 0.2)' : 'rgba(0, 166, 161, 0.1)';
                              e.target.style.color = 'var(--ace-teal)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                              e.target.style.color = isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)';
                            }}
                          >
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                          </button>
                          <button 
                            onClick={() => handleApprovalClick(paper, 'Rejected')}
                            className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                            style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)' }}
                            title="Reject Paper"
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = 'rgba(132, 52, 104, 0.2)';
                              e.target.style.color = 'var(--ace-berry)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                              e.target.style.color = isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)';
                            }}
                          >
                            <span className="material-symbols-outlined text-lg">cancel</span>
                          </button>
                          <button 
                            onClick={() => handleViewDetails(paper)}
                            className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
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
            <div className="p-4 border-t text-center text-sm" style={{ borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)', color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>
              Showing {filteredPapers.length} of {papers.length} papers
            </div>
          )}
        </div>

      </div>

      {/* Approval Dialog Modal */}
      {showApprovalDialog && selectedPaper && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 backdrop-blur-sm transition-opacity"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={() => setShowApprovalDialog(false)}
          ></div>
          
          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4 animate-fade-in">
            <div className={`relative rounded-xl border shadow-2xl max-w-lg w-full p-8 transform transition-all animate-scale-in ${isDark ? 'glass-panel-dark' : ''}`} style={{ 
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: isDark ? '0 20px 60px rgba(0, 0, 0, 0.4)' : '0 20px 60px rgba(4, 28, 48, 0.2)'
            }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h3 style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--ace-teal)', fontSize: '28px' }}>
                    {approvalData.status === 'Approved' ? 'check_circle' : 'cancel'}
                  </span>
                  {approvalData.status} Paper
                </h3>
                <button
                  onClick={() => setShowApprovalDialog(false)}
                  className="transition-colors p-1"
                  style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(4, 28, 48, 0.6)' }}
                  onMouseEnter={(e) => e.target.style.color = isDark ? 'var(--ace-white)' : 'var(--ace-navy)'}
                  onMouseLeave={(e) => e.target.style.color = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(4, 28, 48, 0.6)'}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Paper Info */}
              <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--ace-navy-5)', borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)' }}>
                <p className="font-medium text-base line-clamp-2 mb-2" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>
                  {selectedPaper.Title}
                </p>
                <p className="text-sm mb-3" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>
                  {selectedPaper.Authors}
                </p>
                <div className="flex items-center justify-between text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)' }}>Year: {selectedPaper['Publication Year']}</span>
                  {selectedPaper['AI Filtering Score'] && (
                    <div className="flex items-center gap-2">
                      <span style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'var(--ace-navy-60)' }}>Score:</span>
                      {getScoreBadge(selectedPaper['AI Filtering Score'])}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Form */}
              <form onSubmit={handleApprovalSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>
                    Decision *
                  </label>
                  <select
                    value={approvalData.status}
                    onChange={(e) => setApprovalData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full border rounded-lg p-3 transition-colors"
                    style={{
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--ace-white)',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)',
                      color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    {PAPER_CONSTANTS.STATUSES.map(status => (
                      <option key={status} value={status} style={{ backgroundColor: isDark ? '#1e293b' : 'white', color: isDark ? 'white' : 'var(--ace-navy)' }}>{status}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>
                    Review Comments *
                  </label>
                  <textarea
                    value={approvalData.comments}
                    onChange={(e) => setApprovalData(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Enter your detailed review comments..."
                    rows={4}
                    required
                    className="w-full border rounded-lg p-3 resize-none transition-colors"
                    style={{
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--ace-white)',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)',
                      color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  />
                  <p className="text-xs mt-1" style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>Required field</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>
                    Additional Notes
                  </label>
                  <textarea
                    value={approvalData.notes}
                    onChange={(e) => setApprovalData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Optional additional notes or context..."
                    rows={2}
                    className="w-full border rounded-lg p-3 resize-none transition-colors"
                    style={{
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--ace-white)',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)',
                      color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  />
                </div>
                
                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t" style={{ borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)' }}>
                  <button
                    type="submit"
                    disabled={isSubmittingApproval || !approvalData.comments.trim()}
                    className="flex-1 font-semibold py-3.5 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105"
                    style={{
                      backgroundColor: 'var(--ace-teal)',
                      color: 'var(--ace-white)',
                      fontFamily: "'Inter', sans-serif",
                      boxShadow: '0 4px 12px rgba(0, 166, 161, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmittingApproval && approvalData.comments.trim()) {
                        e.target.style.boxShadow = '0 6px 20px rgba(0, 166, 161, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 166, 161, 0.3)';
                    }}
                  >
                    {isSubmittingApproval ? (
                      <>
                        <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)', borderTopColor: 'var(--ace-white)' }}></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">send</span>
                        Submit Review
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApprovalDialog(false)}
                    disabled={isSubmittingApproval}
                    className="px-6 font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                    style={{
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-60)',
                      color: 'var(--ace-white)',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ResearchFeed;