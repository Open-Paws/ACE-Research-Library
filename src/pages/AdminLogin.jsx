import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = login(username, password, 'admin');
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Invalid credentials');
    }
    
    setIsLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative" 
      style={{ 
        background: 'transparent',
        padding: '24px',
        position: 'relative',
        zIndex: 0
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
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-10" style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(165, 175, 27, 0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(165, 175, 27, 0.1) 0%, transparent 70%)',
          transform: 'translate(-30%, 30%)'
        }}></div>
      </div>

      <div 
        className={`glass-panel ${isDark ? 'glass-panel-dark' : ''} rounded-3xl p-8 md:p-12 w-full max-w-md animate-scale-in shadow-2xl relative z-10`}
        style={{
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)'
        }}
      >
        <div className="text-center mb-8">
          <img 
            src="https://animalcharityevaluators.org/wp-content/uploads/2023/11/ACE_Logo_Crest_FullColorDark.png"
            alt="ACE Logo"
            className="mx-auto mb-6"
            style={{ height: '60px', width: 'auto' }}
          />
          <h1 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
            marginBottom: '8px'
          }}>
            Admin Login
          </h1>
          <p style={{
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)',
            fontSize: '1rem',
            fontFamily: "'Inter', sans-serif"
          }}>
            Access the admin dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div 
              className="p-4 rounded-xl border animate-fade-in" 
              style={{ 
                backgroundColor: isDark ? 'rgba(220, 38, 38, 0.1)' : 'rgba(220, 38, 38, 0.05)',
                borderColor: isDark ? 'rgba(220, 38, 38, 0.3)' : 'rgba(220, 38, 38, 0.2)',
                color: isDark ? '#fca5a5' : '#dc2626'
              }}
            >
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'var(--ace-navy)',
              fontSize: '0.875rem',
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif"
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border transition-all duration-300"
              style={{
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.2)',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                fontFamily: "'Inter', sans-serif"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--ace-teal)';
                e.target.style.boxShadow = '0 0 0 4px rgba(0, 166, 161, 0.1)';
                e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.2)';
                e.target.style.boxShadow = 'none';
                e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)';
              }}
              placeholder="Enter username"
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'var(--ace-navy)',
              fontSize: '0.875rem',
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif"
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border transition-all duration-300"
              style={{
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.2)',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                fontFamily: "'Inter', sans-serif"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--ace-teal)';
                e.target.style.boxShadow = '0 0 0 4px rgba(0, 166, 161, 0.1)';
                e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.2)';
                e.target.style.boxShadow = 'none';
                e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)';
              }}
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--ace-teal)',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 4px 12px rgba(0, 166, 161, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.boxShadow = '0 6px 20px rgba(0, 166, 161, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = '0 4px 12px rgba(0, 166, 161, 0.3)';
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <div className="pt-4 border-t" style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.1)' }}>
            <p className="text-xs text-center" style={{ 
              color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'var(--ace-navy-60)',
              fontFamily: "'Inter', sans-serif"
            }}>
              Default credentials: <strong style={{ color: isDark ? 'var(--ace-teal)' : 'var(--ace-teal)' }}>admin</strong> / <strong style={{ color: isDark ? 'var(--ace-teal)' : 'var(--ace-teal)' }}>admin123</strong>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
