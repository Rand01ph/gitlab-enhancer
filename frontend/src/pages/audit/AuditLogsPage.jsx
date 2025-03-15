import React, { useState, useEffect } from 'react';
import { fetchAuditLogs } from '../../services/audit';
import AuditLogFilter from '../../components/audit/AuditLogFilter';
import AuditLogList from '../../components/audit/AuditLogList';

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  
  useEffect(() => {
    const loadAuditLogs = async () => {
      try {
        setLoading(true);
        const data = await fetchAuditLogs(filters);
        setLogs(data);
        setError(null);
      } catch (err) {
        console.error('Error loading audit logs:', err);
        setError('加载审计日志失败: ' + (err.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    };
    
    loadAuditLogs();
  }, [filters]);
  
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">审计日志</h1>
        <p className="text-gray-600">
          查看系统操作记录和变更历史
        </p>
      </div>
      
      <AuditLogFilter onFilter={handleFilter} />
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">操作记录</h2>
          <AuditLogList
            logs={logs}
            isLoading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;