import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService, PAPER_CONSTANTS } from '../config/api.js';

const ResearchFeed = () => {
  const navigate = useNavigate();
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
    const styles = {
      Approved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
      Pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.Pending}`}>
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
    <main className="flex-1 w-full px-4 sm:px-6 lg:px-14 py-8">
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white">Research Papers</h1>
          <p className="text-gray-400 mt-1 text-base">Review and approve research papers before they are added to the library.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Papers Table Container */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800">
          {/* Search and Filter Bar */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-4">
              <div className="relative w-full sm:w-80">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
                <input 
                  className="form-input w-full rounded-lg border-gray-700 bg-background-dark focus:ring-primary focus:border-primary pl-10 text-sm" 
                  placeholder="Search papers, authors, keywords..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                {getActiveFiltersCount() > 0 && (
                  <span className="text-white/70 text-sm">
                    {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} applied
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
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
                  <span className="text-white/60 text-sm font-medium">Active filters:</span>
                  {getActiveFilters().map((filter) => (
                    <span
                      key={filter.key}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30"
                    >
                      <span>{filter.type}: {filter.value}</span>
                      <button
                        onClick={() => removeFilter(filter.key)}
                        className="hover:text-primary/80 transition-colors"
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
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-primary/20 text-primary border border-primary/30 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Status</option>
                {PAPER_CONSTANTS.STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button 
                onClick={() => handleSort('title')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
              >
                <span>Title</span>
                <span className="material-symbols-outlined text-base">{getSortIcon('title')}</span>
              </button>
              <button 
                onClick={() => handleSort('authors')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
              >
                <span>Authors</span>
                <span className="material-symbols-outlined text-base">{getSortIcon('authors')}</span>
              </button>
              <button 
                onClick={() => handleSort('year')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
              >
                <span>Year</span>
                <span className="material-symbols-outlined text-base">{getSortIcon('year')}</span>
              </button>
              <button 
                onClick={() => handleSort('score')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
              >
                <span>Score</span>
                <span className="material-symbols-outlined text-base">{getSortIcon('score')}</span>
              </button>
            </div>
          </div>

          {/* Papers Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-base text-left">
              <thead className="text-sm text-gray-400 uppercase bg-gray-900">
                <tr>
                  <th className="px-6 py-3 font-medium" scope="col">Title</th>
                  <th className="px-6 py-3 font-medium" scope="col">Authors</th>
                  <th className="px-6 py-3 font-medium" scope="col">Year</th>
                  <th className="px-6 py-3 font-medium" scope="col">Status</th>
                  <th className="px-6 py-3 font-medium text-right" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-white/70">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="relative">
                          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                          <div className="absolute inset-0 w-8 h-8 border-3 border-transparent border-t-primary/60 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                        </div>
                        <p className="text-base font-medium">Loading papers...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredPapers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-white/70">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-2xl">article</span>
                        </div>
                        <p className="text-base font-medium">No papers found</p>
                        <p className="text-sm text-white/50">
                          {searchTerm ? 'Try adjusting your search terms' : 'No papers available at the moment'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPapers.map((paper) => (
                    <tr key={paper['Paper ID']} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">
                        <div className="max-w-xs truncate">
                          {paper.Title || 'Untitled'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        <div className="max-w-xs truncate">
                          {paper.Authors || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {paper['Publication Year'] || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(paper.Status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => handleApprovalClick(paper, 'Approved')}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-700 hover:text-primary transition-colors"
                            title="Approve Paper"
                          >
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                          </button>
                          <button 
                            onClick={() => handleApprovalClick(paper, 'Rejected')}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-700 hover:text-red-500 transition-colors"
                            title="Reject Paper"
                          >
                            <span className="material-symbols-outlined text-lg">cancel</span>
                          </button>
                          <button 
                            onClick={() => handleViewDetails(paper)}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-700 hover:text-primary transition-colors"
                            title="View Details"
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
            <div className="p-4 border-t border-gray-800 text-center text-gray-400 text-sm">
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowApprovalDialog(false)}
          ></div>
          
          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-gray-900 rounded-xl border border-gray-700 shadow-2xl max-w-lg w-full p-6 transform transition-all">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    {approvalData.status === 'Approved' ? 'check_circle' : 'cancel'}
                  </span>
                  {approvalData.status} Paper
                </h3>
                <button
                  onClick={() => setShowApprovalDialog(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Paper Info */}
              <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-white font-medium text-base line-clamp-2 mb-2">
                  {selectedPaper.Title}
                </p>
                <p className="text-gray-400 text-sm mb-3">
                  {selectedPaper.Authors}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Year: {selectedPaper['Publication Year']}</span>
                  {selectedPaper['AI Filtering Score'] && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Score:</span>
                      {getScoreBadge(selectedPaper['AI Filtering Score'])}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Form */}
              <form onSubmit={handleApprovalSubmit} className="space-y-5">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Decision *
                  </label>
                  <select
                    value={approvalData.status}
                    onChange={(e) => setApprovalData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  >
                    {PAPER_CONSTANTS.STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Review Comments *
                  </label>
                  <textarea
                    value={approvalData.comments}
                    onChange={(e) => setApprovalData(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Enter your detailed review comments..."
                    rows={4}
                    required
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:border-primary resize-none transition-colors"
                  />
                  <p className="text-gray-500 text-xs mt-1">Required field</p>
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={approvalData.notes}
                    onChange={(e) => setApprovalData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Optional additional notes or context..."
                    rows={2}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:border-primary resize-none transition-colors"
                  />
                </div>
                
                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-700">
                  <button
                    type="submit"
                    disabled={isSubmittingApproval || !approvalData.comments.trim()}
                    className="flex-1 bg-primary text-black font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmittingApproval ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
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
                    className="px-6 bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
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