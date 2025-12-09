import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ace-navy-2)' }}>
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '2.5rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: 'var(--ace-navy)',
            marginBottom: '32px'
          }}>
            About Animal Charity Evaluators
          </h1>
          <div className="prose prose-lg max-w-none">
            <p style={{ color: 'var(--ace-navy-60)', marginBottom: '24px', fontFamily: "'Inter', sans-serif", fontSize: '1.125rem', lineHeight: '1.75' }}>
              Animal Charity Evaluators (ACE) seeks to find and promote the most effective ways to help animals, in pursuit of a world where no individual is denied moral consideration based on irrelevant identity traits such as species.
            </p>
            <h2 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--ace-navy)',
              marginBottom: '16px',
              marginTop: '32px'
            }}>
              Our Mission
            </h2>
            <p style={{ color: 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif", fontSize: '1rem', lineHeight: '1.75' }}>
              ACE evaluates and recommends animal charities, conducts research, and provides resources to help donors and advocates make informed decisions about how to help animals most effectively.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
