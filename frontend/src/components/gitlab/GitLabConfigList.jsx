import React from 'react';
import PropTypes from 'prop-types';

const GitLabConfigList = ({ configs, onEdit, onDelete, onTest }) => {
  if (configs.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <p className="text-center text-gray-500">No GitLab configurations found. Add one to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>URL</th>
            <th>Status</th>
            <th>Created</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {configs.map(config => (
            <tr key={config.id}>
              <td>{config.url}</td>
              <td>
                {config.is_active ? (
                  <div className="badge badge-success">Active</div>
                ) : (
                  <div className="badge badge-error">Inactive</div>
                )}
              </td>
              <td>{new Date(config.created_at).toLocaleDateString()}</td>
              <td>{new Date(config.updated_at).toLocaleDateString()}</td>
              <td>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onTest(config.id)} 
                    className="btn btn-xs btn-outline btn-info"
                  >
                    Test
                  </button>
                  <button 
                    onClick={() => onEdit(config)} 
                    className="btn btn-xs btn-outline"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDelete(config.id)} 
                    className="btn btn-xs btn-outline btn-error"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

GitLabConfigList.propTypes = {
  configs: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onTest: PropTypes.func.isRequired
};

export default GitLabConfigList;