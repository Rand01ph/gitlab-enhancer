import React from 'react';
import { Link } from 'react-router-dom';

const AuditLogList = ({ logs, isLoading, error }) => {
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
  
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">暂无审计日志记录</p>
      </div>
    );
  }
  
  // Format action for display
  const formatAction = (action) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Get resource link
  const getResourceLink = (log) => {
    if (!log.resource_id) return null;
    
    switch (log.resource_type) {
      case 'hook':
        return `/hooks/${log.resource_id}`;
      case 'deployment':
        return `/deployments/${log.resource_id}`;
      case 'gitlab':
        return `/gitlab/config`;
      default:
        return null;
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>操作</th>
            <th>资源</th>
            <th>用户</th>
            <th>IP 地址</th>
            <th>时间</th>
            <th>详情</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => {
            const resourceLink = getResourceLink(log);
            
            return (
              <tr key={log.id}>
                <td>
                  <span className="font-medium">{formatAction(log.action)}</span>
                </td>
                <td>
                  {log.resource_type}
                  {log.resource_id && (
                    <>
                      {' '}
                      {resourceLink ? (
                        <Link to={resourceLink} className="link link-hover text-primary">
                          #{log.resource_id}
                        </Link>
                      ) : (
                        <span>#{log.resource_id}</span>
                      )}
                    </>
                  )}
                </td>
                <td>{log.user ? log.user.username : '系统'}</td>
                <td>{log.ip_address || '-'}</td>
                <td>{new Date(log.created_at).toLocaleString()}</td>
                <td>
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-xs btn-outline">
                      查看
                    </label>
                    <div tabIndex={0} className="dropdown-content z-[1] card card-compact shadow bg-base-100 w-96">
                      <div className="card-body">
                        <h3 className="card-title text-sm">操作详情</h3>
                        <div className="bg-base-200 p-2 rounded-box">
                          <pre className="text-xs overflow-auto max-h-60">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogList;