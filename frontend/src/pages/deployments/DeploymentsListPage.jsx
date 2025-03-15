import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchDeployments } from '../../services/deployments';
import DeploymentsList from '../../components/deployments/DeploymentsList';

const DeploymentsListPage = () => {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const hookId = searchParams.get('hook_id');
  
  useEffect(() => {
    const loadDeployments = async () => {
      try {
        setLoading(true);
        const data = await fetchDeployments(hookId);
        setDeployments(data);
        setError(null);
      } catch (err) {
        console.error('Error loading deployments:', err);
        setError('Failed to load deployment history');
      } finally {
        setLoading(false);
      }
    };
    
    loadDeployments();
  }, [hookId]);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">部署历史</h1>
        {hookId && (
          <Link to={`/hooks/${hookId}`} className="btn btn-outline">
            返回 Hook
          </Link>
        )}
      </div>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <DeploymentsList
            deployments={deployments}
            isLoading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default DeploymentsListPage;