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
            <div className="border rounded-lg p-6" style={{ backgroundColor: 'var(--ace-white)', borderColor: 'var(--ace-navy-10)', boxShadow: '0 1px 3px rgba(4, 28, 48, 0.1)' }}>
              <h4 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '1.25rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: 'var(--ace-navy)',
                marginBottom: '16px'
              }}>
                Abstract
              </h4>
              <p style={{ color: 'var(--ace-navy-60)', lineHeight: '1.75', fontFamily: "'Inter', sans-serif" }}>
                {paper.Abstract || 'No abstract available for this paper.'}
              </p>
            </div>
            {paper['Source Keyword'] && (
              <div className="border rounded-lg p-4" style={{ backgroundColor: 'var(--ace-white)', borderColor: 'var(--ace-navy-10)', boxShadow: '0 1px 3px rgba(4, 28, 48, 0.1)' }}>
                <h5 className="text-base font-medium mb-2" style={{ color: 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>Source Keyword</h5>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border" style={{ backgroundColor: 'var(--primary-10)', color: 'var(--ace-teal)', borderColor: 'var(--border-teal)', fontFamily: "'Inter', sans-serif" }}>
                  {paper['Source Keyword']}
                </span>
              </div>
            )}
          </div>
        );
      case 'ai-summary':
        return (
          <div className="border rounded-lg p-6" style={{ backgroundColor: 'var(--ace-white)', borderColor: 'var(--ace-navy-10)', boxShadow: '0 1px 3px rgba(4, 28, 48, 0.1)' }}>
            <h4 style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: '1.125rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--ace-navy)',
              marginBottom: '12px'
            }}>
              AI-Generated Summary
            </h4>
            <p style={{ color: 'var(--ace-navy-60)', lineHeight: '1.75', fontFamily: "'Inter', sans-serif" }}>
              {paper['AI-Generated Summary'] || 'No AI summary available for this paper.'}
            </p>
          </div>
        );
      case 'ai-categorization':
        return (
          <div className="space-y-4">
            <div className="border rounded-lg p-6" style={{ backgroundColor: 'var(--ace-white)', borderColor: 'var(--ace-navy-10)', boxShadow: '0 1px 3px rgba(4, 28, 48, 0.1)' }}>
              <h4 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '1.125rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: 'var(--ace-navy)',
                marginBottom: '16px'
              }}>
                AI Categorization
              </h4>
              <div className="space-y-3">
                {paper['AI-Categorization'] && (
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>Category:</span>
                    <p className="mt-1" style={{ color: 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>{paper['AI-Categorization']}</p>
                  </div>
                )}
                {paper['AI Filtering Score'] && (
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>AI Filtering Score:</span>
                    <p className="mt-1" style={{ color: 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>{paper['AI Filtering Score']}</p>
                  </div>
                )}
                {paper['Date Retrieved'] && (
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>Date Retrieved:</span>
                    <p className="mt-1" style={{ color: 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>{paper['Date Retrieved']}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'ai-intervention':
        return (
          <div className="space-y-4">
            <div className="border rounded-lg p-6" style={{ backgroundColor: 'var(--ace-white)', borderColor: 'var(--ace-navy-10)', boxShadow: '0 1px 3px rgba(4, 28, 48, 0.1)' }}>
              <h4 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '1.125rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: 'var(--ace-navy)',
                marginBottom: '16px'
              }}>
                AI Intervention Analysis
              </h4>
              <div className="space-y-4">
                {paper['AI-Intervention'] && (
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>Intervention Type:</span>
                    <p className="mt-1" style={{ color: 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>{paper['AI-Intervention']}</p>
                  </div>
                )}
                {paper['AI-Outcomes'] && (
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>Expected Outcomes:</span>
                    <p className="mt-1" style={{ color: 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>{paper['AI-Outcomes']}</p>
                  </div>
                )}
                {paper['Reviewer Comments'] && (
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>Reviewer Comments:</span>
                    <p className="mt-1" style={{ color: 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>{paper['Reviewer Comments']}</p>
                  </div>
                )}
                {paper['Notes (if Any)'] && (
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>Notes:</span>
                    <p className="mt-1" style={{ color: 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>{paper['Notes (if Any)']}</p>
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
    const styleMap = {
      Approved: { bg: 'rgba(0, 166, 161, 0.1)', text: 'var(--ace-teal)', border: 'rgba(0, 166, 161, 0.3)' },
      Rejected: { bg: 'rgba(132, 52, 104, 0.1)', text: 'var(--ace-berry)', border: 'rgba(132, 52, 104, 0.3)' },
      Pending: { bg: 'rgba(165, 175, 27, 0.1)', text: 'var(--ace-apple)', border: 'rgba(165, 175, 27, 0.3)' }
    };
    const style = styleMap[status] || styleMap.Pending;
    
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border" style={{ 
        backgroundColor: style.bg,
        color: style.text,
        borderColor: style.border,
        fontFamily: "'Inter', sans-serif"
      }}>
        {status}
      </span>
    );
  };

  if (!paper) {
    return (
      <main className="flex-grow container mx-auto px-6 py-12" style={{ backgroundColor: 'var(--ace-navy-2)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-8 h-8 border-3 rounded-full animate-spin" style={{ borderColor: 'var(--ace-navy-10)', borderTopColor: 'var(--ace-teal)' }}></div>
            </div>
            <p className="text-base font-medium" style={{ color: 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>Loading paper details...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-6 py-12" style={{ backgroundColor: 'var(--ace-navy-2)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/research-feed')}
            className="flex items-center gap-2 transition-colors mb-4"
            style={{ 
              color: 'var(--ace-teal)',
              fontFamily: "'Inter', sans-serif",
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Research Feed
          </button>
          
          <div className="border p-8 rounded-xl" style={{ backgroundColor: 'var(--ace-white)', borderColor: 'var(--ace-navy-10)', boxShadow: '0 1px 3px rgba(4, 28, 48, 0.1)' }}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '1.875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--ace-navy)',
                  marginBottom: '12px'
                }}>
                  {paper.Title || 'Untitled Paper'}
                </h1>
                <div className="space-y-2" style={{ color: 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>
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
                        style={{ 
                          color: 'var(--ace-teal)',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
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
                    <span style={{ color: 'var(--ace-navy-60)', fontSize: '0.875rem', fontFamily: "'Inter', sans-serif" }}>AI Score</span>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--ace-teal)', fontFamily: "'Inter', sans-serif" }}>{paper['AI Filtering Score']}</p>
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
          <div className="border-b" style={{ borderBottomColor: 'var(--ace-navy-10)' }}>
            <nav aria-label="Tabs" className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="whitespace-nowrap py-3 px-4 border-b-2 font-medium text-base transition-colors bg-transparent border-0 rounded-lg shadow-none focus:outline-none"
                  style={{
                    borderBottomColor: activeTab === tab.id ? 'var(--ace-teal)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--ace-teal)' : 'var(--ace-navy-60)',
                    fontFamily: "'Inter', sans-serif"
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.target.style.color = 'var(--ace-navy)';
                      e.target.style.borderBottomColor = 'var(--ace-navy-30)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.target.style.color = 'var(--ace-navy-60)';
                      e.target.style.borderBottomColor = 'transparent';
                    }
                  }}
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
        <div className="border rounded-xl p-6" style={{ backgroundColor: 'var(--ace-white)', borderColor: 'var(--ace-navy-10)', boxShadow: '0 1px 3px rgba(4, 28, 48, 0.1)' }}>
          <h3 style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: '1.25rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--ace-navy)',
            marginBottom: '16px'
          }}>
            Actions
          </h3>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => handleApprovalClick('Approved')}
              className="flex items-center justify-center rounded-lg px-6 py-3 text-base font-bold transition-colors"
              style={{
                backgroundColor: 'var(--ace-teal)',
                color: 'var(--ace-white)',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Approve Paper
            </button>
            <button 
              onClick={() => handleApprovalClick('Rejected')}
              className="flex items-center justify-center rounded-lg border px-6 py-3 text-base font-semibold transition-colors"
              style={{
                backgroundColor: 'rgba(132, 52, 104, 0.1)',
                borderColor: 'rgba(132, 52, 104, 0.3)',
                color: 'var(--ace-berry)',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Reject Paper
            </button>
          </div>
        </div>

        {/* Approval Dialog */}
        {showApprovalDialog && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(4, 28, 48, 0.5)' }}>
            <div className="rounded-xl border max-w-md w-full p-6" style={{ backgroundColor: 'var(--ace-white)', borderColor: 'var(--ace-navy-10)' }}>
              <h3 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '1.25rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: 'var(--ace-navy)',
                marginBottom: '16px'
              }}>
                {approvalData.status} Paper
              </h3>
              <div className="mb-4">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>
                  {paper.Title}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>
                  {paper.Authors}
                </p>
              </div>
              
              <form onSubmit={handleApprovalSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>
                    Status
                  </label>
                  <select
                    value={approvalData.status}
                    onChange={(e) => setApprovalData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full border rounded-lg p-3"
                    style={{
                      backgroundColor: 'var(--ace-white)',
                      borderColor: 'var(--ace-navy-10)',
                      color: 'var(--ace-navy)',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    {PAPER_CONSTANTS.STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>
                    Comments *
                  </label>
                  <textarea
                    value={approvalData.comments}
                    onChange={(e) => setApprovalData(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Enter your review comments..."
                    rows={3}
                    required
                    className="w-full border rounded-lg p-3 resize-none"
                    style={{
                      backgroundColor: 'var(--ace-white)',
                      borderColor: 'var(--ace-navy-10)',
                      color: 'var(--ace-navy)',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>
                    Notes (Optional)
                  </label>
                  <textarea
                    value={approvalData.notes}
                    onChange={(e) => setApprovalData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes..."
                    rows={2}
                    className="w-full border rounded-lg p-3 resize-none"
                    style={{
                      backgroundColor: 'var(--ace-white)',
                      borderColor: 'var(--ace-navy-10)',
                      color: 'var(--ace-navy)',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmittingApproval || !approvalData.comments.trim()}
                    className="flex-1 font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: 'var(--ace-teal)',
                      color: 'var(--ace-white)',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    {isSubmittingApproval ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApprovalDialog(false)}
                    className="flex-1 font-bold py-3 px-4 rounded-lg transition-colors"
                    style={{
                      backgroundColor: 'var(--ace-navy-60)',
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
        )}
      </div>
    </main>
  );
};

export default PaperDetails;