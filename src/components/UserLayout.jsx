import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Footer from './Footer';

const UserLayout = ({ children }) => {
  const location = useLocation();
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="flex flex-col min-h-screen" style={{ position: 'relative', zIndex: 1 }}>
      <header 
        className="flex items-center justify-between whitespace-nowrap px-10 py-4 sticky top-0 z-50 backdrop-blur-md"
        style={{ 
          backgroundColor: isDark ? 'rgba(4, 28, 48, 0.98)' : 'rgba(4, 28, 48, 0.95)',
          borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 166, 161, 0.2)',
          boxShadow: isDark ? '0 2px 10px rgba(0, 0, 0, 0.3)' : '0 2px 10px rgba(4, 28, 48, 0.1)',
          transition: 'all 0.3s ease'
        }}
      >
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
            <div className="flex items-center gap-3 animate-fade-in">
              <img 
                src="https://animalcharityevaluators.org/wp-content/uploads/2023/11/ACE_Logo_Crest_FullColorDark.png"
                alt="Animal Charity Evaluators Logo"
                style={{ 
                  height: '40px',
                  width: 'auto',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              />
              <h2 style={{ 
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '16px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: 'var(--ace-white)',
                margin: 0,
                textTransform: 'uppercase'
              }}>
                Animal Charity Evaluators
              </h2>
            </div>
          </Link>
          <nav className="flex items-center gap-8">
            <Link 
              className="text-sm font-medium transition-all duration-300 relative"
              style={{
                color: (location.pathname === '/' || location.pathname === '/papers') ? 'var(--ace-teal)' : 'rgba(255, 255, 255, 0.9)',
                textDecoration: 'none',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                paddingBottom: '4px'
              }}
              to="/"
            >
              {(location.pathname === '/' || location.pathname === '/papers') && (
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  backgroundColor: 'var(--ace-teal)',
                  animation: 'slideInRight 0.3s ease-out'
                }}></span>
              )}
              Research Papers
            </Link>
            <Link 
              className="text-sm font-medium transition-all duration-300 relative"
              style={{
                color: location.pathname === '/chat' ? 'var(--ace-teal)' : 'rgba(255, 255, 255, 0.9)',
                textDecoration: 'none',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                paddingBottom: '4px'
              }}
              to="/chat"
            >
              {location.pathname === '/chat' && (
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  backgroundColor: 'var(--ace-teal)',
                  animation: 'slideInRight 0.3s ease-out'
                }}></span>
              )}
              Chat
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'var(--ace-white)',
              cursor: 'pointer'
            }}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <button
            className="px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 animate-fade-in"
            style={{
              backgroundColor: 'var(--ace-teal)',
              color: 'var(--ace-white)',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 4px 12px rgba(0, 166, 161, 0.3)',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 6px 16px rgba(0, 166, 161, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = '0 4px 12px rgba(0, 166, 161, 0.3)';
            }}
          >
            Donate
          </button>
        </div>
      </header>
      <main className="flex-1" style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </main>
      {location.pathname !== '/chat' && <Footer />}
    </div>
  );
};

export default UserLayout;

