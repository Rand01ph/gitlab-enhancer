import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGitLabProjects, fetchGitLabConfig } from '../../services/gitlab';

const GitLabProjectsPage = () => {
  const { configId } = useParams();
  const [projects, setProjects] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [configData, projectsData] = await Promise.all([
          fetchGitLabConfig(configId),
          fetchGitLabProjects(configId)
        ]);
        setConfig(configData);
        setProjects(projectsData);
      } catch (err) {
        setError('Failed to load GitLab projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [configId]);

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Projects from {config.url}</h1>
        <p className="text-gray-500">Showing all projects accessible with the configured token</p>
      </div>

      {projects.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <p className="text-center text-gray-500">No projects found for this GitLab instance.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div key={project.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{project.name}</h2>
                <p>{project.description || 'No description'}</p>
                <div className="mt-2">
                  <div className="badge badge-outline">{project.visibility}</div>
                  <div className="badge badge-outline ml-2">{project.default_branch}</div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <a 
                    href={project.web_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline"
                  >
                    View in GitLab
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GitLabProjectsPage;