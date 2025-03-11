import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { 
  deployHookToServer, 
  deployHookToProject, 
  deployHookToGroup 
} from '../../services/hooks';
import { fetchGitLabProjects, fetchGitLabGroups } from '../../services/gitlab.js';
const HookDeployForm = ({ hook, gitlabConfigs, onCancel }) => {
  const navigate = useNavigate();
  const [deployType, setDeployType] = useState('server');
  const [selectedConfig, setSelectedConfig] = useState('');
  const [projects, setProjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTargets, setLoadingTargets] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 当 GitLab 配置改变时，加载项目或组
  useEffect(() => {
    const loadTargets = async () => {
      if (!selectedConfig) return;

      try {
        setLoadingTargets(true);
        setSelectedTarget('');

        if (deployType === 'project') {
          const projectsData = await fetchGitLabProjects(selectedConfig);
          setProjects(Array.isArray(projectsData) ? projectsData : []);
        } else if (deployType === 'group') {
          const groupsData = await fetchGitLabGroups(selectedConfig);
          setGroups(Array.isArray(groupsData) ? groupsData : []);
        }
      } catch (err) {
        console.error('Error loading targets:', err);
        setError(`Failed to load ${deployType === 'project' ? 'projects' : 'groups'}`);
      } finally {
        setLoadingTargets(false);
      }
    };

    loadTargets();
  }, [selectedConfig, deployType]);

  const handleDeployTypeChange = (e) => {
    setDeployType(e.target.value);
    setSelectedTarget('');
  };

  const handleConfigChange = (e) => {
    setSelectedConfig(e.target.value);
  };

  const handleTargetChange = (e) => {
    setSelectedTarget(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);

      let result;
      if (deployType === 'server') {
        result = await deployHookToServer(hook.id, selectedConfig);
      } else if (deployType === 'project') {
        result = await deployHookToProject(hook.id, selectedTarget);
      } else if (deployType === 'group') {
        result = await deployHookToGroup(hook.id, selectedTarget);
      }

      setSuccess(`Hook successfully deployed to ${deployType}`);
      
      // 3秒后导航回详情页
      setTimeout(() => {
        navigate(`/hooks/${hook.id}`);
      }, 3000);
    } catch (err) {
      console.error('Error deploying hook:', err);
      setError('Failed to deploy hook: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{success}</span>
        </div>
      )}

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Deploy To</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={deployType}
          onChange={handleDeployTypeChange}
          required
        >
          <option value="server">Server Level</option>
          <option value="project">Project Level</option>
          <option value="group">Group Level</option>
        </select>
      </div>

      {deployType === 'server' && (
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">GitLab Server</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={selectedConfig}
            onChange={handleConfigChange}
            required
          >
            <option value="" disabled>Select a GitLab server</option>
            {gitlabConfigs.map(config => (
              <option key={config.id} value={config.id}>
                {config.url}
              </option>
            ))}
          </select>
        </div>
      )}

      {deployType === 'project' && (
        <>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">GitLab Server</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedConfig}
              onChange={handleConfigChange}
              required
            >
              <option value="" disabled>Select a GitLab server</option>
              {gitlabConfigs.map(config => (
                <option key={config.id} value={config.id}>
                  {config.url}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Project</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedTarget}
              onChange={handleTargetChange}
              disabled={!selectedConfig || loadingTargets}
              required
            >
              <option value="" disabled>Select a project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.path_with_namespace}
                </option>
              ))}
            </select>
            {loadingTargets && (
              <div className="mt-2">
                <span className="loading loading-spinner loading-sm"></span>
                <span className="ml-2">Loading projects...</span>
              </div>
            )}
          </div>
        </>
      )}

      {deployType === 'group' && (
        <>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">GitLab Server</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedConfig}
              onChange={handleConfigChange}
              required
            >
              <option value="" disabled>Select a GitLab server</option>
              {gitlabConfigs.map(config => (
                <option key={config.id} value={config.id}>
                  {config.url}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Group</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedTarget}
              onChange={handleTargetChange}
              disabled={!selectedConfig || loadingTargets}
              required
            >
              <option value="" disabled>Select a group</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.full_path}
                </option>
              ))}
            </select>
            {loadingTargets && (
              <div className="mt-2">
                <span className="loading loading-spinner loading-sm"></span>
                <span className="ml-2">Loading groups...</span>
              </div>
            )}
          </div>
        </>
      )}

      <div className="alert alert-info mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 className="font-bold">Deployment Information</h3>
          <div className="text-sm">
            {deployType === 'server' && (
              <p>This will deploy the hook at server level, affecting all repositories.</p>
            )}
            {deployType === 'project' && (
              <p>This will deploy the hook to the selected project only.</p>
            )}
            {deployType === 'group' && (
              <p>This will deploy the hook to all projects in the selected group.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <button 
          type="button" 
          className="btn btn-ghost" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading || 
            (deployType === 'server' && !selectedConfig) || 
            ((deployType === 'project' || deployType === 'group') && !selectedTarget)}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Deploying...
            </>
          ) : (
            'Deploy Hook'
          )}
        </button>
      </div>
    </form>
  );
};

HookDeployForm.propTypes = {
  hook: PropTypes.object.isRequired,
  gitlabConfigs: PropTypes.array.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default HookDeployForm;