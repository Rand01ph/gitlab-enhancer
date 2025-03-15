import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import HooksListPage from './pages/hooks/HooksListPage';
import HookDetailPage from './pages/hooks/HookDetailPage';
import HookCreatePage from './pages/hooks/HookCreatePage';
import HookEditPage from './pages/hooks/HookEditPage';
import HookDeployPage from './pages/hooks/HookDeployPage';
import DeploymentsListPage from './pages/deployments/DeploymentsListPage';
import DeploymentDetailPage from './pages/deployments/DeploymentDetailPage';
import GitLabConfigPage from './pages/gitlab/GitLabConfigPage';
import AuditLogsPage from './pages/audit/AuditLogsPage';
import NotFoundPage from './pages/NotFoundPage';

// 受保护的路由组件
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// 应用布局组件
const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout>
                <HomePage />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/hooks" element={
            <ProtectedRoute>
              <AppLayout>
                <HooksListPage />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/hooks/new" element={
            <ProtectedRoute>
              <AppLayout>
                <HookCreatePage />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/hooks/:id" element={
            <ProtectedRoute>
              <AppLayout>
                <HookDetailPage />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/hooks/:id/edit" element={
            <ProtectedRoute>
              <AppLayout>
                <HookEditPage />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/hooks/:id/deploy" element={
            <ProtectedRoute>
              <AppLayout>
                <HookDeployPage />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/deployments" element={
            <ProtectedRoute>
              <AppLayout>
                <DeploymentsListPage />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/deployments/:id" element={
            <ProtectedRoute>
              <AppLayout>
                <DeploymentDetailPage />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/gitlab/config" element={
            <ProtectedRoute>
              <AppLayout>
                <GitLabConfigPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/audit-logs" element={
            <ProtectedRoute>
              <AppLayout>
                <AuditLogsPage />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={
            <ProtectedRoute>
              <AppLayout>
                <NotFoundPage />
              </AppLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
