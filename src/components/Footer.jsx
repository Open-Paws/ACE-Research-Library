import React from 'react';

const Footer = () => {
  return (
    <footer
      className="animate-fade-in"
      style={{
        width: '100%',
        background: 'linear-gradient(180deg, var(--ace-navy) 0%, #021018 100%)',
        borderTop: '1px solid rgba(0, 166, 161, 0.2)',
        padding: '48px 16px 32px',
        color: 'var(--ace-white)',
        marginTop: '80px'
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <img 
              src="https://animalcharityevaluators.org/wp-content/uploads/2023/11/ACE_Logo_Crest_FullColorDark.png"
              alt="Animal Charity Evaluators Logo"
              style={{ 
                height: '32px',
                width: 'auto',
                filter: 'brightness(0) invert(1)'
              }}
            />
            <span style={{ 
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--ace-white)'
            }}>
              Animal Charity Evaluators
            </span>
          </div>
          <p style={{ 
            margin: 0, 
            fontSize: '15px',
            color: 'rgba(255, 255, 255, 0.8)',
            fontFamily: "'Inter', sans-serif",
            lineHeight: '1.6',
            textAlign: 'center',
            maxWidth: '600px'
          }}>
            Finding and promoting the most effective ways to help animals.
          </p>
        </div>
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '24px',
          textAlign: 'center'
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.6)',
            fontFamily: "'Inter', sans-serif"
          }}>
            &copy; 2024 Animal Charity Evaluators. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
