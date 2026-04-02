import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProfilePage } from './pages/ProfilePage';

const AppRoutes = () => {
  const { isLoggedIn, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Helper to get default dashboard path based on role
  const getDefaultPath = () => {
    if (user?.role === 'ADMIN') return '/admin';
    return '/student';
  };

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={!isLoggedIn ? <AuthPage /> : <Navigate to={getDefaultPath()} replace />} 
      />
      
      {/* Protected Student Route */}
      <Route 
        path="/student" 
        element={isLoggedIn && user?.role === 'STUDENT' ? <StudentDashboard /> : <Navigate to="/auth" replace />} 
      />

      {/* Protected Admin Route */}
      <Route 
        path="/admin" 
        element={isLoggedIn && user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/auth" replace />} 
      />

      {/* Protected Profile Route */}
      <Route 
        path="/profile" 
        element={isLoggedIn ? <ProfilePage /> : <Navigate to="/auth" replace />} 
      />

      <Route 
        path="/" 
        element={<Navigate to={isLoggedIn ? getDefaultPath() : "/auth"} replace />} 
      />
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" richColors />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
