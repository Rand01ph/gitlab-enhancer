import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import Navbar from './components/layout/Navbar';

// Hook 页面
import HooksListPage from './pages/hooks/HooksListPage';
import HookDetailPage from './pages/hooks/HookDetailPage';
import HookCreatePage from './pages/hooks/HookCreatePage';
import HookEditPage from './pages/hooks/HookEditPage';
import HookDeployPage from './pages/hooks/HookDeployPage';

// GitLab 配置页面
import GitLabConfigPage from './pages/gitlab/GitLabConfigPage';
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <p>© 2025 - Git Hooks Manager</p>
        </div>
      </footer>
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
                <div className="container mx-auto px-4 py-6">
                  <h1 className="text-3xl font-bold">Dashboard</h1>
                  {/* Dashboard content */}
                </div>
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* Hook 路由 */}
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
          {/* GitLab 配置路由 */}
          <Route path="/gitlab" element={
            <ProtectedRoute>
              <AppLayout>
                <GitLabConfigPage />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
