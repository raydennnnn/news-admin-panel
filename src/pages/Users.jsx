import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Loader2 } from 'lucide-react';
import apiFetch from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: null, currentStatus: '', title: '', message: '' });

  const fetchUsers = async (page) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(`/admin/users?page=${page}&limit=${limit}`);
      if (res.success) {
        setUsers(res.data.users || []);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const requestToggleBlock = (id, currentStatus) => {
    const action = currentStatus === 'Blocked' ? 'unblock' : 'block';
    setConfirmDialog({
      isOpen: true,
      id,
      currentStatus,
      title: `${action === 'block' ? 'Block' : 'Unblock'} User`,
      message: `Are you sure you want to ${action} this user?`
    });
  };

  const handleToggleBlock = async () => {
    const { id } = confirmDialog;
    setActionLoading(id);
    try {
      const res = await apiFetch(`/admin/users/${id}/toggle-block`, {
        method: 'POST'
      });
      if (res.success) {
        // Update user status locally based on the response
        setUsers(prev => prev.map(u => {
          if (u._id === id) {
            return { ...u, status: res.data.isBlocked ? 'Blocked' : 'Active' };
          }
          return u;
        }));
      } else {
        alert(res.message || res.error);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
      setConfirmDialog({ isOpen: false, id: null, currentStatus: '', title: '', message: '' });
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
          <h1 className="text-2xl font-bold text-white mb-1">User Management</h1>
          <p className="text-gray-400 text-sm">
            {pagination?.totalDocs || 0} registered users
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-dark-800 rounded-xl border border-dark-600/50 overflow-hidden">
        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-dark-600/50 bg-dark-900/50 text-gray-500 font-semibold tracking-wider text-[11px]">
                <th className="px-6 py-4 uppercase">User</th>
                <th className="px-6 py-4 uppercase">Role</th>
                <th className="px-6 py-4 uppercase">Comments</th>
                <th className="px-6 py-4 uppercase">Joined</th>
                <th className="px-6 py-4 uppercase">Status</th>
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
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const avatar = (user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase();
                  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unknown User';
                  
                  return (
                    <tr key={user._id} className="hover:bg-dark-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded text-white font-bold flex items-center justify-center border border-dark-500 bg-dark-600">
                            {avatar}
                          </div>
                          <div>
                            <p className="text-white font-medium">{name}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-dark-900 border border-dark-600 text-gray-300 px-2 py-0.5 rounded text-xs w-fit capitalize inline-block">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">{user.commentCount || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400">
                          {user.dateOfJoining ? new Date(user.dateOfJoining).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.status === 'Active' ? (
                          <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-2.5 py-1 rounded-md text-xs font-medium">Active</span>
                        ) : (
                          <span className="bg-brand-red/10 text-brand-red border border-brand-red/20 px-2.5 py-1 rounded-md text-xs font-medium">Blocked</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => requestToggleBlock(user._id, user.status)}
                          disabled={actionLoading === user._id}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ml-auto ${
                            user.status === 'Active' 
                              ? 'text-brand-red bg-brand-red/10 hover:bg-brand-red/20 border-brand-red/20'
                              : 'text-brand-green bg-brand-green/10 hover:bg-brand-green/20 border-brand-green/20'
                          } disabled:opacity-50`}
                        >
                          {actionLoading === user._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : user.status === 'Active' ? (
                            <ShieldAlert size={14} />
                          ) : (
                            <Shield size={14} />
                          )}
                          {user.status === 'Active' ? 'Block' : 'Unblock'}
                        </button>
                      </td>
                    </tr>
                  );
                })
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
                onClick={() => setConfirmDialog({ isOpen: false, id: null, currentStatus: '', title: '', message: '' })}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleBlock}
                disabled={actionLoading === confirmDialog.id}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ${
                  confirmDialog.currentStatus === 'Active' 
                    ? 'bg-brand-red text-white hover:bg-red-600'
                    : 'bg-brand-green text-dark-900 hover:bg-brand-green/90'
                }`}
              >
                {actionLoading === confirmDialog.id ? <Loader2 size={16} className="animate-spin" /> : null}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
