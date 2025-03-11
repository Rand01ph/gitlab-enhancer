import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchHook } from '../../services/hooks';
import { fetchGitLabConfigs } from '../../services/gitlab';
import HookDeployForm from '../../components/hooks/HookDeployForm';

const HookDeployPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hook, setHook] = useState(null);
  const [gitlabConfigs, setGitlabConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [hookData, configsData] = await Promise.all([
          fetchHook(id),
          fetchGitLabConfigs()
        ]);
        setHook(hookData);
        setGitlabConfigs(Array.isArray(configsData) ? configsData : []);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load required data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleCancel = () => {
    navigate(`/hooks/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Deploy Hook: {hook?.name}</h1>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {hook && (
            <HookDeployForm 
              hook={hook}
              gitlabConfigs={gitlabConfigs}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HookDeployPage;