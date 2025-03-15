import api from './auth.js';

// 部署 Hook
export const deployHook = async (hookId, deploymentData) => {
  try {
    const response = await api.post(`/hooks/${hookId}/deploy/`, deploymentData);
    return response.data;
  } catch (error) {
    console.error(`Error deploying hook ${hookId}:`, error);
    throw error;
  }
};

// 获取部署历史列表
export const fetchDeployments = async (hookId = null) => {
  try {
    const params = {};
    if (hookId) {
      params.hook_id = hookId;
    }
    
    const response = await api.get('/deployments/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching deployments:', error);
    throw error;
  }
};

// 获取单个部署详情
export const fetchDeployment = async (deploymentId) => {
  try {
    const response = await api.get(`/deployments/${deploymentId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching deployment ${deploymentId}:`, error);
    throw error;
  }
};