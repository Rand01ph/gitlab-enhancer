import api from './auth.js';

// 获取审计日志列表
export const fetchAuditLogs = async (filters = {}) => {
  try {
    const response = await api.get('/audit-logs/', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

// 获取所有操作类型
export const fetchActions = async () => {
  try {
    const response = await api.get('/audit-logs/actions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching audit log actions:', error);
    throw error;
  }
};

// 获取所有资源类型
export const fetchResourceTypes = async () => {
  try {
    const response = await api.get('/audit-logs/resource-types/');
    return response.data;
  } catch (error) {
    console.error('Error fetching audit log resource types:', error);
    throw error;
  }
};

// 获取有审计日志的用户列表
export const fetchUsers = async () => {
  try {
    const response = await api.get('/audit-logs/users/');
    return response.data;
  } catch (error) {
    console.error('Error fetching audit log users:', error);
    throw error;
  }
};