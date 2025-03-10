import api from './auth.js';

// 获取所有 GitLab 配置
export const fetchGitLabConfigs = async () => {
  try {
    const response = await api.get('/gitlab/configs');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 获取单个 GitLab 配置
export const fetchGitLabConfig = async (configId) => {
  try {
    const response = await api.get(`/gitlab/configs/${configId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 创建 GitLab 配置
export const createGitLabConfig = async (configData) => {
  try {
    const response = await api.post('/gitlab/configs', configData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新 GitLab 配置
export const updateGitLabConfig = async (configId, configData) => {
  try {
    const response = await api.put(`/gitlab/configs/${configId}`, configData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 删除 GitLab 配置
export const deleteGitLabConfig = async (configId) => {
  try {
    const response = await api.delete(`/gitlab/configs/${configId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 测试 GitLab 连接
export const testGitLabConnection = async (configId) => {
  try {
    const response = await api.post(`/gitlab/configs/${configId}/test`);
    return response.data;
  } catch (error) {
    throw error;
  }
};