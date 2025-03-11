import api from './auth.js';

// 获取所有 GitLab 配置
export const fetchGitLabConfigs = async () => {
  try {
    const response = await api.get('/gitlab/configs');
    return response.data.items || response.data;
  } catch (error) {
    console.error('Error fetching GitLab configs:', error);
    throw error;
  }
};

// 获取单个 GitLab 配置
export const fetchGitLabConfig = async (configId) => {
  try {
    const response = await api.get(`/gitlab/configs/${configId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching GitLab config ${configId}:`, error);
    throw error;
  }
};

// 创建 GitLab 配置
export const createGitLabConfig = async (configData) => {
  try {
    const response = await api.post('/gitlab/configs', configData);
    return response.data;
  } catch (error) {
    console.error('Error creating GitLab config:', error);
    throw error;
  }
};

// 更新 GitLab 配置
export const updateGitLabConfig = async (configId, configData) => {
  try {
    // 如果 token 为空字符串，将其设为 null，表示不更新 token
    const dataToSend = { ...configData };
    if (dataToSend.token === '') {
      dataToSend.token = null;
    }
    const response = await api.put(`/gitlab/configs/${configId}`, dataToSend);
    return response.data;
  } catch (error) {
    console.error(`Error updating GitLab config ${configId}:`, error);
    throw error;
  }
};

// 删除 GitLab 配置
export const deleteGitLabConfig = async (configId) => {
  try {
    const response = await api.delete(`/gitlab/configs/${configId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting GitLab config ${configId}:`, error);
    throw error;
  }
};

// 测试 GitLab 连接
export const testGitLabConnection = async (configId) => {
  try {
    const response = await api.post(`/gitlab/configs/${configId}/test`);
    return response.data;
  } catch (error) {
    console.error(`Error testing GitLab connection for config ${configId}:`, error);
    throw error;
  }
};

// 获取 GitLab 项目列表
export const fetchGitLabProjects = async (configId) => {
  try {
    const response = await api.get(`/gitlab/configs/${configId}/projects`);
    return response.data.items || response.data;
  } catch (error) {
    console.error(`Error fetching GitLab projects for config ${configId}:`, error);
    throw error;
  }
};

// 获取 GitLab 组列表
export const fetchGitLabGroups = async (configId) => {
  try {
    const response = await api.get(`/gitlab/configs/${configId}/groups`);
    return response.data.items || response.data;
  } catch (error) {
    console.error(`Error fetching GitLab groups for config ${configId}:`, error);
    throw error;
  }
};

// 获取 GitLab 服务器信息
export const fetchGitLabServerInfo = async (configId) => {
  try {
    const response = await api.get(`/gitlab/configs/${configId}/server-info`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching GitLab server info for config ${configId}:`, error);
    throw error;
  }
};
