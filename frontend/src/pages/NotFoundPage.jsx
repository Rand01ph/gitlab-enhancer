import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold mt-4 mb-6">页面未找到</h2>
        <p className="text-lg text-gray-600 mb-8">
          很抱歉，您请求的页面不存在或已被移除。
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/" className="btn btn-primary">
            返回首页
          </Link>
          <Link to="/hooks" className="btn btn-outline">
            查看 Hooks
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;