import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService, PAPER_CONSTANTS } from '../config/api.js';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const PaperDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useAuth();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const [paper, setPaper] = useState(null);
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
        navigate('/papers');
      }
    } else {
      navigate('/papers');
    }
  }, [navigate, userRole]);

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

  const panelStyle = {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(12px)',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 2px 12px rgba(4, 28, 48, 0.05)',
  };

  const labelStyle = {
    color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'var(--ace-navy-60)',
    fontFamily: "'Inter', sans-serif"
  };

  const valueStyle = {
    color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
    fontFamily: "'Inter', sans-serif"
  };

  if (!paper) {
    return (
      <main className="flex-grow container mx-auto px-6 py-12" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-8 h-8 border-3 rounded-full animate-spin" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'var(--ace-navy-10)', borderTopColor: 'var(--ace-teal)' }}></div>
            </div>
            <p className="text-base font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>Loading paper details...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 md:px-6 py-8 md:py-12 relative" style={{ minHeight: '100vh' }}>
      {/* Mesh Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20" style={{
          background: isDark 
            ? 'radial-gradient(circle, rgba(0, 166, 161, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0, 166, 161, 0.15) 0%, transparent 70%)',
          transform: 'translate(20%, -20%)'
        }}></div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate(userRole === 'admin' ? '/admin/research-feed' : '/')}
            className="flex items-center gap-2 transition-colors mb-4 group"
            style={{ 
              color: 'var(--ace-teal)',
              fontFamily: "'Inter', sans-serif",
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
            {userRole === 'admin' ? 'Back to Research Feed' : 'Back to Papers'}
          </button>
        </div>

        {/* Header Section */}
        <div className="rounded-2xl p-6 md:p-8 mb-8" style={panelStyle}>
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight" style={{
                fontFamily: "'Montserrat', sans-serif",
                color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                letterSpacing: '-0.02em'
              }}>
                {paper.Title || 'Untitled Paper'}
              </h1>
              <div className="space-y-2 text-base md:text-lg">
                <p>
                  <span className="font-medium" style={labelStyle}>Authors: </span>
                  <span style={valueStyle}>{paper.Authors || 'Unknown'}</span>
                </p>
                <p>
                  <span className="font-medium" style={labelStyle}>Year: </span>
                  <span style={valueStyle}>{paper['Publication Year'] || 'N/A'}</span>
                </p>
                {paper['DOI / URL'] && (
                  <p>
                    <span className="font-medium" style={labelStyle}>Source: </span>
                    <a 
                      href={paper['DOI / URL']} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: 'var(--ace-teal)' }}
                    >
                      View Paper
                    </a>
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-row md:flex-col items-center md:items-end gap-4 w-full md:w-auto justify-between md:justify-start">
              {getStatusBadge(paper.Status)}
              {paper['AI Filtering Score'] && (
                <div className="text-right flex items-center gap-3 md:block">
                  <span style={{ ...labelStyle, fontSize: '0.875rem' }}>AI Score</span>
                  <div className="flex items-center gap-1 justify-end">
                    <span className="material-symbols-outlined" style={{ color: 'var(--ace-teal)', fontSize: '20px' }}>star</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--ace-teal)', fontFamily: "'Inter', sans-serif" }}>
                      {parseFloat(paper['AI Filtering Score']).toFixed(1)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Summary Section - Prominent */}
        {paper['AI-Generated Summary'] && (
          <div className="rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden" style={{
            ...panelStyle,
            borderLeft: '4px solid var(--ace-teal)'
          }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined" style={{ color: 'var(--ace-teal)' }}>auto_awesome</span>
              <h2 className="text-xl font-bold uppercase tracking-wide" style={{
                fontFamily: "'Montserrat', sans-serif",
                color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)'
              }}>
                AI-Generated Summary
              </h2>
            </div>
            <p className="text-lg leading-relaxed" style={{
              fontFamily: "'Inter', sans-serif",
              color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'var(--ace-navy)'
            }}>
              {paper['AI-Generated Summary']}
            </p>
          </div>
        )}

        {/* Abstract Section */}
        {paper.Abstract && (
          <div className="rounded-2xl p-6 md:p-8 mb-8" style={panelStyle}>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'var(--ace-navy-60)' }}>description</span>
              <h2 className="text-xl font-bold" style={{
                fontFamily: "'Montserrat', sans-serif",
                color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)'
              }}>
                Abstract
              </h2>
            </div>
            <p className="leading-relaxed whitespace-pre-line" style={{
              fontFamily: "'Inter', sans-serif",
              color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'var(--ace-navy-80)'
            }}>
              {paper.Abstract}
            </p>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Categorization */}
          {(paper['AI-Categorization'] || paper['Date Retrieved']) && (
            <div className="rounded-2xl p-6" style={panelStyle}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Montserrat', sans-serif" }}>
                <span className="material-symbols-outlined text-sm">category</span>
                Categorization
              </h3>
              <div className="space-y-4">
                {paper['AI-Categorization'] && (
                  <div>
                    <p className="text-sm font-medium mb-1" style={labelStyle}>Category</p>
                    <p style={valueStyle}>{paper['AI-Categorization']}</p>
                  </div>
                )}
                {paper['Source Keyword'] && (
                  <div>
                    <p className="text-sm font-medium mb-1" style={labelStyle}>Source Keyword</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-sm font-medium" style={{ 
                      backgroundColor: isDark ? 'rgba(0, 166, 161, 0.2)' : 'rgba(0, 166, 161, 0.1)',
                      color: 'var(--ace-teal)',
                      border: '1px solid rgba(0, 166, 161, 0.3)'
                    }}>
                      {paper['Source Keyword']}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Intervention */}
          {(paper['AI-Intervention'] || paper['AI-Outcomes']) && (
            <div className="rounded-2xl p-6" style={panelStyle}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Montserrat', sans-serif" }}>
                <span className="material-symbols-outlined text-sm">science</span>
                Intervention & Outcomes
              </h3>
              <div className="space-y-4">
                {paper['AI-Intervention'] && (
                  <div>
                    <p className="text-sm font-medium mb-1" style={labelStyle}>Intervention Type</p>
                    <p style={valueStyle}>{paper['AI-Intervention']}</p>
                  </div>
                )}
                {paper['AI-Outcomes'] && (
                  <div>
                    <p className="text-sm font-medium mb-1" style={labelStyle}>Expected Outcomes</p>
                    <p style={valueStyle}>{paper['AI-Outcomes']}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notes Section - Full Width */}
        {(paper['Reviewer Comments'] || paper['Notes (if Any)']) && (
          <div className="rounded-2xl p-6 mb-8" style={panelStyle}>
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Montserrat', sans-serif" }}>
                <span className="material-symbols-outlined text-sm">rate_review</span>
                Reviewer Notes
              </h3>
              <div className="space-y-4">
                {paper['Reviewer Comments'] && (
                  <div>
                    <p className="text-sm font-medium mb-1" style={labelStyle}>Comments</p>
                    <p style={valueStyle}>{paper['Reviewer Comments']}</p>
                  </div>
                )}
                {paper['Notes (if Any)'] && (
                   <div>
                    <p className="text-sm font-medium mb-1" style={labelStyle}>Additional Notes</p>
                    <p style={valueStyle}>{paper['Notes (if Any)']}</p>
                  </div>
                )}
              </div>
          </div>
        )}

        {/* Admin Actions */}
        {userRole === 'admin' && (
          <div className="rounded-2xl p-6" style={panelStyle}>
            <h3 className="text-lg font-bold mb-4" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Montserrat', sans-serif" }}>
              Admin Actions
            </h3>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => handleApprovalClick('Approved')}
                  className="flex items-center justify-center rounded-lg px-6 py-3 text-base font-bold transition-transform hover:scale-105"
                  style={{
                    backgroundColor: 'var(--ace-teal)',
                    color: 'var(--ace-white)',
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: '0 4px 12px rgba(0, 166, 161, 0.3)'
                  }}
              >
                Approve Paper
              </button>
              <button 
                onClick={() => handleApprovalClick('Rejected')}
                  className="flex items-center justify-center rounded-lg border px-6 py-3 text-base font-semibold transition-transform hover:scale-105"
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
        )}

        {/* Approval Dialog */}
        {showApprovalDialog && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}>
            <div className="rounded-xl border max-w-md w-full p-6 animate-scale-in" style={{ 
              backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'var(--ace-white)', 
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'var(--ace-navy-10)' 
            }}>
              <h3 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '1.25rem',
                fontWeight: 600,
                color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                marginBottom: '16px'
              }}>
                {approvalData.status} Paper
              </h3>
              <div className="mb-4">
                <p className="text-sm font-medium truncate" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>
                  {paper.Title}
                </p>
              </div>
              
              <form onSubmit={handleApprovalSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>
                    Status
                  </label>
                  <select
                    value={approvalData.status}
                    onChange={(e) => setApprovalData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full border rounded-lg p-3"
                    style={{
                      backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'var(--ace-white)',
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'var(--ace-navy-10)',
                      color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    {PAPER_CONSTANTS.STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>
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
                      backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'var(--ace-white)',
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'var(--ace-navy-10)',
                      color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
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
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
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