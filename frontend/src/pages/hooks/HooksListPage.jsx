import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchHooks, deleteHook } from '../../services/hooks';
import HooksList from '../../components/hooks/HooksList';

const HooksListPage = () => {
  const [hooks, setHooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHooks = async () => {
    try {
      setLoading(true);
      const data = await fetchHooks();
      setHooks(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error loading hooks:', err);
      setError('Failed to load hooks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHooks();
  }, []);

  const handleDeleteHook = async (hookId) => {
    if (window.confirm('Are you sure you want to delete this hook?')) {
      try {
        await deleteHook(hookId);
        setHooks(hooks.filter(hook => hook.id !== hookId));
      } catch (err) {
        console.error('Error deleting hook:', err);
        setError('Failed to delete hook');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Git Hooks</h1>
        <Link to="/hooks/new" className="btn btn-primary">
          Upload New Hook
        </Link>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center my-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <HooksList hooks={hooks} onDelete={handleDeleteHook} />
      )}
    </div>
  );
};

export default HooksListPage;