import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, userRole } = useAuth();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (userRole !== 'admin') {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ position: 'relative', zIndex: 1 }}>
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
          <Link to="/admin/dashboard" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
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
                ACE Admin
              </h2>
            </div>
          </Link>
          <nav className="flex items-center gap-6">
            {[
              { path: '/admin/dashboard', label: 'Dashboard' },
              { path: '/admin/keywords', label: 'Keywords' },
              { path: '/admin/research-feed', label: 'Research Feed' },
              { path: '/admin/library', label: 'Library' },
              { path: '/admin/users', label: 'Users' }
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
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'var(--ace-white)',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex-1 relative" style={{ position: 'relative', zIndex: 1, minHeight: 'calc(100vh - 80px)' }}>
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
          <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-10" style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(165, 175, 27, 0.2) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(165, 175, 27, 0.1) 0%, transparent 70%)',
            transform: 'translate(-30%, 30%)'
          }}></div>
        </div>
        <div className="relative z-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

