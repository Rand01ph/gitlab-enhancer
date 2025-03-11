import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const HooksList = ({ hooks = [], onDelete }) => {
  // 确保 hooks 是数组
  const hooksArray = Array.isArray(hooks) ? hooks : [];

  if (hooksArray.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <p className="text-center text-gray-500">No hooks found. Upload one to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Hook Type</th>
            <th>File Type</th>
            <th>Language</th>
            <th>Created</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hooksArray.map(hook => (
            <tr key={hook.id}>
              <td>
                <Link to={`/hooks/${hook.id}`} className="font-medium hover:underline">
                  {hook.name}
                </Link>
              </td>
              <td>
                <div className="badge badge-outline">
                  {hook.hook_type}
                </div>
              </td>
              <td>{hook.file_type}</td>
              <td>{hook.script_language || 'N/A'}</td>
              <td>{new Date(hook.created_at).toLocaleDateString()}</td>
              <td>{new Date(hook.updated_at).toLocaleDateString()}</td>
              <td>
                <div className="flex space-x-2">
                  <Link to={`/hooks/${hook.id}/deploy`} className="btn btn-xs btn-outline btn-success">
                    Deploy
                  </Link>
                  <Link to={`/hooks/${hook.id}/edit`} className="btn btn-xs btn-outline">
                    Edit
                  </Link>
                  <button 
                    onClick={() => onDelete(hook.id)} 
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

HooksList.propTypes = {
  hooks: PropTypes.array,
  onDelete: PropTypes.func.isRequired
};

export default HooksList;