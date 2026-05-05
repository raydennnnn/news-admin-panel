import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, FileText, ChevronLeft, ChevronRight, Loader2, AlertTriangle, Eye, X } from 'lucide-react';
import apiFetch from '../services/api';
import { useAppContext } from '../context/AppContext';

const VerificationQueue = () => {
  const [verifications, setVerifications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ pendingCount: 0, verifiedThisWeek: 0, rejectedThisWeek: 0 });
  const { setPendingVerifications } = useAppContext();

  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  
  const [selectedDoc, setSelectedDoc] = useState(null);

  const limit = 20;

  const fetchVerifications = async (page) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(`/users/publisher-verifications?status=pending&page=${page}&limit=${limit}`);
      if (res.success) {
        setVerifications(res.data.verifications || []);
        setPagination(res.data.pagination);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      setCurrentPage(page);
      setExpandedId(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const res = await apiFetch(`/users/publisher-verification/${id}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'approved' })
      });
      if (res.success) {
        setVerifications(v => v.filter(item => item._id !== id));
        if (res.data?.stats || res.stats) {
          const newStats = res.data?.stats || res.stats;
          setStats(newStats);
          setPendingVerifications(newStats.pendingCount);
        }
      } else {
        alert(res.error || res.message);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const submitReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) return;
    
    setActionLoading(rejectingId);
    try {
      const res = await apiFetch(`/users/publisher-verification/${rejectingId}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'rejected', rejectionReason })
      });
      if (res.success) {
        setVerifications(v => v.filter(item => item._id !== rejectingId));
        setRejectingId(null);
        setRejectionReason('');
        if (res.data?.stats || res.stats) {
          const newStats = res.data?.stats || res.stats;
          setStats(newStats);
          setPendingVerifications(newStats.pendingCount);
        }
      } else {
        alert(res.error || res.message);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (id) => {
    setRejectingId(id);
    setRejectionReason('');
  };

  const getDocUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `https://newsapi.dextora.org/${path.replace(/^\//, '')}`;
  };

  const getPageNumbers = () => {
    if (!pagination) return [];
    const total = pagination.totalPages;
    const current = pagination.page;
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">Verification Queue</h1>
            {!loading && (
              <span className="bg-brand-yellow/20 text-brand-yellow px-2.5 py-0.5 rounded-full text-xs font-bold border border-brand-yellow/30">
                {stats.pendingCount} pending
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm">Review and verify publisher applications</p>
        </div>
        {!loading && (
          <div className="bg-dark-800 border border-dark-600 rounded-full px-4 py-1.5 flex items-center gap-2 text-sm text-gray-400 hidden sm:flex">
            <span>⏱</span> Avg. review time: 2.3 days
          </div>
        )}
      </div>

      {/* KPI Stats */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
            <h2 className="text-4xl font-bold text-brand-yellow mb-2">{stats.pendingCount}</h2>
            <p className="text-gray-400 text-sm">In Queue</p>
          </div>
          <div className="bg-dark-800 rounded-xl border border-brand-green/30 p-6 shadow-sm bg-gradient-to-b from-dark-800 to-brand-green/5">
            <h2 className="text-4xl font-bold text-brand-green mb-2">{stats.verifiedThisWeek}</h2>
            <p className="text-gray-400 text-sm">Approved This Week</p>
          </div>
          <div className="bg-dark-800 rounded-xl border border-brand-red/30 p-6 shadow-sm bg-gradient-to-b from-dark-800 to-brand-red/5">
            <h2 className="text-4xl font-bold text-brand-red mb-2">{stats.rejectedThisWeek}</h2>
            <p className="text-gray-400 text-sm">Rejected This Week</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red px-4 py-3 rounded-xl text-sm inline-flex items-center gap-2 w-full">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {loading && (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 size={28} className="text-brand-green animate-spin" />
          <p className="text-gray-500 text-sm">Loading queue...</p>
        </div>
      )}

      {!loading && !error && verifications.length === 0 && (
        <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-12 text-center">
          <CheckCircle2 size={48} className="text-brand-green mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-white mb-2">You're all caught up!</h2>
          <p className="text-gray-400">There are no pending publisher verifications right now.</p>
        </div>
      )}

      {!loading && !error && verifications.length > 0 && (
        <div className="space-y-4">
          {verifications.map((item) => {
            const isExpanded = expandedId === item._id;
            const isLoading = actionLoading === item._id;
            const name = `${item.user?.firstName || ''} ${item.user?.lastName || ''}`.trim() || 'Unknown User';
            const initials = `${item.user?.firstName?.[0] || ''}${item.user?.lastName?.[0] || ''}`.toUpperCase() || 'U';

            return (
              <div 
                key={item._id}
                className={`bg-dark-800 rounded-xl border transition-all ${
                  isExpanded ? 'border-brand-green/30 shadow-lg relative' : 'border-dark-600/50 hover:border-dark-500 cursor-pointer'
                }`}
                onClick={() => !isExpanded && setExpandedId(item._id)}
              >
                {isExpanded && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-green rounded-l-xl"></div>}
                
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded bg-dark-600 text-white font-bold flex items-center justify-center border border-dark-500 text-lg">
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-white">{name}</h3>
                          <span className="bg-brand-yellow/20 text-brand-yellow px-2 py-0.5 rounded text-xs font-bold border border-brand-yellow/30">
                            Pending Review
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{item.user?.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Applied {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {!isExpanded && (
                      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-md text-sm font-medium transition-colors border border-dark-600">
                        <Eye size={16} /> Review
                      </button>
                    )}
                    {isExpanded && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setExpandedId(null); }}
                        className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-md transition-colors"
                      >
                        <ChevronLeft size={20} className="rotate-90" />
                      </button>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-dark-600/50 animate-fade-in cursor-default" onClick={e => e.stopPropagation()}>
                      <h4 className="text-white flex items-center gap-2 font-medium text-sm mb-4">
                        <FileText size={16} className="text-gray-500" /> Submitted Documents
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {[
                          { title: "Government ID", url: item.governmentId },
                          { title: "Press Card", url: item.pressCard },
                          { title: "Selfie", url: item.selfie }
                        ].map((doc, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setSelectedDoc(getDocUrl(doc.url))}
                            className="bg-dark-900 border border-dark-600/50 rounded-lg p-3 hover:border-brand-green/50 hover:bg-brand-green/5 cursor-pointer transition-colors group"
                          >
                            <p className="text-gray-400 text-xs mb-2">{doc.title}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm truncate pr-2 group-hover:text-brand-green">View Document</span>
                              <Eye size={14} className="text-gray-500 group-hover:text-brand-green" />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        <button 
                          onClick={() => handleApprove(item._id)}
                          disabled={isLoading}
                          className="flex-1 bg-brand-green/20 hover:bg-brand-green/30 text-brand-green py-3 rounded-lg font-bold flex justify-center items-center gap-2 border border-brand-green/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                          {isLoading ? 'Approving...' : 'Approve Publisher'}
                        </button>
                        <button 
                          onClick={() => openRejectModal(item._id)}
                          disabled={isLoading}
                          className="flex-1 bg-brand-red/10 hover:bg-brand-red/20 text-brand-red py-3 rounded-lg font-bold flex justify-center items-center gap-2 border border-brand-red/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle size={18} /> Reject Application
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm">
          <p className="text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-md transition-colors ${
                currentPage > 1
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
              disabled={currentPage === pagination.totalPages}
              className={`p-1.5 rounded-md transition-colors ${
                currentPage < pagination.totalPages
                  ? 'text-gray-400 hover:text-white hover:bg-dark-700'
                  : 'text-dark-600 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-dark-800 rounded-2xl border border-dark-600 w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-dark-600/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <XCircle className="text-brand-red" size={20} />
                Reject Application
              </h3>
              <button 
                onClick={() => setRejectingId(null)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={submitReject}>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-300">
                  Please provide a reason for rejecting this application. This will be visible to the user.
                </p>
                <div>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    placeholder="e.g., Documents are blurry, ID is expired..."
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-red resize-none text-sm"
                    autoFocus
                  />
                </div>
              </div>
              <div className="p-6 bg-dark-900/50 border-t border-dark-600/50 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setRejectingId(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!rejectionReason.trim() || actionLoading === rejectingId}
                  className="px-4 py-2 bg-brand-red text-white text-sm font-bold rounded-lg hover:bg-brand-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {actionLoading === rejectingId && <Loader2 size={16} className="animate-spin" />}
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedDoc(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-gray-300 bg-dark-800/50 p-2 rounded-full"
              onClick={() => setSelectedDoc(null)}
            >
              <X size={24} />
            </button>
            <div className="bg-dark-900 rounded-lg overflow-hidden border border-dark-600">
              <img 
                src={selectedDoc} 
                alt="Document View" 
                className="max-w-full max-h-[85vh] object-contain"
                onClick={e => e.stopPropagation()}
              />
            </div>
            <div className="mt-4 flex gap-4">
              <a 
                href={selectedDoc} 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 bg-dark-800 text-white text-sm font-medium rounded-lg hover:bg-dark-700 transition-colors border border-dark-600"
                onClick={e => e.stopPropagation()}
              >
                Open in New Tab
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationQueue;
