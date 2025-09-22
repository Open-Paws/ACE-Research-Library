import React, { useState, useEffect, useRef } from 'react';
import Footer from '../components/Footer.jsx';
import { apiService } from '../config/api.js';

// Citation component
const Citation = ({ number, url, onClick }) => (
  <span
    className="citation"
    onClick={() => onClick(url)}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: 'var(--primary)',
      color: 'var(--background-dark)',
      fontSize: '11px',
      fontWeight: '600',
      cursor: 'pointer',
      margin: '0 2px',
      textDecoration: 'none',
      transition: 'all 0.2s ease'
    }}
  >
    {number}
  </span>
);

// Follow-up prompt component
const FollowUpPrompt = ({ prompt, onSelect }) => (
  <button
    className="followup-prompt"
    onClick={() => onSelect(prompt)}
    style={{
      background: 'var(--surface-dark)',
      border: '1px solid var(--border-primary)',
      borderRadius: '8px',
      padding: '8px 12px',
      color: 'var(--text-secondary)',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      margin: '4px',
      textAlign: 'left'
    }}
    onMouseEnter={(e) => {
      e.target.style.background = 'var(--primary-10)';
      e.target.style.color = 'var(--text-primary)';
    }}
    onMouseLeave={(e) => {
      e.target.style.background = 'var(--surface-dark)';
      e.target.style.color = 'var(--text-secondary)';
    }}
  >
    {prompt}
  </button>
);

