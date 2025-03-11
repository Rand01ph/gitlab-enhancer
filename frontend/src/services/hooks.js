import api from './auth.js';

// 获取所有 Hook
export const fetchHooks = async () => {
  try {
    const response = await api.get('/hooks/');
    return response.data.items || response.data;
  } catch (error) {
    console.error('Error fetching hooks:', error);
    throw error;
  }
};

// 获取单个 Hook
export const fetchHook = async (hookId) => {
  try {
    const response = await api.get(`/hooks/${hookId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching hook ${hookId}:`, error);
    throw error;
  }
};

// 创建 Hook
export const createHook = async (hookData) => {
  try {
    // 使用 FormData 发送表单数据和文件
    const formData = new FormData();
    
    // 添加基本字段
    formData.append('name', hookData.name);
    formData.append('description', hookData.description || '');
    formData.append('hook_type', hookData.hook_type);
    formData.append('file_type', hookData.file_type);
    
    // 只有当文件类型为脚本时才添加脚本语言
    if (hookData.file_type === 'script' && hookData.script_language) {
      formData.append('script_language', hookData.script_language);
    }
    
    // 添加文件
    if (hookData.file) {
      formData.append('file', hookData.file);
    }
    
    const response = await api.post('/hooks/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating hook:', error);
    throw error;
  }
};

// 更新 Hook
export const updateHook = async (hookId, hookData) => {
  try {
    const formData = new FormData();
    
    // 添加基本字段
    formData.append('name', hookData.name);
    formData.append('description', hookData.description || '');
    formData.append('hook_type', hookData.hook_type);
    formData.append('file_type', hookData.file_type);
    
    // 只有当文件类型为脚本时才添加脚本语言
    if (hookData.file_type === 'script' && hookData.script_language) {
      formData.append('script_language', hookData.script_language);
    } else {
      // 如果不是脚本类型，发送空值
      formData.append('script_language', '');
    }
    
    // 只有当提供了新文件时才添加文件
    if (hookData.file && hookData.file instanceof File) {
      formData.append('file', hookData.file);
    }
    
    const response = await api.put(`/hooks/${hookId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error updating hook ${hookId}:`, error);
    throw error;
  }
};

// 删除 Hook
export const deleteHook = async (hookId) => {
  try {
    const response = await api.delete(`/hooks/${hookId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting hook ${hookId}:`, error);
    throw error;
  }
};

// 获取 Hook 版本历史
export const fetchHookVersions = async (hookId) => {
  try {
    const response = await api.get(`/hooks/${hookId}/versions/`);
    return response.data.items || response.data;
  } catch (error) {
    console.error(`Error fetching hook versions for ${hookId}:`, error);
    throw error;
  }
};

// 部署 Hook 到服务器级别
export const deployHookToServer = async (hookId, serverId) => {
  try {
    const response = await api.post(`/hooks/${hookId}/deploy/server/`, {
      server_id: serverId
    });
    return response.data;
  } catch (error) {
    console.error(`Error deploying hook ${hookId} to server:`, error);
    throw error;
  }
};

// 部署 Hook 到项目级别
export const deployHookToProject = async (hookId, projectId) => {
  try {
    const response = await api.post(`/hooks/${hookId}/deploy/project/`, {
      project_id: projectId
    });
    return response.data;
  } catch (error) {
    console.error(`Error deploying hook ${hookId} to project:`, error);
    throw error;
  }
};

// 部署 Hook 到组级别
export const deployHookToGroup = async (hookId, groupId) => {
  try {
    const response = await api.post(`/hooks/${hookId}/deploy/group/`, {
      group_id: groupId
    });
    return response.data;
  } catch (error) {
    console.error(`Error deploying hook ${hookId} to group:`, error);
    throw error;
  }
};