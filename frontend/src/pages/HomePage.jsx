import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchHooks } from '../services/hooks';
import { fetchDeployments } from '../services/deployments';

const HomePage = () => {
  const [recentHooks, setRecentHooks] = useState([]);
  const [recentDeployments, setRecentDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 获取最近的 Hooks
        const hooksData = await fetchHooks();
        setRecentHooks(hooksData.slice(0, 5)); // 只取前5个
        
        // 获取最近的部署
        const deploymentsData = await fetchDeployments();
        setRecentDeployments(deploymentsData.slice(0, 5)); // 只取前5个
        
        setError(null);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('加载数据失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="hero bg-base-200 rounded-box mb-8 p-8">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold">GitLab Enhancer</h1>
            <p className="py-6">
              GitLab Enhancer 是一个强大的工具，用于管理和部署 GitLab 服务器端钩子。
              通过简单的界面，您可以轻松地上传、更新和部署钩子到不同级别的 GitLab 实例。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/hooks/new" className="btn btn-primary">
                上传新 Hook
              </Link>
              <Link to="/hooks" className="btn btn-outline">
                管理 Hooks
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-error mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近的 Hooks */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">最近的 Hooks</h2>
              <Link to="/hooks" className="btn btn-sm btn-outline">
                查看全部
              </Link>
            </div>
            
            {recentHooks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>名称</th>
                      <th>类型</th>
                      <th>更新时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentHooks.map(hook => (
                      <tr key={hook.id}>
                        <td>
                          <Link to={`/hooks/${hook.id}`} className="link link-hover text-primary">
                            {hook.name}
                          </Link>
                        </td>
                        <td>{hook.hook_type}</td>
                        <td>{new Date(hook.updated_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">暂无 Hook</p>
                <Link to="/hooks/new" className="btn btn-sm btn-primary mt-2">
                  上传第一个 Hook
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* 最近的部署 */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">最近的部署</h2>
              <Link to="/deployments" className="btn btn-sm btn-outline">
                查看全部
              </Link>
            </div>
            
            {recentDeployments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Hook</th>
                      <th>目标</th>
                      <th>状态</th>
                      <th>时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDeployments.map(deployment => (
                      <tr key={deployment.id}>
                        <td>
                          <Link to={`/hooks/${deployment.hook.id}`} className="link link-hover text-primary">
                            {deployment.hook.name}
                          </Link>
                        </td>
                        <td>
                          {deployment.target_name || (deployment.deployment_level === 'server' ? '服务器' : '-')}
                        </td>
                        <td>
                          {deployment.status === 'pending' && (
                            <span className="badge badge-warning badge-sm">进行中</span>
                          )}
                          {deployment.status === 'success' && (
                            <span className="badge badge-success badge-sm">成功</span>
                          )}
                          {deployment.status === 'failed' && (
                            <span className="badge badge-error badge-sm">失败</span>
                          )}
                        </td>
                        <td>{new Date(deployment.deployed_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">暂无部署记录</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 快速操作卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">上传 Hook</h2>
            <p>上传新的 Git Hook 到系统，支持二进制文件和脚本。</p>
            <div className="card-actions justify-end mt-4">
              <Link to="/hooks/new" className="btn btn-primary">上传</Link>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">部署 Hook</h2>
            <p>将已有的 Hook 部署到服务器、项目或组级别。</p>
            <div className="card-actions justify-end mt-4">
              <Link to="/hooks" className="btn btn-primary">选择 Hook</Link>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">GitLab 配置</h2>
            <p>配置 GitLab 实例连接信息，包括 URL 和访问令牌。</p>
            <div className="card-actions justify-end mt-4">
              <Link to="/gitlab/config" className="btn btn-primary">配置</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;