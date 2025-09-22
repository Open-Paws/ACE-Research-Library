import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">About Knowva</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Knowva is a modern React application built with the latest technologies and best practices.
            </p>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Technologies Used</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>React 18 with modern hooks</li>
              <li>Vite for fast development and building</li>
              <li>React Router for client-side routing</li>
              <li>Tailwind CSS for utility-first styling</li>
              <li>Modern JavaScript (ES6+)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
