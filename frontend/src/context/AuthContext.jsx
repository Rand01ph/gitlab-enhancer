import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, getCurrentUser, logoutUser } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 检查用户是否已登录
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 不再检查localStorage中的token
        // 直接尝试获取当前用户信息
        // 如果cookie有效，这个请求会成功
          const userData = await getCurrentUser();
          setUser(userData);
      } catch (err) {
        console.error('Authentication check failed:', err);
        // 不需要删除token，因为我们使用cookies
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // 登录函数
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = await loginUser(username, password);
      // 不再需要存储token
      setUser(user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 登出函数
  const logout = async () => {
    try {
      await logoutUser();
      // 服务器会清除cookie
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};