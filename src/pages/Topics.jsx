import { useState, useEffect } from 'react';
import { Eye, EyeOff, FileText, PlusCircle, Trash2, Hash, Loader2 } from 'lucide-react';
import apiFetch from '../services/api';

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  const [toggleLoading, setToggleLoading] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: null, currentHiddenStatus: false, title: '', message: '' });

  const fetchDashboardStats = async () => {
    try {
      const res = await apiFetch('/admin/topics/dashboard-stats');
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Failed to load topic stats", err);
    }
  };

  const fetchTopics = async (page) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(`/admin/topics/stats?page=${page}&limit=${limit}`);
      if (res.success) {
        setTopics(res.data.topics || []);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    fetchTopics(currentPage);
  }, [currentPage]);

  const requestToggleVisibility = (id, currentHiddenStatus) => {
    const action = currentHiddenStatus ? 'unhide' : 'hide';
    setConfirmDialog({
      isOpen: true,
      id,
      currentHiddenStatus,
      title: `${currentHiddenStatus ? 'Unhide' : 'Hide'} Topic`,
      message: `Are you sure you want to ${action} this topic?`
    });
  };

  const handleToggleVisibility = async () => {
    const { id } = confirmDialog;
    setToggleLoading(id);
    try {
      const res = await apiFetch(`/admin/topics/${id}/toggle-visibility`, {
        method: 'POST'
      });
      if (res.success) {
        setTopics(prev => prev.map(t => {
          if (t._id === id) {
            return { ...t, isHidden: res.data.isHidden };
          }
          return t;
        }));
      } else {
        alert(res.message || res.error);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setToggleLoading(null);
      setConfirmDialog({ isOpen: false, id: null, currentHiddenStatus: false, title: '', message: '' });
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Topics Management</h1>
          <p className="text-gray-400 text-sm">
            {stats?.totalTopicsCount || 0} registered topics
          </p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
            <h2 className="text-4xl font-bold text-blue-500 mb-2">{stats.totalTopicsCount || 0}</h2>
            <p className="text-gray-400 text-sm flex items-center gap-2"><Hash size={14}/> Total Topics</p>
          </div>
          <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
            <h2 className="text-4xl font-bold text-white mb-2">{stats.totalArticles || 0}</h2>
            <p className="text-gray-400 text-sm flex items-center gap-2"><FileText size={14}/> Total Articles</p>
          </div>
          <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
            <h2 className="text-4xl font-bold text-brand-green mb-2">{stats.articlesAddedLastWeek || 0}</h2>
            <p className="text-gray-400 text-sm flex items-center gap-2"><PlusCircle size={14}/> Added Last Week</p>
          </div>
          <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
            <h2 className="text-4xl font-bold text-brand-red mb-2">{stats.articlesDeletedLastWeek || 0}</h2>
            <p className="text-gray-400 text-sm flex items-center gap-2"><Trash2 size={14}/> Deleted Last Week</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-dark-800 rounded-xl border border-dark-600/50 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-dark-600/50 bg-dark-900/50 text-gray-500 font-semibold tracking-wider text-[11px]">
                <th className="px-6 py-4 uppercase">Topic</th>
                <th className="px-6 py-4 uppercase">Status</th>
                <th className="px-6 py-4 uppercase">Total Articles</th>
                <th className="px-6 py-4 uppercase">Recent (7 Days)</th>
                <th className="px-6 py-4 uppercase">Created At</th>
                <th className="px-6 py-4 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-600/50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center">
                    <Loader2 className="animate-spin text-brand-green mx-auto" size={24} />
                  </td>
                </tr>
              ) : topics.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                    No topics found.
                  </td>
                </tr>
              ) : (
                topics.map((topic) => (
                  <tr key={topic._id} className="hover:bg-dark-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-bold">{topic.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      {topic.isHidden ? (
                         <span className="bg-brand-red/10 text-brand-red border border-brand-red/20 px-2.5 py-1 rounded-md text-xs font-medium">Hidden</span>
                      ) : (
                         <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-2.5 py-1 rounded-md text-xs font-medium">Visible</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {topic.totalArticles || 0}
                    </td>
                    <td className="px-6 py-4">
                       <span className="bg-dark-900 border border-dark-600 text-gray-300 px-2 py-0.5 rounded text-xs">
                          {topic.recentArticlesCount || 0} new
                       </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {topic.createdAt ? new Date(topic.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                         onClick={() => requestToggleVisibility(topic._id, topic.isHidden)}
                         disabled={toggleLoading === topic._id}
                         className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ml-auto ${
                           topic.isHidden 
                             ? 'text-brand-green bg-brand-green/10 hover:bg-brand-green/20 border-brand-green/20'
                             : 'text-brand-red bg-brand-red/10 hover:bg-brand-red/20 border-brand-red/20'
                         } disabled:opacity-50`}
                      >
                         {toggleLoading === topic._id ? (
                           <Loader2 size={14} className="animate-spin" />
                         ) : topic.isHidden ? (
                           <Eye size={14} />
                         ) : (
                           <EyeOff size={14} />
                         )}
                         {topic.isHidden ? 'Unhide' : 'Hide'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-dark-600/50">
            <span className="text-sm text-gray-400">
              Showing page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-4 py-2 bg-dark-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-600 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 bg-dark-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-600 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Confirm Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-dark-800 rounded-xl border border-dark-600 w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-dark-600/50">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {confirmDialog.title}
              </h3>
            </div>
            <div className="p-5">
              <p className="text-gray-300 text-sm">{confirmDialog.message}</p>
            </div>
            <div className="p-5 bg-dark-900/50 border-t border-dark-600/50 flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDialog({ isOpen: false, id: null, currentHiddenStatus: false, title: '', message: '' })}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleVisibility}
                disabled={toggleLoading === confirmDialog.id}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ${
                  !confirmDialog.currentHiddenStatus 
                    ? 'bg-brand-red text-white hover:bg-red-600'
                    : 'bg-brand-green text-dark-900 hover:bg-brand-green/90'
                }`}
              >
                {toggleLoading === confirmDialog.id ? <Loader2 size={16} className="animate-spin" /> : null}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topics;
