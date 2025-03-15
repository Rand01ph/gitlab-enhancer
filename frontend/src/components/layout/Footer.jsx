import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer footer-center p-6 bg-base-200 text-base-content">
      <div>
        <div className="grid grid-flow-col gap-4">
          <Link to="/" className="link link-hover">首页</Link>
          <Link to="/hooks" className="link link-hover">Hooks</Link>
          <Link to="/deployments" className="link link-hover">部署</Link>
          <Link to="/gitlab/config" className="link link-hover">GitLab 配置</Link>
        </div>
        <div>
          <p>Copyright © {currentYear} - GitLab Enhancer</p>
          <p className="text-xs mt-1">基于 MIT 许可证开源</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;