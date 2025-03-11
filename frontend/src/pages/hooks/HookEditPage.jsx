import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HookForm from '../../components/hooks/HookForm';
import { fetchHook, updateHook } from '../../services/hooks';

const HookEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hook, setHook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        setError('Failed to load hook');
      } finally {
        setLoading(false);
      }
    };

    loadHook();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      await updateHook(id, formData);
      navigate(`/hooks/${id}`);
    } catch (err) {
      console.error('Error updating hook:', err);
      setError('Failed to update hook: ' + (err.response?.data?.detail || err.message));
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/hooks');  // 修改为导航到 Hook 列表页
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
        <h1 className="text-3xl font-bold">Edit Hook</h1>
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
            <HookForm 
              hook={hook} 
              onSubmit={handleSubmit} 
              onCancel={handleCancel} 
              loading={saving} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HookEditPage;