// Message bubble component
const MessageBubble = ({ message, isUser, onCitationClick, onFollowUpSelect }) => {
  if (isUser) {
    return (
      <div className="message-enter" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <div
          className="message-bubble"
          style={{
            background: 'var(--primary)',
            color: 'var(--background-dark)',
            padding: '12px 16px',
            borderRadius: '16px 16px 4px 16px',
            maxWidth: '70%',
            fontSize: '14px',
            lineHeight: '1.5'
          }}
        >
          {message}
        </div>
      </div>
    );
  }

  const answer = message.content?.answer || message;
  const citations = message.content?.citations || [];
  const followups = message.content?.followup || [];
  
  // Process citations in text
  const processAnswerText = (text) => {
    if (!text) return text;
    
    // Replace citation markers like [1] with clickable citation components
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const citationNumber = parseInt(match[1]);
        const citationUrl = citations[citationNumber - 1];
        return (
          <Citation
            key={index}
            number={citationNumber}
            url={citationUrl}
            onClick={onCitationClick}
          />
        );
      }
      return part;
    });
  };

  return (
    <div className="message-enter" style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
      <div
        className="message-bubble"
        style={{
          background: 'var(--surface-dark)',
          border: '1px solid var(--border-primary)',
          color: 'var(--text-primary)',
          padding: '12px 16px',
          borderRadius: '16px 16px 16px 4px',
          maxWidth: '85%',
          fontSize: '14px',
          lineHeight: '1.6'
        }}
      >
        <div style={{ marginBottom: followups.length > 0 ? '12px' : '0' }}>
          {processAnswerText(answer)}
        </div>
        
        {followups.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Follow-up questions:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {followups.map((prompt, index) => (
                <FollowUpPrompt
                  key={index}
                  prompt={prompt}
                  onSelect={onFollowUpSelect}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('knowva-chat-history');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('knowva-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
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
      
      // Process API response
      if (response && response.length > 0) {
        const aiResponse = response[0].message;
        const newAiMessage = {
          id: Date.now() + 1,
          text: aiResponse,
          isUser: false,
          timestamp: new Date().toISOString()
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

  const handleFollowUpSelect = (prompt) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('knowva-chat-history');
  };

  // Show initial welcome state if no messages
  if (messages.length === 0) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px',
          color: 'var(--text-primary)',
          background: 'var(--background-dark)',
        }}
      >
        <div style={{ width: '100%', maxWidth: 720, textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '48px',
              lineHeight: 1.1,
              margin: 0,
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            Knowva
          </h1>
          <p
            style={{
              marginTop: 12,
              marginBottom: 0,
              color: 'var(--text-secondary)',
              fontSize: '16px',
              lineHeight: 1.6,
            }}
          >
            AI-powered research and knowledge management for smarter insights and
            seamless collaboration.
          </p>

          <form
            onSubmit={handleSubmit}
            role="search"
            style={{
              marginTop: 28,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 6,
              borderRadius: 12,
              background: 'var(--surface-dark)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about research papers..."
              aria-label="Chat input"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px 14px',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: 16,
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              style={{
                background: isLoading || !inputValue.trim() ? 'var(--text-secondary)' : 'var(--primary)',
                color: 'var(--text-primary)',
                border: 'none',
                borderRadius: 8,
                padding: '10px 16px',
                fontWeight: 700,
                cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
                opacity: isLoading || !inputValue.trim() ? 0.6 : 1
              }}
            >
              {isLoading ? 'Thinking...' : 'Ask'}
            </button>
          </form>
        </div>
        
        {/* What Knowva Does */}
        <section
          aria-labelledby="what-knowva-does"
          style={{
            marginTop: 64,
            width: '100%',
            maxWidth: 1200,
            padding: '0 16px',
          }}
        >
          <h2
            id="what-knowva-does"
            style={{
              textAlign: 'center',
              color: '#ffffff',
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: '-0.01em',
              margin: 0,
              marginBottom: 18,
            }}
          >
            What Knowva Does
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 16,
            }}
          >
            {[
              {
                title: 'Research Engine',
                desc:
                  'Harness our AI-powered engine to find precise information and uncover connections across vast datasets.',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" stroke="var(--primary)" strokeWidth="2" />
                    <path d="m21 21-4.3-4.3" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                title: 'Smart Insights',
                desc:
                  'Automate analysis and generate summaries, key takeaways, and neat reports with our intelligent tools.',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3v4" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 17v4" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M4 12h4" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M16 12h4" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="3.5" stroke="var(--primary)" strokeWidth="2" />
                  </svg>
                ),
              },
              {
                title: 'Directories & Chat',
                desc:
                  'Organize knowledge, enable collaboration, and interact in real-time through integrated chat.',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M4 5h16v10H8l-4 4V5Z" stroke="var(--primary)" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                title: 'Responsible Impact',
                desc:
                  'Keep control with ethical AI, ensuring your data is secure and technology is used for positive change.',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3l7 4v5c0 5-7 9-7 9s-7-4-7-9V7l7-4Z" stroke="var(--primary)" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: 'var(--surface-dark)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 12,
                  padding: 16,
                  color: 'var(--text-primary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    aria-hidden
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: 'var(--primary-10)',
                    }}
                  >
                    {item.icon}
                  </span>
                  <strong style={{ fontSize: 14 }}>{item.title}</strong>
                </div>
                <p
                  style={{
                    marginTop: 10,
                    marginBottom: 0,
                    color: 'var(--text-secondary)',
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
        <div style={{ width: '100%', marginTop: 80 }}>
          <Footer />
        </div>
      </div>
    );
  }

  // Chat interface when messages exist
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--background-dark)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Chat Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-primary)',
          background: 'var(--surface-dark)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Knowva Chat</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
            AI-powered research assistant
          </p>
        </div>
        <button
          onClick={clearHistory}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-primary)',
            borderRadius: '6px',
            padding: '8px 12px',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Clear History
        </button>
      </div>

      {/* Messages Container */}
      <div
        className="chat-container"
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px',
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message.isUser ? message.text : message.text}
            isUser={message.isUser}
            onCitationClick={handleCitationClick}
            onFollowUpSelect={handleFollowUpSelect}
          />
        ))}
        
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
            <div
              style={{
                background: 'var(--surface-dark)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-secondary)',
                padding: '12px 16px',
                borderRadius: '16px 16px 16px 4px',
                fontSize: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }}
                />
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    animation: 'pulse 1.5s ease-in-out infinite 0.2s'
                  }}
                />
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    animation: 'pulse 1.5s ease-in-out infinite 0.4s'
                  }}
                />
                <span style={{ marginLeft: '8px' }}>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div
        style={{
          padding: '20px',
          borderTop: '1px solid var(--border-primary)',
          background: 'var(--surface-dark)'
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-end'
          }}
        >
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              ref={inputRef}
              className="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask me anything about research papers..."
              disabled={isLoading}
              rows={1}
              style={{
                width: '100%',
                minHeight: '44px',
                maxHeight: '120px',
                padding: '12px 16px',
                background: 'var(--background-dark)',
                border: '1px solid var(--border-primary)',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>
          <button
            type="submit"
            className="chat-button"
            disabled={isLoading || !inputValue.trim()}
            style={{
              background: isLoading || !inputValue.trim() ? 'var(--text-secondary)' : 'var(--primary)',
              color: isLoading || !inputValue.trim() ? 'var(--background-dark)' : 'var(--background-dark)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 20px',
              fontWeight: 600,
              cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
              opacity: isLoading || !inputValue.trim() ? 0.6 : 1,
              fontSize: '14px',
              minWidth: '80px'
            }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
