import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../config/api.js';

const UserPapers = () => {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    loadPapers();
  }, []);

  useEffect(() => {
    let filtered = [...papers];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(paper => 
        paper.Title?.toLowerCase().includes(term) ||
        paper.Authors?.toLowerCase().includes(term) ||
        paper['AI-Generated Summary']?.toLowerCase().includes(term) ||
        paper['Source Keyword']?.toLowerCase().includes(term)
      );
    }

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
        default:
          return 0;
      }
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    setFilteredPapers(filtered);
  }, [papers, searchTerm, sortBy, sortOrder]);

  const loadPapers = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getApprovedPapers();
      setPapers(data || []);
    } catch (err) {
      console.error('Error loading papers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (paper) => {
    localStorage.setItem('selectedPaper', JSON.stringify(paper));
    navigate('/paper-details');
  };

  const handleViewAll = () => {
    // Already on papers page
  };

  return (
    <main className="flex-1 w-full px-4 sm:px-6 lg:px-14 py-12" style={{ minHeight: '100vh', background: 'transparent' }}>
      <div className="mx-auto max-w-[1400px]">
        {/* Hero Section */}
        <div className="mb-12 animate-fade-in-up text-center">
          <div className="relative inline-block">
            <h1 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '4rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--ace-navy)',
              marginBottom: '16px',
              lineHeight: '1.1'
            }}>
              Research Papers
            </h1>
            <div className="absolute -bottom-2 -right-4 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
          </div>
          <p style={{ 
            color: 'var(--ace-navy-60)',
            fontSize: '1.5rem',
            fontFamily: "'Inter', sans-serif",
            lineHeight: '1.6',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Explore our curated collection of approved research papers on animal welfare and advocacy.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="glass-panel rounded-2xl p-6 mb-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:flex-1 group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" style={{ fontSize: '24px' }}>search</span>
              <input 
                className="w-full rounded-xl border pl-12 py-3.5 text-base transition-all duration-300" 
                placeholder="Search papers, authors, keywords..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  borderColor: 'rgba(4, 28, 48, 0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'var(--ace-navy)',
                  fontFamily: "'Inter', sans-serif"
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = 'var(--ace-teal)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(0, 166, 161, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                  e.target.style.borderColor = 'rgba(4, 28, 48, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('title')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                  sortBy === 'title' ? 'bg-primary text-white' : 'bg-white/50 text-gray-700 hover:bg-white/80'
                }`}
              >
                Title
              </button>
              <button
                onClick={() => setSortBy('year')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                  sortBy === 'year' ? 'bg-primary text-white' : 'bg-white/50 text-gray-700 hover:bg-white/80'
                }`}
              >
                Year
              </button>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 rounded-xl font-medium text-sm bg-white/50 text-gray-700 hover:bg-white/80 transition-all duration-300"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* Papers Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 rounded-full animate-spin" style={{
                borderColor: 'var(--ace-navy-10)',
                borderTopColor: 'var(--ace-teal)'
              }}></div>
            </div>
          </div>
        ) : filteredPapers.length === 0 ? (
          <div className="text-center py-20">
            <p style={{ color: 'var(--ace-navy-60)', fontSize: '1.25rem', fontFamily: "'Inter', sans-serif" }}>
              No papers found. Try adjusting your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper, index) => (
              <div
                key={paper['Paper ID']}
                className="glass-panel rounded-2xl p-6 hover-lift cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => handleViewDetails(paper)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, rgba(0, 166, 161, 0.1), rgba(0, 166, 161, 0.2))'
                  }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--ace-teal)', fontSize: '24px' }}>article</span>
                  </div>
                  {paper['Publication Year'] && (
                    <span className="px-3 py-1 rounded-lg text-sm font-semibold" style={{
                      backgroundColor: 'rgba(0, 166, 161, 0.1)',
                      color: 'var(--ace-teal)',
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      {paper['Publication Year']}
                    </span>
                  )}
                </div>
                <h3 style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--ace-navy)',
                  marginBottom: '12px',
                  lineHeight: '1.3',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {paper.Title || 'Untitled'}
                </h3>
                <p style={{
                  color: 'var(--ace-navy-60)',
                  fontSize: '0.875rem',
                  fontFamily: "'Inter', sans-serif",
                  marginBottom: '12px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {paper.Authors || 'Unknown Authors'}
                </p>
                {paper['AI-Generated Summary'] && (
                  <p style={{
                    color: 'var(--ace-navy-60)',
                    fontSize: '0.875rem',
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: '1.6',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '16px'
                  }}>
                    {paper['AI-Generated Summary']}
                  </p>
                )}
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  <span>Read More</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default UserPapers;

