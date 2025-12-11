import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/AdminLogin';
import UserHome from './pages/user/UserHome';
import UserPapers from './pages/user/UserPapers';
import UserChat from './pages/user/UserChat';
import PaperDetails from './pages/PaperDetails';
import Dashboard from './pages/Dashboard';
import Keywords from './pages/Keywords';
import ResearchFeed from './pages/ResearchFeed';
import ApprovedPapers from './pages/ApprovedPapers';
import UserManagement from './pages/UserManagement';

// Initialize user role on app load
const AppRoutes = () => {
  const { userRole, login } = useAuth();
  
  // Auto-login as user if not authenticated
  React.useEffect(() => {
    if (!userRole) {
      const auth = localStorage.getItem('ace_auth');
      if (!auth) {
        login('', '', 'user');
      }
    }
  }, [userRole, login]);

  return (
    <Routes>
      {/* User Routes */}
      <Route path="/" element={<UserLayout><UserHome /></UserLayout>} />
      <Route path="/papers" element={<UserLayout><UserHome /></UserLayout>} />
      <Route path="/chat" element={<UserLayout><UserChat /></UserLayout>} />
      <Route path="/paper-details" element={<UserLayout><PaperDetails /></UserLayout>} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Routes - Protected */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout><Dashboard /></AdminLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/keywords" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout><Keywords /></AdminLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/research-feed" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout><ResearchFeed /></AdminLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/library" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout><ApprovedPapers /></AdminLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout><UserManagement /></AdminLayout>
          </ProtectedRoute>
        } 
      />

      {/* Redirect old routes */}
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/keywords" element={<Navigate to="/admin/keywords" replace />} />
      <Route path="/research-feed" element={<Navigate to="/admin/research-feed" replace />} />
      <Route path="/approved-papers" element={<Navigate to="/admin/library" replace />} />
      <Route path="/user-management" element={<Navigate to="/admin/users" replace />} />
      <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen" style={{ position: 'relative', zIndex: 1 }}>
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
