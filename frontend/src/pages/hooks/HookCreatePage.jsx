import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HookForm from '../../components/hooks/HookForm';
import { createHook } from '../../services/hooks';

const HookCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const newHook = await createHook(formData);
      navigate(`/hooks/${newHook.id}`);
    } catch (err) {
      console.error('Error creating hook:', err);
      setError('Failed to create hook: ' + (err.response?.data?.detail || err.message));
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/hooks');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Upload New Hook</h1>
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
          <HookForm 
            onSubmit={handleSubmit} 
            onCancel={handleCancel} 
            loading={loading} 
          />
        </div>
      </div>
    </div>
  );
};

export default HookCreatePage;