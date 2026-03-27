import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, profile, loading, isAdmin } = useAuth();

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  return <>{children}</>;
}

function AppContent() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
      <Toaster position="top-right" theme="dark" />
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
