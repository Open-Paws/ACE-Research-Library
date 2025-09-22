import React, { useState, useEffect } from 'react';
import { apiService, KEYWORD_CONSTANTS } from '../config/api.js';

const Keywords = () => {
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
    <main className="flex-1 w-full px-4 sm:px-6 lg:px-14 py-8">
        <div className="mx-auto max-w-[1360px]">
          <div className="mb-8">
            <h1 className="text-4xl font-bold">Keywords</h1>
            <p className="text-white/70 mt-1 text-base">Manage your keywords to track relevant research papers.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-xl border border-white/10 min-h-24">
              <p className="text-base font-medium text-white/80">Total Keywords</p>
              <p className="text-3xl font-bold mt-2">{isLoading ? '...' : totalKeywords}</p>
            </div>
            <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-xl border border-white/10 min-h-24">
              <p className="text-base font-medium text-white/80">Active Keywords</p>
              <p className="text-3xl font-bold mt-2">{isLoading ? '...' : activeKeywords}</p>
            </div>
            <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-xl border border-white/10 min-h-24">
              <p className="text-base font-medium text-white/80">Inactive Keywords</p>
              <p className="text-3xl font-bold mt-2">{isLoading ? '...' : inactiveKeywords}</p>
            </div>
          </div>

          {/* Keyword Management Table */}
          <div className="bg-panel rounded-xl border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold">Keyword Management</h3>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-4 py-2 text-sm font-bold rounded-lg bg-primary text-black hover:opacity-90 transition-opacity"
                >
                  {showAddForm ? 'Cancel' : 'Add Keyword'}
                </button>
                <button 
                  onClick={loadKeywords}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-bold rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
            </div>
            
            {/* Add Keyword Form */}
            {showAddForm && (
              <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                <form onSubmit={handleAddKeyword} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-base font-medium mb-1 text-white/90" htmlFor="add-keyword">
                      Keyword
                    </label>
                    <input 
                      className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded-lg p-3 focus:ring-primary focus:border-primary text-white placeholder-white/70" 
                      id="add-keyword" 
                      placeholder="e.g., Quantum Computing" 
                      type="text"
                      value={formData.keyword}
                      onChange={(e) => setFormData(prev => ({ ...prev, keyword: e.target.value }))}
                      maxLength={KEYWORD_CONSTANTS.MAX_KEYWORD_LENGTH}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium mb-1 text-white/90" htmlFor="add-priority">
                      Priority
                    </label>
                    <select 
                      className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded-lg p-3 focus:ring-primary focus:border-primary text-white" 
                      id="add-priority"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    >
                      {KEYWORD_CONSTANTS.PRIORITIES.map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-base font-medium mb-1 text-white/90" htmlFor="add-status">
                      Status
                    </label>
                    <select 
                      className="w-full bg-white/5 dark:bg-black/20 border border-white/10 rounded-lg p-3 focus:ring-primary focus:border-primary text-white" 
                      id="add-status"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    >
                      {KEYWORD_CONSTANTS.STATUSES.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isAddingKeyword || !formData.keyword.trim()}
                    className="bg-primary text-black font-bold px-5 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingKeyword ? 'Adding...' : 'Add Keyword'}
                  </button>
                </form>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-base text-left">
                <thead className="bg-primary/10 dark:bg-primary/20 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-white/80" scope="col">Keyword</th>
                    <th className="px-6 py-3 text-white/80" scope="col">Priority</th>
                    <th className="px-6 py-3 text-white/80" scope="col">Last Search</th>
                    <th className="px-6 py-3 text-white/80" scope="col">Status</th>
                    <th className="px-6 py-3 text-right text-white/80" scope="col">Total Results</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-white/70">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="relative">
                            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-8 h-8 border-3 border-transparent border-t-primary/60 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                          </div>
                          <p className="text-base font-medium">Loading keywords...</p>
                        </div>
                      </td>
                    </tr>
                  ) : keywords.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-white/70">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <p className="text-base font-medium">No keywords found</p>
                          <p className="text-sm text-white/50">Add your first keyword to get started!</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    keywords.map((keyword) => (
                      <tr key={keyword.row_number} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-base">{keyword.Keyword}</td>
                        <td className="px-6 py-4">
                          {getPriorityBadge(keyword.Priority)}
                        </td>
                        <td className="px-6 py-4 text-white/70 text-base">
                          {formatDate(keyword['Last Search Date'])}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(keyword.Status)}
                        </td>
                        <td className="px-6 py-4 text-right text-base font-medium">
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