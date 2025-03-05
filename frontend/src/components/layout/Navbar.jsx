import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/hooks">Hooks</Link></li>
            <li><Link to="/deployments">Deployments</Link></li>
            <li><Link to="/gitlab">GitLab</Link></li>
            <li><Link to="/audit">Audit Logs</Link></li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl">Git Hooks Manager</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/hooks">Hooks</Link></li>
          <li><Link to="/deployments">Deployments</Link></li>
          <li><Link to="/gitlab">GitLab</Link></li>
          <li><Link to="/audit">Audit Logs</Link></li>
        </ul>
      </div>
      <div className="navbar-end">
        <ThemeToggle />
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <div className="flex items-center justify-center bg-primary text-primary-content h-full w-full">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li className="p-2 text-sm font-medium">
              Signed in as <strong>{user?.username}</strong>
            </li>
            <li><a>Profile</a></li>
            <li><a>Settings</a></li>
            <li><a onClick={handleLogout}>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;