import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchHook, fetchHookVersions, deleteHook } from '../../services/hooks';
import HookVersionsList from '../../components/hooks/HookVersionsList';

const HookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hook, setHook] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [hookData, versionsData] = await Promise.all([
          fetchHook(id),
          fetchHookVersions(id)
        ]);
        setHook(hookData);
        setVersions(Array.isArray(versionsData) ? versionsData : []);
        setError(null);
      } catch (err) {
        console.error('Error loading hook data:', err);
        setError('Failed to load hook details');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this hook? This action cannot be undone.')) {
      try {
        await deleteHook(id);
        navigate('/hooks');
      } catch (err) {
        console.error('Error deleting hook:', err);
        setError('Failed to delete hook');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!hook) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Hook not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{hook.name}</h1>
        <div className="flex space-x-2">
          <Link to={`/hooks/${id}/deploy`} className="btn btn-success">
            Deploy
          </Link>
          <Link to={`/hooks/${id}/edit`} className="btn btn-outline">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-error">
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h2 className="card-title">Hook Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h3 className="font-semibold text-gray-500">Hook Type</h3>
                  <div className="badge badge-outline mt-1">{hook.hook_type}</div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-500">File Type</h3>
                  <p>{hook.file_type}</p>
                </div>
                
                {hook.file_type === 'script' && (
                  <div>
                    <h3 className="font-semibold text-gray-500">Script Language</h3>
                    <p>{hook.script_language || 'Not specified'}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold text-gray-500">Created By</h3>
                  <p>{hook.created_by?.username || 'Unknown'}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-500">Created At</h3>
                  <p>{new Date(hook.created_at).toLocaleString()}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-500">Last Updated</h3>
                  <p>{new Date(hook.updated_at).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold text-gray-500">Description</h3>
                <p className="whitespace-pre-wrap mt-1">{hook.description || 'No description provided.'}</p>
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold text-gray-500">Download Current Version</h3>
                <a 
                  href={hook.file} 
                  download 
                  className="btn btn-outline btn-sm mt-1"
                >
                  Download File
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Version History</h2>
              
              {versions.length > 0 ? (
                <HookVersionsList versions={versions} />
              ) : (
                <p className="text-center text-gray-500 my-4">No version history available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HookDetailPage;