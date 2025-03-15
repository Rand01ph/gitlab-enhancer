import React, { useState, useEffect } from 'react';
import { fetchGitLabProjects, fetchGitLabGroups } from '../../services/gitlab';
const HookDeployForm = ({ hook, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    deployment_level: 'server',
    target_id: '',
    target_name: '',
    hook_version_id: hook?.current_version ? null : null
  });
  const [projects, setProjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loadingTargets, setLoadingTargets] = useState(false);
  const [gitlabError, setGitlabError] = useState(null);

  // 当部署级别改变时，加载相应的目标选项
  useEffect(() => {
    const loadTargets = async () => {
      if (formData.deployment_level === 'server') {
        return; // 服务器级别不需要加载目标
      }

      setLoadingTargets(true);
      setGitlabError(null);

      try {
        if (formData.deployment_level === 'project') {
          const projectsData = await fetchGitLabProjects();
          setProjects(projectsData);
        } else if (formData.deployment_level === 'group') {
          const groupsData = await fetchGitLabGroups();
          setGroups(groupsData);
        }
      } catch (error) {
        console.error('Error loading targets:', error);
        setGitlabError('Failed to load GitLab targets. Please check your GitLab configuration.');
    } finally {
        setLoadingTargets(false);
    }
  };

    loadTargets();
  }, [formData.deployment_level]);

  // 处理表单字段变化
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'deployment_level') {
      // 重置目标字段
      setFormData({
        ...formData,
        deployment_level: value,
        target_id: '',
        target_name: ''
      });
    } else if (name === 'target') {
      // 解析目标 ID 和名称
      const [targetId, targetName] = value.split('|');
      setFormData({
        ...formData,
        target_id: targetId,
        target_name: targetName
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
};

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
};

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">部署级别</label>
        <select
          name="deployment_level"
          value={formData.deployment_level}
          onChange={handleChange}
          className="select select-bordered w-full"
          disabled={loading}
        >
          <option value="server">服务器级别</option>
          <option value="project">项目级别</option>
          <option value="group">组级别</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {formData.deployment_level === 'server' && '部署到 GitLab 服务器全局 hooks 目录'}
          {formData.deployment_level === 'project' && '部署到特定的 GitLab 项目'}
          {formData.deployment_level === 'group' && '部署到 GitLab 组内的所有项目'}
        </p>
      </div>

      {formData.deployment_level !== 'server' && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            {formData.deployment_level === 'project' ? '选择项目' : '选择组'}
          </label>

          {loadingTargets ? (
            <div className="flex items-center space-x-2">
              <span className="loading loading-spinner loading-sm"></span>
              <span>加载中...</span>
            </div>
          ) : gitlabError ? (
            <div className="text-error text-sm">{gitlabError}</div>
          ) : (
            <select
              name="target"
              value={formData.target_id ? `${formData.target_id}|${formData.target_name}` : ''}
              onChange={handleChange}
              className="select select-bordered w-full"
              disabled={loading}
              required
            >
              <option value="">请选择{formData.deployment_level === 'project' ? '项目' : '组'}</option>
              {formData.deployment_level === 'project' && projects.map(project => (
                <option key={project.id} value={`${project.id}|${project.name}`}>
                  {project.name} ({project.path_with_namespace})
                </option>
              ))}
              {formData.deployment_level === 'group' && groups.map(group => (
                <option key={group.id} value={`${group.id}|${group.name}`}>
                  {group.name} ({group.path})
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {hook && hook.versions && hook.versions.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Hook 版本</label>
          <select
            name="hook_version_id"
            value={formData.hook_version_id || ''}
            onChange={handleChange}
            className="select select-bordered w-full"
            disabled={loading}
          >
            <option value="">使用最新版本 (v{hook.current_version})</option>
            {hook.versions.map(version => (
              <option key={version.id} value={version.id}>
                版本 {version.version} ({new Date(version.created_at).toLocaleString()})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-2 mt-6">
        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
          disabled={loading}
        >
          取消
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || (formData.deployment_level !== 'server' && !formData.target_id)}
        >
          {loading ? <span className="loading loading-spinner loading-sm"></span> : null}
          部署
        </button>
      </div>
    </form>
  );
};

export default HookDeployForm;