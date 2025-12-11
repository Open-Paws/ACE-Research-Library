import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
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
    <div className="min-h-screen flex items-center justify-center" style={{ 
      background: 'transparent',
      position: 'relative'
    }}>
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>

      <div className="glass-panel rounded-3xl p-12 w-full max-w-md animate-scale-in shadow-2xl">
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
            color: 'var(--ace-navy)',
            marginBottom: '8px'
          }}>
            Admin Login
          </h1>
          <p style={{
            color: 'var(--ace-navy-60)',
            fontSize: '1rem',
            fontFamily: "'Inter', sans-serif"
          }}>
            Access the admin dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200" style={{ color: '#dc2626' }}>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: 'var(--ace-navy)',
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
                borderColor: 'rgba(4, 28, 48, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                color: 'var(--ace-navy)',
                fontFamily: "'Inter', sans-serif"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--ace-teal)';
                e.target.style.boxShadow = '0 0 0 4px rgba(0, 166, 161, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(4, 28, 48, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Enter username"
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: 'var(--ace-navy)',
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
                borderColor: 'rgba(4, 28, 48, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                color: 'var(--ace-navy)',
                fontFamily: "'Inter', sans-serif"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--ace-teal)';
                e.target.style.boxShadow = '0 0 0 4px rgba(0, 166, 161, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(4, 28, 48, 0.2)';
                e.target.style.boxShadow = 'none';
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
        </form>

        <div className="mt-6 text-center">
          <p style={{
            color: 'var(--ace-navy-60)',
            fontSize: '0.75rem',
            fontFamily: "'Inter', sans-serif"
          }}>
            Default credentials: admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

