import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const HookForm = ({ hook, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hook_type: 'pre-receive',
    file_type: 'script',
    script_language: 'bash',
    file: null,
    ...hook
  });
  
  const [fileSelected, setFileSelected] = useState(false);
  const [error, setError] = useState(null);
  
  // 当编辑模式下，不需要重新上传文件
  const isEditMode = !!hook;
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        file: e.target.files[0]
      });
      setFileSelected(!!e.target.files[0]);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // 当文件类型改变时，重置脚本语言
  useEffect(() => {
    if (formData.file_type !== 'script') {
      setFormData(prev => ({
        ...prev,
        script_language: null
      }));
    } else if (!formData.script_language) {
      setFormData(prev => ({
        ...prev,
        script_language: 'bash'
      }));
    }
  }, [formData.file_type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 验证
    if (!formData.name) {
      setError('Name is required');
      return;
    }
    
    if (!formData.hook_type) {
      setError('Hook type is required');
      return;
    }
    
    if (!formData.file_type) {
      setError('File type is required');
      return;
    }
    
    // 如果是脚本类型，需要脚本语言
    if (formData.file_type === 'script' && !formData.script_language) {
      setError('Script language is required for script files');
      return;
    }
    
    // 新建时，文件是必需的
    if (!isEditMode && !formData.file) {
      setError('File is required');
      return;
    }
    
    onSubmit(formData);
  };

  const hookTypes = [
    { value: 'pre-receive', label: 'Pre-receive' },
    { value: 'post-receive', label: 'Post-receive' },
    { value: 'update', label: 'Update' }
  ];
  
  const fileTypes = [
    { value: 'binary', label: 'Binary' },
    { value: 'script', label: 'Script' }
  ];
  
  const scriptLanguages = [
    { value: 'bash', label: 'Bash' },
    { value: 'python', label: 'Python' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'perl', label: 'Perl' }
  ];

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
          <span className="label-text">Hook Name</span>
        </label>
        <input
          type="text"
          name="name"
          placeholder="Enter hook name"
          className="input input-bordered w-full"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          name="description"
          placeholder="Enter hook description"
          className="textarea textarea-bordered w-full h-24"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Hook Type</span>
          </label>
          <select
            name="hook_type"
            className="select select-bordered w-full"
            value={formData.hook_type}
            onChange={handleChange}
            required
          >
            {hookTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">File Type</span>
          </label>
          <select
            name="file_type"
            className="select select-bordered w-full"
            value={formData.file_type}
            onChange={handleChange}
            required
          >
            {fileTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {formData.file_type === 'script' && (
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Script Language</span>
          </label>
          <select
            name="script_language"
            className="select select-bordered w-full"
            value={formData.script_language || ''}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a language</option>
            {scriptLanguages.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">
            Hook File
            {isEditMode && !fileSelected && (
              <span className="text-info ml-2">(Leave empty to keep current file)</span>
            )}
          </span>
        </label>
        <input
          type="file"
          name="file"
          className="file-input file-input-bordered w-full"
          onChange={handleChange}
          required={!isEditMode}
        />
        <label className="label">
          <span className="label-text-alt">
            {formData.file_type === 'script' 
              ? 'Upload a script file (.sh, .py, .rb, .pl)'
              : 'Upload a binary executable file'}
          </span>
        </label>
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
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              {isEditMode ? 'Updating...' : 'Uploading...'}
            </>
          ) : (
            isEditMode ? 'Update Hook' : 'Upload Hook'
          )}
        </button>
      </div>
    </form>
  );
};

HookForm.propTypes = {
  hook: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default HookForm;