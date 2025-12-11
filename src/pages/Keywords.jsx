import React, { useState, useEffect } from 'react';
import { apiService, KEYWORD_CONSTANTS } from '../config/api.js';
import { useTheme } from '../context/ThemeContext';

const Keywords = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingKeyword, setIsAddingKeyword] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    keyword: '',
    priority: 'Medium',
    status: 'Active'
  });

  // Load keywords on component mount
  useEffect(() => {
    loadKeywords();
  }, []);

  const loadKeywords = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getKeywords();
      setKeywords(data || []);
    } catch (err) {
      console.error('Error loading keywords:', err);
      setError('Failed to load keywords. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddKeyword = async (e) => {
    e.preventDefault();
    if (!formData.keyword.trim()) return;

    try {
      setIsAddingKeyword(true);
      setError(null);

      await apiService.addKeyword(
        formData.keyword.trim(),
        formData.priority,
        formData.status
      );

      // Reset form
      setFormData({
        keyword: '',
        priority: 'Medium',
        status: 'Active'
      });
      setShowAddForm(false);

      // Reload keywords to get updated list
      await loadKeywords();
    } catch (err) {
      console.error('Error adding keyword:', err);
      setError('Failed to add keyword. Please try again.');
    } finally {
      setIsAddingKeyword(false);
    }
  };


  const getPriorityBadge = (priority) => {
    const styles = {
      High: 'border-primary/30 text-primary bg-primary/10',
      Medium: 'border-yellow-400/30 text-yellow-300 bg-yellow-500/10',
      Low: 'border-red-400/30 text-red-300 bg-red-500/10'
    };

    const dotStyles = {
      High: 'bg-primary',
      Medium: 'bg-yellow-400',
      Low: 'bg-red-400'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[priority]} shadow-sm`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[priority]}`}></span>
        {priority}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const isActive = status === 'Active';
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${
        isActive 
          ? 'border-primary/30 text-primary bg-primary/10' 
          : 'border-white/20 text-white/70 bg-white/5'
      } shadow-sm`}>
        <span className={`w-1.5 h-1.5 rounded-full ${
          isActive ? 'bg-primary' : 'bg-white/40'
        }`}></span>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate summary stats
  const totalKeywords = keywords.length;
  const activeKeywords = keywords.filter(k => k.Status === 'Active').length;
  const inactiveKeywords = totalKeywords - activeKeywords;

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
              Keywords
            </h1>
            <p style={{
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)',
              marginTop: '8px',
              fontSize: '1.125rem',
              fontFamily: "'Inter', sans-serif",
              lineHeight: '1.6'
            }}>
              Manage your keywords to track relevant research papers.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {[
              { label: 'Total Keywords', value: totalKeywords },
              { label: 'Active Keywords', value: activeKeywords },
              { label: 'Inactive Keywords', value: inactiveKeywords }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`glass-panel ${isDark ? 'glass-panel-dark' : ''} p-6 rounded-xl border min-h-24 animate-scale-in transition-all duration-300 hover:shadow-xl`}
                style={{
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(4, 28, 48, 0.08)',
                  animationDelay: `${index * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--ace-teal)';
                  e.currentTarget.style.boxShadow = isDark ? '0 12px 32px rgba(0, 166, 161, 0.2)' : '0 8px 24px rgba(4, 28, 48, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.boxShadow = isDark ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(4, 28, 48, 0.08)';
                }}
              >
                <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif", marginBottom: '12px' }}>{stat.label}</p>
                <p style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--ace-teal)', fontFamily: "'Montserrat', sans-serif", lineHeight: '1' }}>{isLoading ? '...' : stat.value}</p>
            </div>
            ))}
          </div>

          {/* Keyword Management Table */}
          <div className={`glass-panel ${isDark ? 'glass-panel-dark' : ''} rounded-xl border overflow-hidden animate-fade-in-up`} style={{ border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)', boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(4, 28, 48, 0.08)' }}>
            <div className="px-6 py-5 pb-6 border-b flex justify-between items-center" style={{ borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)' }}>
              <h3 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                  paddingTop: '18px',      // ← bottom padding
                  paddingBottom: '18px',      // ← bottom padding
                  paddingRight: '4px'         // ← right padding
              }}>
                Keyword Management
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: 'var(--ace-teal)',
                    color: 'var(--ace-white)',
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: '0 4px 12px rgba(0, 166, 161, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = '0 6px 20px rgba(0, 166, 161, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 166, 161, 0.3)';
                  }}
                >
                  {showAddForm ? 'Cancel' : 'Add Keyword'}
                </button>
                <button
                  onClick={loadKeywords}
                  disabled={isLoading}
                  className="px-5 py-2.5 text-sm font-semibold rounded-lg border transition-all duration-300 disabled:opacity-50 hover:scale-105"
                  style={{
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--ace-navy-5)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)',
                    color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  {isLoading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
            </div>

            {/* Add Keyword Form */}
            {showAddForm && (
              <div className="px-6 py-4 border-b" style={{ borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)', backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'var(--ace-navy-5)' }}>
                <form onSubmit={handleAddKeyword} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-base font-medium mb-1" htmlFor="add-keyword" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>
                      Keyword
                    </label>
                    <input
                      className="w-full border rounded-lg p-3 focus:ring-primary focus:border-primary"
                      id="add-keyword"
                      placeholder="e.g., Quantum Computing"
                      type="text"
                      value={formData.keyword}
                      onChange={(e) => setFormData(prev => ({ ...prev, keyword: e.target.value }))}
                      maxLength={KEYWORD_CONSTANTS.MAX_KEYWORD_LENGTH}
                      required
                      style={{
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--ace-white)',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)',
                        color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                        fontFamily: "'Inter', sans-serif"
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium mb-1" htmlFor="add-priority" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>
                      Priority
                    </label>
                    <select
                      className="w-full border rounded-lg p-3 focus:ring-primary focus:border-primary"
                      id="add-priority"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                      style={{
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--ace-white)',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)',
                        color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                        fontFamily: "'Inter', sans-serif"
                      }}
                    >
                      {KEYWORD_CONSTANTS.PRIORITIES.map(priority => (
                        <option key={priority} value={priority} style={{ backgroundColor: isDark ? '#1e293b' : 'white', color: isDark ? 'white' : 'var(--ace-navy)' }}>{priority}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-base font-medium mb-1" htmlFor="add-status" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>
                      Status
                    </label>
                    <select
                      className="w-full border rounded-lg p-3 focus:ring-primary focus:border-primary"
                      id="add-status"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      style={{
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--ace-white)',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)',
                        color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                        fontFamily: "'Inter', sans-serif"
                      }}
                    >
                      {KEYWORD_CONSTANTS.STATUSES.map(status => (
                        <option key={status} value={status} style={{ backgroundColor: isDark ? '#1e293b' : 'white', color: isDark ? 'white' : 'var(--ace-navy)' }}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={isAddingKeyword || !formData.keyword.trim()}
                    className="font-bold px-5 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: 'var(--ace-teal)',
                      color: 'var(--ace-white)',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    {isAddingKeyword ? 'Adding...' : 'Add Keyword'}
                  </button>
                </form>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-base text-left">
                <thead className="text-sm uppercase tracking-wider" style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--ace-navy-5)' }}>
                  <tr>
                    <th className="px-6 py-3" scope="col" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Keyword</th>
                    <th className="px-6 py-3" scope="col" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Priority</th>
                    <th className="px-6 py-3" scope="col" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Last Search</th>
                    <th className="px-6 py-3" scope="col" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Status</th>
                    <th className="px-6 py-3 text-right" scope="col" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Total Results</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)' }}>
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)' }}>
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="relative">
                            <div className="w-8 h-8 border-3 rounded-full animate-spin" style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)', borderTopColor: 'var(--ace-teal)' }}></div>
                          </div>
                          <p className="text-base font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Loading keywords...</p>
                        </div>
                      </td>
                    </tr>
                  ) : keywords.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)' }}>
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--ace-navy-5)' }}>
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ace-teal)' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <p className="text-base font-medium" style={{ fontFamily: "'Inter', sans-serif", color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)' }}>No keywords found</p>
                          <p className="text-sm" style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>Add your first keyword to get started!</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    keywords.map((keyword) => (
                      <tr key={keyword.row_number} className="transition-colors" style={{ borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--ace-navy-5)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td className="px-6 py-4 font-medium text-base" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>{keyword.Keyword}</td>
                        <td className="px-6 py-4">
                          {getPriorityBadge(keyword.Priority)}
                        </td>
                        <td className="px-6 py-4 text-base" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>
                          {formatDate(keyword['Last Search Date'])}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(keyword.Status)}
                        </td>
                        <td className="px-6 py-4 text-right text-base font-medium" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>
                          {keyword['Total Results (via API)'] || 0}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
    </main>
  );
};

export default Keywords;