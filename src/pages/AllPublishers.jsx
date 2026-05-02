import { useState, useEffect } from 'react';
import { Eye, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Loader2, AlertTriangle, Mail, Ban, CheckCircle2, X } from 'lucide-react';
import apiFetch from '../services/api';

const TrustScoreBadge = ({ score, level }) => {
  const isHigh = level === 'High Trust';
  const isMedium = level === 'Medium Trust';
  
  const colorClass = isHigh ? 'text-brand-green border-brand-green' : isMedium ? 'text-brand-yellow border-brand-yellow' : 'text-brand-red border-brand-red';
  const textClass = isHigh ? 'text-brand-green' : isMedium ? 'text-brand-yellow' : 'text-brand-red';

  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full border-[3px] border-dark-700 relative flex items-center justify-center`}>
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path
            className={colorClass}
            strokeDasharray={`${score}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
        <span className="text-[10px] font-bold text-white z-10">{score}</span>
      </div>
      <span className={`text-xs font-medium px-2 py-0.5 rounded border border-dark-600 bg-dark-700/50 ${textClass}`}>
        {level}
      </span>
    </div>
  );
};

const AllPublishers = () => {
  const [publishers, setPublishers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [selectedPub, setSelectedPub] = useState(null);
  const [pubStats, setPubStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState('');

  // Custom Confirm Modal State
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: '', id: null, title: '', message: '' });
  
  // Custom Toast Notification State
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const limit = 10;

  const fetchPublishers = async (page) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(`/admin/publishers?page=${page}&limit=${limit}&status=approved`);
      if (res.success) {
        setPublishers(res.data.publishers || []);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    if (!pagination) return [];
    const total = pagination.totalPages;
    const current = pagination.currentPage;
    const pages = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }
    return pages;
  };

  const openModal = async (pub) => {
    setSelectedPub(pub);
    setPubStats(null);
    setStatsLoading(true);
    try {
      const res = await apiFetch(`/admin/publishers/${pub._id}/stats`);
      if (res.success) {
        setPubStats(res.data);
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedPub(null);
    setPubStats(null);
  };

  const handleSendWarning = async (id) => {
    setActionLoading('warning');
    try {
      const res = await apiFetch(`/admin/publishers/${id}/warning`, { method: 'POST' });
      if (res.success) {
        showNotification("Warning email sent successfully.", 'success');
      } else {
        showNotification(res.error || res.message || "Failed to send warning.", 'error');
      }
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setActionLoading('');
      setConfirmDialog({ isOpen: false, type: '', id: null, title: '', message: '' });
    }
  };

  const handleToggleSuspension = async (id) => {
    setActionLoading('suspension');
    try {
      const res = await apiFetch(`/admin/publishers/${id}/toggle-suspension`, { method: 'POST' });
      if (res.success) {
        // Find current status before toggling
        const currentPub = publishers.find(p => p._id === id) || selectedPub;
        const currentStatus = currentPub ? currentPub.isSuspended : false;
        
        const newStatus = res.data?.isSuspended ?? !currentStatus;
        setPublishers(prev => prev.map(p => p._id === id ? { ...p, isSuspended: newStatus } : p));
        if (selectedPub && selectedPub._id === id) {
          setSelectedPub({ ...selectedPub, isSuspended: newStatus });
        }
        showNotification(res.message || "Status updated successfully.", 'success');
      } else {
        showNotification(res.error || res.message || "Failed to update status.", 'error');
      }
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setActionLoading('');
      setConfirmDialog({ isOpen: false, type: '', id: null, title: '', message: '' });
    }
  };

  const requestAction = (type, pub) => {
    if (type === 'warning') {
      setConfirmDialog({
        isOpen: true,
        type: 'warning',
        id: pub._id,
        title: 'Send Warning',
        message: `Are you sure you want to send a warning email to ${pub.firstName}?`
      });
    } else if (type === 'suspension') {
      const actionText = pub.isSuspended ? "unsuspend" : "suspend";
      setConfirmDialog({
        isOpen: true,
        type: 'suspension',
        id: pub._id,
        title: `${pub.isSuspended ? 'Unsuspend' : 'Suspend'} Publisher`,
        message: `Are you sure you want to ${actionText} ${pub.firstName}?`
      });
    }
  };

  const confirmAction = () => {
    if (confirmDialog.type === 'warning') handleSendWarning(confirmDialog.id);
    if (confirmDialog.type === 'suspension') handleToggleSuspension(confirmDialog.id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Publisher Management</h1>
          <p className="text-gray-400 text-sm">
            {pagination ? `${pagination.totalDocs} approved publishers` : 'Loading...'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red px-4 py-3 rounded-xl text-sm inline-flex items-center gap-2 w-full">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      <div className="bg-dark-800 rounded-xl border border-dark-600/50 overflow-hidden">
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 size={28} className="text-brand-green animate-spin" />
            <p className="text-gray-500 text-sm">Loading publishers...</p>
          </div>
        )}

        {!loading && !error && publishers.length === 0 && (
          <div className="py-20 text-center">
            <h2 className="text-xl font-bold text-white mb-2">No Publishers Found</h2>
            <p className="text-gray-400">There are no approved publishers to display.</p>
          </div>
        )}

        {!loading && !error && publishers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-dark-600/50 bg-dark-900/50 text-gray-500 font-semibold tracking-wider text-xs">
                  <th className="px-6 py-4 uppercase">Publisher</th>
                  <th className="px-6 py-4 uppercase">Trust Score</th>
                  <th className="px-6 py-4 uppercase">Articles</th>
                  <th className="px-6 py-4 uppercase">Report Rate</th>
                  <th className="px-6 py-4 uppercase">Status</th>
                  <th className="px-6 py-4 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-600/50">
                {publishers.map((pub) => {
                  const initials = `${pub.firstName?.[0] || ''}${pub.lastName?.[0] || ''}`.toUpperCase() || 'P';
                  const fullName = `${pub.firstName || ''} ${pub.lastName || ''}`.trim() || 'Unknown';
                  
                  // Dummy values for future-proofing as requested
                  const dummyTrustScore = 85;
                  const dummyTrustLevel = 'High Trust';
                  const dummyArticles = 0; // The actual value is loaded in stats modal
                  const dummyReportRate = '0.0%';
                  const dummyReportTrend = 'down';

                  return (
                    <tr key={pub._id} className="hover:bg-dark-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-dark-600 text-gray-300 font-bold flex items-center justify-center border border-dark-500">
                            {initials}
                          </div>
                          <div>
                            <p className="text-white font-medium">{fullName}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{pub.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <TrustScoreBadge score={dummyTrustScore} level={dummyTrustLevel} />
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {dummyArticles}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1 ${dummyReportTrend === 'up' ? 'text-brand-red' : 'text-brand-green'}`}>
                          {dummyReportTrend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {dummyReportRate}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {!pub.isSuspended ? (
                          <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-2.5 py-1 rounded-md text-xs font-medium">Active</span>
                        ) : (
                          <span className="bg-brand-red/10 text-brand-red border border-brand-red/20 px-2.5 py-1 rounded-md text-xs font-medium">Suspended</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 text-gray-400">
                          <button 
                            onClick={() => openModal(pub)}
                            className="p-1.5 hover:text-white hover:bg-dark-700 space-x-1 rounded transition-colors flex items-center gap-1"
                          >
                            <Eye size={16} /> View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm">
          <p className="text-gray-500">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className={`p-1.5 rounded-md transition-colors ${
                pagination.hasPrevPage
                  ? 'text-gray-400 hover:text-white hover:bg-dark-700'
                  : 'text-dark-600 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={18} />
            </button>

            {getPageNumbers().map((page, idx) =>
              page === '...' ? (
                <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-gray-500">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-brand-green/20 text-brand-green'
                      : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className={`p-1.5 rounded-md transition-colors ${
                pagination.hasNextPage
                  ? 'text-gray-400 hover:text-white hover:bg-dark-700'
                  : 'text-dark-600 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedPub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-dark-800 rounded-2xl border border-dark-600 w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-dark-600/50 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Publisher Details
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded bg-dark-600 text-gray-300 font-bold flex items-center justify-center border border-dark-500 text-2xl">
                  {`${selectedPub.firstName?.[0] || ''}${selectedPub.lastName?.[0] || ''}`.toUpperCase() || 'P'}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{selectedPub.firstName} {selectedPub.lastName}</h4>
                  <p className="text-gray-400 text-sm">{selectedPub.email}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {selectedPub.city}, {selectedPub.state}
                  </p>
                </div>
              </div>

              {statsLoading ? (
                <div className="py-8 flex flex-col items-center justify-center gap-3">
                  <Loader2 size={24} className="text-brand-green animate-spin" />
                  <p className="text-gray-500 text-sm">Loading statistics...</p>
                </div>
              ) : pubStats ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark-900 border border-dark-600/50 rounded-lg p-4 text-center">
                    <p className="text-gray-400 text-xs mb-1">Total News</p>
                    <p className="text-2xl font-bold text-white">{pubStats.totalNews}</p>
                  </div>
                  <div className="bg-dark-900 border border-dark-600/50 rounded-lg p-4 text-center">
                    <p className="text-gray-400 text-xs mb-1">Reported News</p>
                    <p className="text-2xl font-bold text-brand-red">{pubStats.reportedNewsCount}</p>
                  </div>
                  <div className="bg-dark-900 border border-dark-600/50 rounded-lg p-4 text-center">
                    <p className="text-gray-400 text-xs mb-1">Report Percentage</p>
                    <p className="text-2xl font-bold text-white">{pubStats.reportPercentage}%</p>
                  </div>
                  <div className="bg-dark-900 border border-dark-600/50 rounded-lg p-4 text-center">
                    <p className="text-gray-400 text-xs mb-1">Join Date</p>
                    <p className="text-lg font-bold text-white mt-1">
                      {new Date(pubStats.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                  {pubStats.joinedMediaHouses?.length > 0 && (
                    <div className="col-span-2 bg-dark-900 border border-dark-600/50 rounded-lg p-4">
                       <p className="text-gray-400 text-xs mb-2">Media Houses</p>
                       <div className="flex flex-wrap gap-2">
                         {pubStats.joinedMediaHouses.map((mh, idx) => (
                           <span key={idx} className="bg-dark-700 text-gray-300 text-xs px-2 py-1 rounded border border-dark-600/50">
                             {mh}
                           </span>
                         ))}
                       </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center text-brand-red text-sm">Failed to load statistics.</div>
              )}
            </div>
            
            <div className="p-6 bg-dark-900/50 border-t border-dark-600/50 flex gap-3">
              <button
                onClick={() => requestAction('warning', selectedPub)}
                disabled={actionLoading !== ''}
                className="flex-1 px-4 py-2 text-sm font-medium text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/20 rounded-lg hover:bg-brand-yellow/20 transition-colors flex items-center justify-center gap-2"
              >
                {actionLoading === 'warning' ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                Send Warning
              </button>
              
              <button
                onClick={() => requestAction('suspension', selectedPub)}
                disabled={actionLoading !== ''}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  selectedPub.isSuspended 
                    ? 'text-brand-green bg-brand-green/10 border border-brand-green/20 hover:bg-brand-green/20' 
                    : 'text-brand-red bg-brand-red/10 border border-brand-red/20 hover:bg-brand-red/20'
                }`}
              >
                {actionLoading === 'suspension' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : selectedPub.isSuspended ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Ban size={16} />
                )}
                {selectedPub.isSuspended ? 'Unsuspend' : 'Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirm Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-dark-800 rounded-xl border border-dark-600 w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-dark-600/50">
              <h3 className="text-lg font-bold text-white">{confirmDialog.title}</h3>
            </div>
            <div className="p-5">
              <p className="text-gray-300 text-sm">{confirmDialog.message}</p>
            </div>
            <div className="p-5 bg-dark-900/50 border-t border-dark-600/50 flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDialog({ isOpen: false, type: '', id: null, title: '', message: '' })}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={actionLoading !== ''}
                className="px-4 py-2 bg-brand-green text-dark-900 text-sm font-bold rounded-lg hover:bg-brand-green/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading !== '' ? <Loader2 size={16} className="animate-spin" /> : null}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast Notification */}
      {notification.show && (
        <div className={`fixed bottom-6 right-6 z-[70] px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in text-sm font-medium ${
          notification.type === 'success' 
            ? 'bg-brand-green/20 text-brand-green border border-brand-green/30 backdrop-blur-md' 
            : 'bg-brand-red/20 text-brand-red border border-brand-red/30 backdrop-blur-md'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default AllPublishers;
