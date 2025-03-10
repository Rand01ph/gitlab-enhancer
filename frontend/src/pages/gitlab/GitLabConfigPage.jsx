import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GitLabConfigList from '../../components/gitlab/GitLabConfigList';
import GitLabConfigForm from '../../components/gitlab/GitLabConfigForm';
import { fetchGitLabConfigs, deleteGitLabConfig, testGitLabConnection } from '../../services/gitlab';

const GitLabConfigPage = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const navigate = useNavigate();

  // 加载 GitLab 配置列表
  const loadConfigs = async () => {
    try {
      setLoading(true);
      const data = await fetchGitLabConfigs();
      setConfigs(data);
      setError(null);
    } catch (err) {
      setError('Failed to load GitLab configurations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  // 处理添加/编辑表单的打开
  const handleAddConfig = () => {
    setEditingConfig(null);
    setIsModalOpen(true);
  };

  const handleEditConfig = (config) => {
    setEditingConfig(config);
    setIsModalOpen(true);
  };

  // 处理删除配置
  const handleDeleteConfig = async (configId) => {
    if (window.confirm('Are you sure you want to delete this GitLab configuration?')) {
      try {
        await deleteGitLabConfig(configId);
        setConfigs(configs.filter(config => config.id !== configId));
      } catch (err) {
        setError('Failed to delete GitLab configuration');
        console.error(err);
      }
    }
  };

  // 处理测试连接
  const handleTestConnection = async (configId) => {
    try {
      const result = await testGitLabConnection(configId);
      alert(result.message);
    } catch (err) {
      alert('Failed to test connection: ' + (err.response?.data?.message || err.message));
    }
  };

  // 处理表单提交成功
  const handleFormSuccess = () => {
    setIsModalOpen(false);
    loadConfigs();
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
              onSuccess={handleFormSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
          <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}></div>
        </div>
      )}
    </div>
  );
};

export default GitLabConfigPage;