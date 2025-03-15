import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchDeployment } from '../../services/deployments';

const DeploymentDetailPage = () => {
  const { id } = useParams();
  const [deployment, setDeployment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadDeployment = async () => {
      try {
        setLoading(true);
        const data = await fetchDeployment(id);
        setDeployment(data);
        setError(null);
      } catch (err) {
        console.error('Error loading deployment:', err);
        setError('Failed to load deployment details');
      } finally {
        setLoading(false);
      }
    };
    
    loadDeployment();
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }
  
  if (!deployment) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">部署详情</h1>
          <div className="flex space-x-2">
            <Link to="/deployments" className="btn btn-outline">
              返回列表
            </Link>
            <Link to={`/hooks/${deployment.hook.id}`} className="btn btn-outline">
              查看 Hook
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card bg-base-100 shadow-xl lg:col-span-2">
          <div className="card-body">
            <h2 className="card-title">基本信息</h2>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Hook 名称</p>
                <p>{deployment.hook.name}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">部署级别</p>
                <p>
                  {deployment.deployment_level === 'server' && '服务器级别'}
                  {deployment.deployment_level === 'project' && '项目级别'}
                  {deployment.deployment_level === 'group' && '组级别'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">目标</p>
                <p>{deployment.target_name || (deployment.deployment_level === 'server' ? '全局' : '-')}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Hook 版本</p>
                <p>{deployment.hook_version ? `v${deployment.hook_version.version}` : '最新版本'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">部署状态</p>
                <div>
                  {deployment.status === 'pending' && (
                    <span className="badge badge-warning">进行中</span>
                  )}
                  {deployment.status === 'success' && (
                    <span className="badge badge-success">成功</span>
                  )}
                  {deployment.status === 'failed' && (
                    <span className="badge badge-error">失败</span>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">部署时间</p>
                <p>{new Date(deployment.deployed_at).toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">部署人</p>
                <p>{deployment.deployed_by.username}</p>
              </div>
            </div>
            
            {deployment.status === 'failed' && deployment.error_message && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">错误信息</p>
                <div className="bg-error bg-opacity-10 text-error p-3 rounded-lg mt-1">
                  {deployment.error_message}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">操作</h2>
            
            <div className="space-y-3">
              <Link 
                to={`/hooks/${deployment.hook.id}/deploy`} 
                className="btn btn-primary w-full"
              >
                重新部署
              </Link>
              
              {deployment.status === 'failed' && (
                <button className="btn btn-outline w-full">
                  查看日志
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentDetailPage;