import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        width: '100%',
        background: 'var(--background-dark)',
        borderTop: '1px solid var(--border-primary)',
        padding: '24px 16px',
        color: 'var(--text-secondary)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ margin: 0 }}>&copy; 2024 Knowva. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
