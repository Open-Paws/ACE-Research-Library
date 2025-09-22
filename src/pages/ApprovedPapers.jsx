import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../config/api.js';

const ApprovedPapers = () => {
  const navigate = useNavigate();
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
    <main className="flex-1 w-full px-4 sm:px-6 lg:px-14 py-8">
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white">Approved Papers</h1>
          <p className="text-gray-400 mt-1 text-base">Browse and manage approved research papers in the library.</p>
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

            {/* Sort Controls */}
            <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
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
                onClick={() => handleSort('date')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
              >
                <span>Date Added</span>
                <span className="material-symbols-outlined text-base">{getSortIcon('date')}</span>
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
                  <th className="px-6 py-3 font-medium" scope="col">Outcome</th>
                  <th className="px-6 py-3 font-medium" scope="col">Date Added</th>
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
                        <p className="text-base font-medium">Loading approved papers...</p>
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
                        <p className="text-base font-medium">No approved papers found</p>
                        <p className="text-sm text-white/50">
                          {searchTerm ? 'Try adjusting your search terms' : 'No approved papers available at the moment'}
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
                      <td className="px-6 py-4 text-gray-300">
                        <div className="max-w-xs truncate">
                          {paper['AI-Outcomes'] || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {formatDate(paper['Date Retrieved'])}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => handleViewDetails(paper)}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-700 hover:text-primary transition-colors"
                            title="View Details"
                          >
                            <span className="material-symbols-outlined text-lg">open_in_new</span>
                          </button>
                          {paper['DOI / URL'] && (
                            <a
                              href={paper['DOI / URL']}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-700 hover:text-primary transition-colors"
                              title="View Original Paper"
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
            <div className="p-4 border-t border-gray-800 text-center text-gray-400 text-sm">
              Showing {filteredPapers.length} of {papers.length} approved papers
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ApprovedPapers;