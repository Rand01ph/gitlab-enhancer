import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GitLabConfigList from '../../components/gitlab/GitLabConfigList';
import GitLabConfigForm from '../../components/gitlab/GitLabConfigForm';
import { fetchGitLabConfigs, deleteGitLabConfig, testGitLabConnection, createGitLabConfig, updateGitLabConfig } from '../../services/gitlab';

const GitLabConfigPage = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [testResult, setTestResult] = useState(null); // 添加测试结果状态
  const [testingId, setTestingId] = useState(null); // 添加正在测试的配置ID状态
  const navigate = useNavigate();

  // 只在组件挂载时加载配置
  useEffect(() => {
    const loadInitialConfigs = async () => {
      try {
        setLoading(true);
        const response = await fetchGitLabConfigs();

        // 处理响应数据
        const configArray = Array.isArray(response) ? response :
                           (Array.isArray(response.data) ? response.data :
                           (response.items ? response.items : []));

        setConfigs(configArray);
        setError(null);
      } catch (err) {
        console.error('Error loading GitLab configs:', err);
        setError('Failed to load GitLab configurations');
        setConfigs([]);
      } finally {
        setLoading(false);
      }
    };
    loadInitialConfigs();
  }, []);

  // 处理添加配置
  const handleAddConfig = () => {
    setEditingConfig(null);
    setIsModalOpen(true);
  };

  // 处理编辑配置
  const handleEditConfig = (config) => {
    setEditingConfig(config);
    setIsModalOpen(true);
  };

  // 处理删除配置
  const handleDeleteConfig = async (configId) => {
    if (window.confirm('Are you sure you want to delete this GitLab configuration?')) {
      try {
        await deleteGitLabConfig(configId);
        // 直接更新本地状态，无需重新请求
        setConfigs(prevConfigs => prevConfigs.filter(config => config.id !== configId));
      } catch (err) {
        setError('Failed to delete GitLab configuration: ' + (err.response?.data?.detail || err.message));
        console.error(err);
      }
    }
  };

  // 处理测试连接
  const handleTestConnection = async (configId) => {
    try {
      setTestingId(configId);
      const result = await testGitLabConnection(configId);
      
      // 获取当前测试的配置信息，用于显示在结果中
      const config = configs.find(c => c.id === configId);
      
      setTestResult({
        success: result.success,
        message: result.message || 'Connection successful',
        configUrl: config?.url || 'Unknown GitLab instance'
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: err.response?.data?.message || err.message || 'Connection failed',
        configUrl: configs.find(c => c.id === configId)?.url || 'Unknown GitLab instance'
      });
    } finally {
      setTestingId(null);
    }
  };

  // 关闭测试结果模态框
  const closeTestResult = () => {
    setTestResult(null);
  };

  // 处理表单提交
  const handleFormSubmit = async (configData, isEdit) => {
    try {
      let updatedConfig;

      if (isEdit) {
        // 编辑现有配置
        updatedConfig = await updateGitLabConfig(editingConfig.id, configData);

        // 更新本地状态
        setConfigs(prevConfigs =>
          prevConfigs.map(config =>
            config.id === updatedConfig.id ? updatedConfig : config
          )
        );
      } else {
        // 创建新配置
        const newConfig = await createGitLabConfig(configData);

        // 更新本地状态，添加新配置
        setConfigs(prevConfigs => [...prevConfigs, newConfig]);
      }

      // 关闭模态框
      setIsModalOpen(false);
      setEditingConfig(null);

      return true;
    } catch (err) {
      console.error('Error saving GitLab config:', err);
      return { error: err.response?.data?.detail || err.message };
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">GitLab Configurations</h1>
        <button
          onClick={handleAddConfig}
          className="btn btn-primary"
        >
          Add GitLab Instance
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center my-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <GitLabConfigList
          configs={configs}
          onEdit={handleEditConfig}
          onDelete={handleDeleteConfig}
          onTest={handleTestConnection}
          testingId={testingId}
        />
      )}

      {/* GitLab 配置表单模态框 */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {editingConfig ? 'Edit GitLab Configuration' : 'Add GitLab Configuration'}
            </h3>
            <GitLabConfigForm
              config={editingConfig}
              onSubmit={(data) => handleFormSubmit(data, !!editingConfig)}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
          <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}></div>
        </div>
      )}

      {/* 测试结果模态框 */}
      {testResult && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              Connection Test Result
            </h3>
            <div className={`alert ${testResult.success ? 'alert-success' : 'alert-error'} mb-4`}>
              <div className="flex items-center">
                {testResult.success ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span>{testResult.success ? 'Success' : 'Failed'}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="font-semibold">GitLab Instance:</p>
              <p className="text-sm">{testResult.configUrl}</p>
            </div>
            
            <div className="mb-6">
              <p className="font-semibold">Message:</p>
              <p className="text-sm">{testResult.message}</p>
            </div>
            
            <div className="modal-action">
              <button onClick={closeTestResult} className="btn">
                Close
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={closeTestResult}></div>
        </div>
      )}
    </div>
  );
};

export default GitLabConfigPage;