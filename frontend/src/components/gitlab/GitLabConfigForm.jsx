import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createGitLabConfig, updateGitLabConfig } from '../../services/gitlab';

const GitLabConfigForm = ({ config, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    url: config?.url || '',
    token: config?.token || '',
    is_active: config?.is_active ?? true
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
    
    // 简单验证
    if (!formData.url || !formData.token) {
      setError('URL and token are required');
      return;
    }

    try {
      setLoading(true);
      if (config) {
        await updateGitLabConfig(config.id, formData);
      } else {
        await createGitLabConfig(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save GitLab configuration');
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

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">GitLab URL</span>
        </label>
        <input
          type="url"
          name="url"
          placeholder="https://gitlab.example.com"
          className="input input-bordered w-full"
          value={formData.url}
          onChange={handleChange}
          required
        />
        <label className="label">
          <span className="label-text-alt">Enter the full URL of your GitLab instance</span>
        </label>
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Access Token</span>
        </label>
        <input
          type="text"
          name="token"
          placeholder="glpat-xxxxxxxxxx"
          className="input input-bordered w-full"
          value={formData.token}
          onChange={handleChange}
          required
        />
        <label className="label">
          <span className="label-text-alt">
            <a href="https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html" 
               target="_blank" 
               rel="noopener noreferrer"
               className="link link-primary">
              How to create a GitLab access token
            </a>
          </span>
        </label>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Active</span>
          <input
            type="checkbox"
            name="is_active"
            className="toggle toggle-primary"
            checked={formData.is_active}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="modal-action">
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
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Saving...
            </>
          ) : (
            'Save'
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