import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header 
      className="flex items-center justify-between whitespace-nowrap px-10 py-4 sticky top-0 z-50 backdrop-blur-md"
      style={{ 
        backgroundColor: 'rgba(4, 28, 48, 0.95)',
        borderBottom: '1px solid rgba(0, 166, 161, 0.2)',
        boxShadow: '0 2px 10px rgba(4, 28, 48, 0.1)',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
          {/* ACE Logo - Using actual logo from ACE website */}
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
                  color: isActive('/home') ? 'var(--ace-teal)' : 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  paddingBottom: '4px'
                }}
                to="/home"
                onMouseEnter={(e) => {
                  if (!isActive('/home')) {
                    e.target.style.color = 'var(--ace-teal)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/home')) {
                    e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                  }
                }}
              >
                {isActive('/home') && (
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
                Home
              </Link>
              {[
                { path: '/', label: 'Dashboard' },
                { path: '/keywords', label: 'Keywords' },
                { path: '/research-feed', label: 'Research Feed' },
                // { path: '/collections', label: 'Collections' },
                // { path: '/chat', label: 'Chat' },
                { path: '/approved-papers', label: 'Library' },
                { path: '/user-management', label: 'Users' }
              ].map((item, index) => (
                <Link 
                  key={item.path}
                  className="text-sm font-medium transition-all duration-300 relative"
                  style={{
                    color: isActive(item.path) ? 'var(--ace-teal)' : 'rgba(255, 255, 255, 0.9)',
                    textDecoration: 'none',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    paddingBottom: '4px',
                    animationDelay: `${index * 0.05}s`
                  }}
                  to={item.path}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.target.style.color = 'var(--ace-teal)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                    }
                  }}
                >
                  {isActive(item.path) && (
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
                  {item.label}
                </Link>
              ))}
            </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative w-64 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '20px' }}>search</span>
          <input 
            className="form-input w-full rounded-lg border pl-10 text-sm transition-all duration-300" 
            style={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'var(--ace-white)',
              padding: '10px 12px 10px 40px',
              fontFamily: "'Inter', sans-serif"
            }}
            placeholder="Search" 
            value=""
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--ace-teal)';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
          />
        </div>
        <button
          className="px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 animate-fade-in"
          style={{
            backgroundColor: 'var(--ace-teal)',
            color: 'var(--ace-white)',
            fontFamily: "'Inter', sans-serif",
            animationDelay: '0.3s',
            boxShadow: '0 4px 12px rgba(0, 166, 161, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 6px 16px rgba(0, 166, 161, 0.4)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0 4px 12px rgba(0, 166, 161, 0.3)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Donate
        </button>
      </div>
    </header>
  );
};

export default Header;