import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ace-navy-2)' }}>
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '2.5rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: 'var(--ace-navy)',
            marginBottom: '32px'
          }}>
            Contact Us
          </h1>
          <div className="rounded-lg shadow-md p-8" style={{ backgroundColor: 'var(--ace-white)', boxShadow: '0 4px 6px rgba(4, 28, 48, 0.1)' }}>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Your name"
                  style={{
                    borderColor: 'var(--ace-navy-10)',
                    backgroundColor: 'var(--ace-white)',
                    color: 'var(--ace-navy)',
                    fontFamily: "'Inter', sans-serif"
                  }}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="your.email@example.com"
                  style={{
                    borderColor: 'var(--ace-navy-10)',
                    backgroundColor: 'var(--ace-white)',
                    color: 'var(--ace-navy)',
                    fontFamily: "'Inter', sans-serif"
                  }}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Your message"
                  style={{
                    borderColor: 'var(--ace-navy-10)',
                    backgroundColor: 'var(--ace-white)',
                    color: 'var(--ace-navy)',
                    fontFamily: "'Inter', sans-serif"
                  }}
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--ace-teal)',
                  color: 'var(--ace-white)',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600
                }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
