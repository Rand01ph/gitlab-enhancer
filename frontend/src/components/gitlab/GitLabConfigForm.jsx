import React, { useState } from 'react';
import PropTypes from 'prop-types';

const GitLabConfigForm = ({ config, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    url: config?.url || '',
    token: '', // 不回显 token
    is_active: config?.is_active !== undefined ? config.is_active : true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 验证表单
    if (!formData.url) {
      setError('GitLab URL is required');
      return;
    }

    // 如果是编辑模式且 token 为空，则不更新 token
      const dataToSubmit = { ...formData };
    if (config && !dataToSubmit.token) {
        delete dataToSubmit.token;
      }

    setLoading(true);
    setError(null);

    try {
      const result = await onSubmit(dataToSubmit);

      if (result === true) {
        // 提交成功
        return;
      } else if (result && result.error) {
        // 提交失败，显示错误
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">GitLab URL</span>
        </label>
        <input
          type="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          className="input input-bordered"
          placeholder="https://gitlab.example.com"
          required
        />
        <label className="label">
          <span className="label-text-alt">The full URL of your GitLab instance</span>
        </label>
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Access Token {config ? '(leave empty to keep current)' : ''}</span>
        </label>
          <input
          type="password"
          name="token"
          value={formData.token}
            onChange={handleChange}
          className="input input-bordered"
          placeholder={config ? '••••••••••••••••' : 'Enter access token'}
          required={!config}
          />
        <label className="label">
          <span className="label-text-alt">Personal access token with API access</span>
        </label>
      </div>

      <div className="form-control mb-6">
        <label className="label cursor-pointer">
          <span className="label-text">Active</span>
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="checkbox checkbox-primary"
          />
        </label>
      </div>

      <div className="modal-action">
        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
          ) : (
            config ? 'Update' : 'Create'
          )}
        </button>
      </div>
    </form>
  );
};

GitLabConfigForm.propTypes = {
  config: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default GitLabConfigForm;