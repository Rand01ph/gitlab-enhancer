import React, { useState, useEffect } from 'react';
import { fetchActions, fetchResourceTypes, fetchUsers } from '../../services/audit';

const AuditLogFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    user_id: '',
    action: '',
    resource_type: '',
    resource_id: '',
    start_date: '',
    end_date: ''
  });
  
  const [actions, setActions] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setLoading(true);
        const [actionsData, resourceTypesData, usersData] = await Promise.all([
          fetchActions(),
          fetchResourceTypes(),
          fetchUsers()
        ]);
        
        setActions(actionsData);
        setResourceTypes(resourceTypesData);
        setUsers(usersData);
        setError(null);
      } catch (err) {
        console.error('Error loading filter options:', err);
        setError('加载筛选选项失败');
      } finally {
        setLoading(false);
      }
    };
    
    loadFilterOptions();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Remove empty filters
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    onFilter(activeFilters);
  };
  
  const handleReset = () => {
    setFilters({
      user_id: '',
      action: '',
      resource_type: '',
      resource_id: '',
      start_date: '',
      end_date: ''
    });
    onFilter({});
  };
  
  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title">筛选审计日志</h2>
        
        {error && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">用户</label>
              <select
                name="user_id"
                value={filters.user_id}
                onChange={handleChange}
                className="select select-bordered w-full"
                disabled={loading}
              >
                <option value="">所有用户</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">操作类型</label>
              <select
                name="action"
                value={filters.action}
                onChange={handleChange}
                className="select select-bordered w-full"
                disabled={loading}
              >
                <option value="">所有操作</option>
                {actions.map(action => (
                  <option key={action} value={action}>
                    {action.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">资源类型</label>
              <select
                name="resource_type"
                value={filters.resource_type}
                onChange={handleChange}
                className="select select-bordered w-full"
                disabled={loading}
              >
                <option value="">所有资源</option>
                {resourceTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">资源 ID</label>
              <input
                type="text"
                name="resource_id"
                value={filters.resource_id}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="输入资源 ID"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">开始日期</label>
              <input
                type="datetime-local"
                name="start_date"
                value={filters.start_date}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">结束日期</label>
              <input
                type="datetime-local"
                name="end_date"
                value={filters.end_date}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4 space-x-2">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleReset}
              disabled={loading}
            >
              重置
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              应用筛选
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuditLogFilter;