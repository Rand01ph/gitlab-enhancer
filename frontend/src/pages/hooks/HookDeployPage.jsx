import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchHook } from '../../services/hooks';
import { deployHook } from '../../services/deployments';
import HookDeployForm from '../../components/hooks/HookDeployForm';

const HookDeployPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hook, setHook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHook = async () => {
      try {
        setLoading(true);
        const data = await fetchHook(id);
        setHook(data);
        setError(null);
      } catch (err) {
        console.error('Error loading hook:', err);
        setError('Failed to load hook details');
      } finally {
        setLoading(false);
      }
    };

    loadHook();
  }, [id]);

  const handleDeploy = async (formData) => {
    try {
      setDeploying(true);
      const result = await deployHook(id, formData);
      navigate(`/hooks/${id}?deployed=true`);
    } catch (err) {
      console.error('Error deploying hook:', err);
      setError('Failed to deploy hook: ' + (err.response?.data?.detail || err.message));
      setDeploying(false);
    }
  };

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
        <h1 className="text-3xl font-bold">部署 Hook</h1>
        <p className="text-gray-600">
          {hook?.name} ({hook?.hook_type})
        </p>
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
          <p className="mb-4">
            选择部署级别和目标，将此 Hook 部署到 GitLab。
          </p>

          {hook && (
            <HookDeployForm
              hook={hook}
              onSubmit={handleDeploy}
              onCancel={handleCancel}
              loading={deploying}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HookDeployPage;