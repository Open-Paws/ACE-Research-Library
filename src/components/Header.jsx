import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/home', label: 'Home' },
    { path: '/', label: 'Dashboard' },
    { path: '/keywords', label: 'Keywords' },
    { path: '/research-feed', label: 'Research Feed' },
    { path: '/approved-papers', label: 'Library' },
    { path: '/user-management', label: 'Users' }
  ];

  return (
    <header 
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{ 
        backgroundColor: 'rgba(4, 28, 48, 0.95)',
        borderBottom: '1px solid rgba(0, 166, 161, 0.2)',
        boxShadow: '0 2px 10px rgba(4, 28, 48, 0.1)',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="flex items-center justify-between px-4 md:px-10 py-4">
        <Link to="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
          {/* ACE Logo - Using actual logo from ACE website */}
          <div className="flex items-center gap-3 animate-fade-in">
            <img 
              src="https://animalcharityevaluators.org/wp-content/uploads/2023/11/ACE_Logo_Crest_FullColorDark.png"
              alt="Animal Charity Evaluators Logo"
              style={{ 
                height: '32px', // Slightly smaller on mobile default
                width: 'auto',
                transition: 'transform 0.3s ease'
              }}
              className="md:h-[40px]"
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
            <h2 
              className="text-xs md:text-base font-bold tracking-wider text-white m-0 uppercase"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Animal Charity Evaluators
            </h2>
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="material-symbols-outlined text-3xl">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8">
            {menuItems.map((item, index) => (
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
                // value="" // Removed static value
                readOnly // Added purely for visual as per original code seeming static
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
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div 
          className="md:hidden absolute top-full left-0 w-full animate-fade-in"
          style={{
            backgroundColor: 'rgba(4, 28, 48, 0.98)',
            borderBottom: '1px solid rgba(0, 166, 161, 0.2)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="flex flex-col p-4 space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-white text-base font-medium py-2 px-4 rounded-lg transition-colors"
                style={{
                  backgroundColor: isActive(item.path) ? 'rgba(0, 166, 161, 0.1)' : 'transparent',
                  color: isActive(item.path) ? 'var(--ace-teal)' : 'white'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-4 mt-2">
               <div className="relative w-full mb-4">
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
                  readOnly
                />
              </div>
              <button
                className="w-full px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300"
                style={{
                  backgroundColor: 'var(--ace-teal)',
                  color: 'var(--ace-white)',
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: '0 4px 12px rgba(0, 166, 161, 0.3)'
                }}
              >
                Donate
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;