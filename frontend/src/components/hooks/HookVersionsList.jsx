import React from 'react';
import PropTypes from 'prop-types';

const HookVersionsList = ({ versions = [] }) => {
  if (versions.length === 0) {
    return <p className="text-gray-500">No versions available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Version</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {versions.map(version => (
            <tr key={version.id}>
              <td>v{version.version}</td>
              <td>{new Date(version.created_at).toLocaleDateString()}</td>
              <td>
                <a 
                  href={version.file} 
                  download 
                  className="btn btn-xs btn-outline"
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

HookVersionsList.propTypes = {
  versions: PropTypes.array
};

export default HookVersionsList;