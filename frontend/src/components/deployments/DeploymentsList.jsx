import React from 'react';
import { Link } from 'react-router-dom';

const DeploymentsList = ({ deployments, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center my-4">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }
  
  if (!deployments || deployments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">暂无部署记录</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Hook</th>
            <th>部署级别</th>
            <th>目标</th>
            <th>版本</th>
            <th>状态</th>
            <th>部署时间</th>
            <th>部署人</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {deployments.map(deployment => (
            <tr key={deployment.id}>
              <td>
                <Link to={`/hooks/${deployment.hook.id}`} className="link link-hover text-primary">
                  {deployment.hook.name}
                </Link>
              </td>
              <td>
                {deployment.deployment_level === 'server' && '服务器'}
                {deployment.deployment_level === 'project' && '项目'}
                {deployment.deployment_level === 'group' && '组'}
              </td>
              <td>
                {deployment.target_name || (deployment.deployment_level === 'server' ? '全局' : '-')}
              </td>
              <td>
                {deployment.hook_version ? `v${deployment.hook_version.version}` : '-'}
              </td>
              <td>
                {deployment.status === 'pending' && (
                  <span className="badge badge-warning">进行中</span>
                )}
                {deployment.status === 'success' && (
                  <span className="badge badge-success">成功</span>
                )}
                {deployment.status === 'failed' && (
                  <span className="badge badge-error">失败</span>
                )}
              </td>
              <td>{new Date(deployment.deployed_at).toLocaleString()}</td>
              <td>{deployment.deployed_by.username}</td>
              <td>
                <Link to={`/deployments/${deployment.id}`} className="btn btn-xs btn-outline">
                  详情
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeploymentsList;