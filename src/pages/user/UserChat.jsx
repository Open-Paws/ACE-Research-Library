import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../config/api.js';
import { useTheme } from '../../context/ThemeContext';

const UserChat = () => {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Load chat history from localStorage
    const savedHistory = localStorage.getItem('ace-chat-history');
    if (savedHistory) {
      try {
        setMessages(JSON.parse(savedHistory));
      } catch (err) {
        console.error('Error loading chat history:', err);
      }
    }
  }, []);

  useEffect(() => {
    // Save chat history to localStorage
    if (messages.length > 0) {
      localStorage.setItem('ace-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setError(null);
    
    // Add user message
    const newUserMessage = {
      id: Date.now(),
      text: userMessage,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await apiService.sendChatMessage(userMessage);
      
      // Process API response - extract answer from nested structure
      if (response && response.length > 0) {
        const aiContent = response[0].message?.content;
        const answer = aiContent?.answer || 'I apologize, but I couldn\'t generate a response.';
        const confidence = aiContent?.confidence || 'unknown';
        const followup = aiContent?.followup || [];
        const citations = aiContent?.citations || [];
        const evidenceGaps = aiContent?.evidence_gaps || null;
        
        const newAiMessage = {
          id: Date.now() + 1,
          text: answer,
          isUser: false,
          timestamp: new Date().toISOString(),
          confidence,
          followup,
          citations,
          evidenceGaps
        };
        
        setMessages(prev => [...prev, newAiMessage]);
      } else {
        throw new Error('No response received from API');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Sorry, I encountered an error. Please try again.');
      
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpSelect = async (prompt) => {
    setInputValue('');
    
    // Add user message
    const newUserMessage = {
      id: Date.now(),
      text: prompt,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await apiService.sendChatMessage(prompt);
      
      // Process API response - extract answer from nested structure
      if (response && response.length > 0) {
        const aiContent = response[0].message?.content;
        const answer = aiContent?.answer || 'I apologize, but I couldn\'t generate a response.';
        const confidence = aiContent?.confidence || 'unknown';
        const followup = aiContent?.followup || [];
        const citations = aiContent?.citations || [];
        const evidenceGaps = aiContent?.evidence_gaps || null;
        
        const newAiMessage = {
          id: Date.now() + 1,
          text: answer,
          isUser: false,
          timestamp: new Date().toISOString(),
          confidence,
          followup,
          citations,
          evidenceGaps
        };
        
        setMessages(prev => [...prev, newAiMessage]);
      } else {
        throw new Error('No response received from API');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Sorry, I encountered an error. Please try again.');
      
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitationClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('ace-chat-history');
  };


  // Show initial welcome state if no messages
  if (messages.length === 0) {
    return (
      <div
        style={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 16px',
          position: 'relative',
          zIndex: 0,
          width: '100%',
          maxWidth: '100%'
        }}
      >
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

        <div style={{ width: '100%', maxWidth: 800, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="relative">
            <h1
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '2.5rem',
                lineHeight: 1.1,
                margin: 0,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '12px',
                textAlign: 'center',
                color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)'
              }}
            >
              ACE Chat
            </h1>
            <p
              style={{
                marginTop: 0,
                marginBottom: '48px',
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)',
                fontSize: '1rem',
                lineHeight: 1.5,
                fontFamily: "'Inter', sans-serif",
                maxWidth: '600px',
                margin: '0 auto 48px',
                textAlign: 'center',
                fontWeight: 400
              }}
            >
              AI-powered research assistant
            </p>
          </div>

          {/* Input field in welcome state */}
          <div className="mt-12" style={{ maxWidth: 700, margin: '48px auto 0', width: '100%' }}>
            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              gap: '12px',
              padding: '16px',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
              borderRadius: '12px',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(4, 28, 48, 0.1)'
            }}>
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about animal welfare research..."
                rows={1}
                className="flex-1 resize-none border px-4 py-3 text-base transition-all duration-300"
                style={{
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.1)',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--ace-white)',
                  color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                  fontFamily: "'Inter', sans-serif",
                  minHeight: '48px',
                  maxHeight: '120px',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--ace-teal)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 166, 161, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-5 py-3 font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--ace-teal)',
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: '0 2px 8px rgba(0, 166, 161, 0.3)',
                  border: 'none',
                  cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && inputValue.trim()) {
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 166, 161, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 166, 161, 0.3)';
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  send
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        position: 'relative',
        zIndex: 0,
        width: '100%',
        maxWidth: '100%'
      }}
    >
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

      {/* Chat Header */}
      <div style={{
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(4, 28, 48, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '1.75rem',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
              margin: 0,
              marginBottom: '4px'
            }}>
              ACE Chat
            </h1>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.875rem',
              color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'var(--ace-navy-60)',
              margin: 0
            }}>
              AI-powered research assistant
            </p>
          </div>
          <button
            onClick={clearHistory}
            className="px-4 py-2 font-medium text-sm transition-all duration-300"
            style={{
              backgroundColor: 'transparent',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(4, 28, 48, 0.2)',
              color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'var(--ace-navy-60)',
              fontFamily: "'Inter', sans-serif",
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            Clear History
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div
        className="flex-1 overflow-y-auto mb-6"
        style={{
          maxHeight: 'calc(100vh - 220px)',
          padding: '0 0 20px 0'
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.isUser ? 'flex-end' : 'flex-start',
              marginBottom: '20px',
                paddingRight: message.isUser ? '18px' : '0px',
                paddingLeft: message.isUser ? '0px' : '12px'
            }}
          >
            <div
              style={{
                backgroundColor: message.isUser 
                  ? 'var(--ace-teal)' 
                  : (isDark ? 'rgba(0, 166, 161, 0.15)' : 'rgba(0, 166, 161, 0.1)'),
                color: message.isUser 
                  ? 'var(--ace-white)' 
                  : (isDark ? 'var(--ace-white)' : 'var(--ace-navy)'),
                padding: '12px 16px',
                borderRadius: message.isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                maxWidth: '75%',
                fontSize: '14px',
                lineHeight: '1.6',
                fontFamily: "'Inter', sans-serif",
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
            >
              {message.isUser ? (
                <div>{message.text}</div>
              ) : (
                <div>
                  <div style={{ marginBottom: (message.citations && message.citations.length > 0) || (message.followup && message.followup.length > 0) ? '16px' : '0' }}>
                    {message.text}
                  </div>
                  
                  {/* Citations - Display separately */}
                  {message.citations && message.citations.length > 0 && (
                    <div style={{ 
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 166, 161, 0.2)'
                    }}>
                      <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '13px',
                        fontWeight: 600,
                        color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'var(--ace-navy-80)',
                        marginBottom: '12px',
                        margin: '0 0 12px 0'
                      }}>
                        References:
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {message.citations.map((citation, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleCitationClick(citation)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--ace-teal)',
                              color: 'var(--ace-white)',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              border: 'none',
                              transition: 'all 0.2s ease',
                              fontFamily: "'Inter', sans-serif"
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'scale(1.1)';
                              e.target.style.boxShadow = '0 2px 8px rgba(0, 166, 161, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                              e.target.style.boxShadow = 'none';
                            }}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Follow-up questions */}
                  {message.followup && message.followup.length > 0 && (
                    <div style={{ 
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 166, 161, 0.2)'
                    }}>
                      <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '13px',
                        fontWeight: 600,
                        color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'var(--ace-navy-80)',
                        marginBottom: '12px',
                        margin: '0 0 12px 0'
                      }}>
                        Follow-up questions:
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {message.followup.map((followup, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleFollowUpSelect(followup)}
                            style={{
                              backgroundColor: isDark ? 'rgba(0, 166, 161, 0.2)' : 'rgba(0, 166, 161, 0.1)',
                              color: 'var(--ace-teal)',
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 500,
                              fontSize: '13px',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              textAlign: 'left'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = isDark ? 'rgba(0, 166, 161, 0.3)' : 'rgba(0, 166, 161, 0.15)';
                              e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = isDark ? 'rgba(0, 166, 161, 0.2)' : 'rgba(0, 166, 161, 0.1)';
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            {followup}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
            <div style={{
              backgroundColor: isDark ? 'rgba(0, 166, 161, 0.15)' : 'rgba(0, 166, 161, 0.1)',
              color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
              padding: '12px 16px',
              borderRadius: '12px 12px 12px 4px',
              fontSize: '14px',
              fontFamily: "'Inter', sans-serif"
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ 
                  backgroundColor: 'var(--ace-teal)',
                  animationDelay: '0s'
                }}></div>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ 
                  backgroundColor: 'var(--ace-teal)',
                  animationDelay: '0.2s'
                }}></div>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ 
                  backgroundColor: 'var(--ace-teal)',
                  animationDelay: '0.4s'
                }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Always visible */}
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        gap: '12px',
        padding: '16px',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
        borderRadius: '12px',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(4, 28, 48, 0.1)',
        position: 'sticky',
        bottom: 0,
        zIndex: 10
      }}>
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me anything about animal welfare research..."
          rows={1}
          className="flex-1 resize-none border px-4 py-3 text-base transition-all duration-300"
          style={{
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.1)',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--ace-white)',
            color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
            fontFamily: "'Inter', sans-serif",
            minHeight: '48px',
            maxHeight: '120px',
            borderRadius: '8px',
            fontSize: '14px'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--ace-teal)';
            e.target.style.boxShadow = '0 0 0 3px rgba(0, 166, 161, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.1)';
            e.target.style.boxShadow = 'none';
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="px-5 py-3 font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--ace-teal)',
            fontFamily: "'Inter', sans-serif",
            boxShadow: '0 2px 8px rgba(0, 166, 161, 0.3)',
            border: 'none',
            cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
            borderRadius: '8px',
            fontSize: '14px'
          }}
          onMouseEnter={(e) => {
            if (!isLoading && inputValue.trim()) {
              e.target.style.boxShadow = '0 4px 12px rgba(0, 166, 161, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0 2px 8px rgba(0, 166, 161, 0.3)';
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            send
          </span>
        </button>
      </form>
    </div>
  );
};

export default UserChat;
