import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // 如果用户已登录，重定向到主页
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (username, password) => {
    const success = await login(username, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Git Hooks Manager</h1>
          <p className="text-lg mt-2">Sign in to your account</p>
        </div>
        
        <LoginForm 
          onLogin={handleLogin}
          loading={loading}
          error={error}
        />
        
        <div className="text-center mt-6">
          <p>
            Don't have an account? Contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;