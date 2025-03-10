import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import Navbar from './components/layout/Navbar';
import GitLabConfigPage from './pages/gitlab/GitLabConfigPage';
// 导入其他页面...

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

          {/* GitLab 配置路由 */}
          <Route path="/gitlab" element={
            <ProtectedRoute>
              <AppLayout>
                <GitLabConfigPage />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* 添加其他受保护的路由 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
