import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Keywords from './pages/Keywords';
import ResearchFeed from './pages/ResearchFeed';
import PaperDetails from './pages/PaperDetails';
import Collections from './pages/Collections';
import Chat from './pages/Chat';
import ApprovedPapers from './pages/ApprovedPapers';
import UserManagement from './pages/UserManagement';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/keywords" element={<Keywords />} />
          <Route path="/research-feed" element={<ResearchFeed />} />
          <Route path="/paper-details" element={<PaperDetails />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/approved-papers" element={<ApprovedPapers />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
