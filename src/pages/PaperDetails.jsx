import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, PAPER_CONSTANTS } from '../config/api.js';

const PaperDetails = () => {
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [activeTab, setActiveTab] = useState('abstract');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalData, setApprovalData] = useState({
    status: 'Approved',
    comments: '',
    notes: ''
  });
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get paper data from localStorage
    const storedPaper = localStorage.getItem('selectedPaper');
    if (storedPaper) {
      try {
        setPaper(JSON.parse(storedPaper));
      } catch (err) {
        console.error('Error parsing stored paper data:', err);
        navigate('/research-feed');
      }
    } else {
      navigate('/research-feed');
    }
  }, [navigate]);

  const tabs = [
    { id: 'abstract', label: 'Abstract' },
    { id: 'ai-summary', label: 'AI Summary' },
    { id: 'ai-categorization', label: 'AI Categorization' },
    { id: 'ai-intervention', label: 'AI Intervention' }
  ];

  const handleApprovalClick = (status) => {
    setApprovalData({
      status,
      comments: '',
      notes: ''
    });
    setShowApprovalDialog(true);
  };

  const handleApprovalSubmit = async (e) => {
    e.preventDefault();
    if (!paper || !approvalData.comments.trim()) return;

    try {
      setIsSubmittingApproval(true);
      setError(null);
      
      await apiService.approvePaper(
        paper['Paper ID'],
        approvalData.status,
        approvalData.comments.trim(),
        approvalData.notes.trim()
      );

      // Update paper status locally
      const updatedPaper = { ...paper, Status: approvalData.status };
      setPaper(updatedPaper);
      localStorage.setItem('selectedPaper', JSON.stringify(updatedPaper));

      setShowApprovalDialog(false);
      setApprovalData({ status: 'Approved', comments: '', notes: '' });
    } catch (err) {
      console.error('Error submitting approval:', err);
      setError('Failed to submit approval. Please try again.');
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  const renderTabContent = () => {
    if (!paper) return null;

    switch (activeTab) {
      case 'abstract':
        return (
          <div className="space-y-4">
            <div className="bg-panel border border-white/10 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-3">Abstract</h4>
              <p className="text-white/80 leading-relaxed">
                {paper.Abstract || 'No abstract available for this paper.'}
              </p>
            </div>
            {paper['Source Keyword'] && (
              <div className="bg-panel border border-white/10 rounded-lg p-4">
                <h5 className="text-base font-medium text-white/90 mb-2">Source Keyword</h5>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary border border-primary/30">
                  {paper['Source Keyword']}
                </span>
              </div>
            )}
          </div>
        );
      case 'ai-summary':
        return (
          <div className="bg-var(--surface-dark) border border-white/10 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-3">AI-Generated Summary</h4>
            <p className="text-white/80 leading-relaxed">
              {paper['AI-Generated Summary'] || 'No AI summary available for this paper.'}
            </p>
          </div>
        );
      case 'ai-categorization':
        return (
          <div className="space-y-4">
            <div className="bg-panel border border-white/10 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">AI Categorization</h4>
              <div className="space-y-3">
                {paper['AI-Categorization'] && (
                  <div>
                    <span className="text-white/70 text-sm font-medium">Category:</span>
                    <p className="text-white/90 mt-1">{paper['AI-Categorization']}</p>
                  </div>
                )}
                {paper['AI Filtering Score'] && (
                  <div>
                    <span className="text-white/70 text-sm font-medium">AI Filtering Score:</span>
                    <p className="text-white/90 mt-1">{paper['AI Filtering Score']}</p>
                  </div>
                )}
                {paper['Date Retrieved'] && (
                  <div>
                    <span className="text-white/70 text-sm font-medium">Date Retrieved:</span>
                    <p className="text-white/90 mt-1">{paper['Date Retrieved']}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'ai-intervention':
        return (
          <div className="space-y-4">
            <div className="bg-panel border border-white/10 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">AI Intervention Analysis</h4>
              <div className="space-y-4">
                {paper['AI-Intervention'] && (
                  <div>
                    <span className="text-white/70 text-sm font-medium">Intervention Type:</span>
                    <p className="text-white/90 mt-1">{paper['AI-Intervention']}</p>
                  </div>
                )}
                {paper['AI-Outcomes'] && (
                  <div>
                    <span className="text-white/70 text-sm font-medium">Expected Outcomes:</span>
                    <p className="text-white/90 mt-1">{paper['AI-Outcomes']}</p>
                  </div>
                )}
                {paper['Reviewer Comments'] && (
                  <div>
                    <span className="text-white/70 text-sm font-medium">Reviewer Comments:</span>
                    <p className="text-white/90 mt-1">{paper['Reviewer Comments']}</p>
                  </div>
                )}
                {paper['Notes (if Any)'] && (
                  <div>
                    <span className="text-white/70 text-sm font-medium">Notes:</span>
                    <p className="text-white/90 mt-1">{paper['Notes (if Any)']}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Approved: 'bg-green-500/20 text-green-400 border-green-500/30',
      Rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
      Pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles[status] || styles.Pending}`}>
        {status}
      </span>
    );
  };

  if (!paper) {
    return (
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-8 h-8 border-3 border-transparent border-t-primary/60 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
            </div>
            <p className="text-base font-medium text-white/70">Loading paper details...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/research-feed')}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Research Feed
          </button>
          
          <div className="bg-panel border border-white/10 p-8 rounded-xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white/90 mb-3">
                  {paper.Title || 'Untitled Paper'}
                </h1>
                <div className="space-y-2 text-white/70">
                  <p className="text-base">
                    <span className="font-medium">Authors:</span> {paper.Authors || 'Unknown'}
                  </p>
                  <p className="text-base">
                    <span className="font-medium">Year:</span> {paper['Publication Year'] || 'N/A'}
                  </p>
                  {paper['DOI / URL'] && (
                    <p className="text-base">
                      <span className="font-medium">Source:</span>{' '}
                      <a 
                        href={paper['DOI / URL']} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View Paper
                      </a>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                {getStatusBadge(paper.Status)}
                {paper['AI Filtering Score'] && (
                  <div className="text-right">
                    <span className="text-white/70 text-sm">AI Score</span>
                    <p className="text-2xl font-bold text-primary">{paper['AI Filtering Score']}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-white/10">
            <nav aria-label="Tabs" className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-base transition-colors bg-transparent border-0 rounded-lg shadow-none focus:outline-none ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-white/50 hover:text-white/75 hover:border-white/30'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="pt-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-panel border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white/90 mb-4">Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => handleApprovalClick('Approved')}
              className="flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-bold text-black hover:bg-primary/90 transition-colors"
            >
              Approve Paper
            </button>
            <button 
              onClick={() => handleApprovalClick('Rejected')}
              className="flex items-center justify-center rounded-lg bg-red-500/20 border border-red-500/30 px-6 py-3 text-base font-semibold text-red-400 hover:bg-red-500/30 transition-colors"
            >
              Reject Paper
            </button>
          </div>
        </div>

        {/* Approval Dialog */}
        {showApprovalDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                {approvalData.status} Paper
              </h3>
              <div className="mb-4">
                <p className="text-white/70 text-sm font-medium truncate">
                  {paper.Title}
                </p>
                <p className="text-white/50 text-xs mt-1">
                  {paper.Authors}
                </p>
              </div>
              
              <form onSubmit={handleApprovalSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={approvalData.status}
                    onChange={(e) => setApprovalData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:ring-primary focus:border-primary"
                  >
                    {PAPER_CONSTANTS.STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Comments *
                  </label>
                  <textarea
                    value={approvalData.comments}
                    onChange={(e) => setApprovalData(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Enter your review comments..."
                    rows={3}
                    required
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:ring-primary focus:border-primary resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={approvalData.notes}
                    onChange={(e) => setApprovalData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes..."
                    rows={2}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:ring-primary focus:border-primary resize-none"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmittingApproval || !approvalData.comments.trim()}
                    className="flex-1 bg-primary text-black font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingApproval ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApprovalDialog(false)}
                    className="flex-1 bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default PaperDetails;