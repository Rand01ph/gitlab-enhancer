import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  // 检查当前路径是否匹配
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="container mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link to="/" className={isActive('/') ? 'active' : ''}>首页</Link></li>
              <li><Link to="/hooks" className={isActive('/hooks') ? 'active' : ''}>Hooks</Link></li>
              <li><Link to="/deployments" className={isActive('/deployments') ? 'active' : ''}>部署</Link></li>
              <li><Link to="/gitlab/config" className={isActive('/gitlab/config') ? 'active' : ''}>GitLab</Link></li>
              <li><Link to="/audit-logs" className={isActive('/audit-logs') ? 'active' : ''}>审计日志</Link></li>
          </ul>
        </div>
          <Link to="/" className="btn btn-ghost normal-case text-xl">GitLab Enhancer</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
            <li><Link to="/" className={isActive('/') ? 'active' : ''}>首页</Link></li>
            <li><Link to="/hooks" className={isActive('/hooks') ? 'active' : ''}>Hooks</Link></li>
            <li><Link to="/deployments" className={isActive('/deployments') ? 'active' : ''}>部署</Link></li>
            <li><Link to="/gitlab/config" className={isActive('/gitlab/config') ? 'active' : ''}>GitLab</Link></li>
            <li><Link to="/audit-logs" className={isActive('/audit-logs') ? 'active' : ''}>审计日志</Link></li>
        </ul>
      </div>
      <div className="navbar-end">
          {isAuthenticated ? (
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
                  <div className="flex items-center justify-center h-full bg-primary text-primary-content">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <a className="justify-between">
                    {user?.username || '用户'}
                    <span className="badge">管理员</span>
                  </a>
                </li>
                <li><a onClick={logout}>退出登录</a></li>
          </ul>
        </div>
          ) : (
            <Link to="/login" className="btn btn-primary">登录</Link>
          )}
      </div>
    </div>
    </div>
  );
};

export default Navbar;