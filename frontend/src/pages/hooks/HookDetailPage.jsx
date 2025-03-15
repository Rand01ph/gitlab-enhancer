import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchHook, deleteHook } from '../../services/hooks';
import { fetchDeployments } from '../../services/deployments';
import DeploymentsList from '../../components/deployments/DeploymentsList';

const HookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const justDeployed = searchParams.get('deployed') === 'true';

  const [hook, setHook] = useState(null);
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deploymentsLoading, setDeploymentsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deploymentsError, setDeploymentsError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

    const loadDeployments = async () => {
      try {
        setDeploymentsLoading(true);
        const data = await fetchDeployments(id);
        setDeployments(data);
        setDeploymentsError(null);
      } catch (err) {
        console.error('Error loading deployments:', err);
        setDeploymentsError('Failed to load deployment history');
      } finally {
        setDeploymentsLoading(false);
      }
    };

    loadHook();
    loadDeployments();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteHook(id);
      navigate('/hooks');
    } catch (err) {
      console.error('Error deleting hook:', err);
      setError('Failed to delete hook: ' + (err.response?.data?.detail || err.message));
      setShowDeleteModal(false);
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
    return null;
  }
  return (
    <div className="container mx-auto px-4 py-6">
      {justDeployed && (
        <div className="alert alert-success mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Hook 部署请求已提交！</span>
        </div>
                )}
                
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{hook.name}</h1>
          <div className="flex space-x-2">
            <Link to={`/hooks/${id}/deploy`} className="btn btn-primary">
              部署
            </Link>
            <Link to={`/hooks/${id}/edit`} className="btn btn-outline">
              编辑
            </Link>
            <button
              className="btn btn-error"
              onClick={() => setShowDeleteModal(true)}
            >
              删除
            </button>
                </div>
              </div>
              </div>
              
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card bg-base-100 shadow-xl lg:col-span-2">
          <div className="card-body">
            <h2 className="card-title">Hook 详情</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Hook 类型</p>
                <p>{hook.hook_type}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">文件类型</p>
                <p>
                  {hook.file_type === 'binary' ? '二进制文件' : '脚本'}
                  {hook.file_type === 'script' && hook.script_language && ` (${hook.script_language})`}
                </p>
          </div>
              <div>
                <p className="text-sm font-medium text-gray-500">创建者</p>
                <p>{hook.created_by.username}</p>
      </div>

              <div>
                <p className="text-sm font-medium text-gray-500">创建时间</p>
                <p>{new Date(hook.created_at).toLocaleString()}</p>
    </div>

              <div>
                <p className="text-sm font-medium text-gray-500">最后更新</p>
                <p>{new Date(hook.updated_at).toLocaleString()}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">当前版本</p>
                <p>v{hook.current_version}</p>
              </div>
            </div>

            {hook.description && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">描述</p>
                <p className="whitespace-pre-line">{hook.description}</p>
              </div>
            )}

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">文件</p>
              <div className="flex items-center mt-1">
                <a
                  href={hook.file_url}
                  download
                  className="btn btn-sm btn-outline"
                >
                  下载文件
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">版本历史</h2>

            {hook.versions && hook.versions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>版本</th>
                      <th>日期</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hook.versions.map(version => (
                      <tr key={version.id}>
                        <td>v{version.version}</td>
                        <td>{new Date(version.created_at).toLocaleDateString()}</td>
                        <td>
                          <a
                            href={`/api/hooks/${hook.id}/versions/${version.id}/download`}
                            download
                            className="btn btn-xs btn-outline"
                          >
                            下载
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">暂无版本历史</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title">部署历史</h2>
              <Link to={`/deployments?hook_id=${id}`} className="btn btn-sm btn-outline">
                查看全部
              </Link>
            </div>

            <DeploymentsList
              deployments={deployments}
              isLoading={deploymentsLoading}
              error={deploymentsError}
            />
          </div>
        </div>
      </div>

      {/* 删除确认对话框 */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">确认删除</h3>
            <p className="py-4">
              您确定要删除 Hook "{hook.name}" 吗？此操作不可撤销。
            </p>
            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setShowDeleteModal(false)}
              >
                取消
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                删除
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowDeleteModal(false)}></div>
        </div>
      )}
    </div>
  );
};

export default HookDetailPage;