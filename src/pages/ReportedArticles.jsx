import { useState, useEffect } from 'react';
import { Eye, CheckCircle2, AlertTriangle, Trash2, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import apiFetch from '../services/api';
import { useAppContext } from '../context/AppContext';

const ReportedArticles = () => {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [actionLoading, setActionLoading] = useState(null);
  
  const { setPendingReports } = useAppContext();

  // Modal state
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [articleDetails, setArticleDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const limit = 10;

  const fetchReportedArticles = async (page) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(`/admin/news/reported?page=${page}&limit=${limit}&minReports=0`);
      if (res.success) {
        setArticles(res.data.news || []);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedArticles(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this news and reset its reports?")) return;

    setActionLoading(id);
    try {
      const res = await apiFetch(`/admin/news/${id}/review-report`, {
        method: 'POST',
        body: JSON.stringify({ action: "reset_reports" })
      });
      if (res.success) {
        setArticles(prev => prev.filter(a => a._id !== id));
        setPagination(prev => prev ? { ...prev, totalDocs: Math.max(0, prev.totalDocs - 1) } : prev);
        setPendingReports(prev => Math.max(0, prev - 1));
      } else {
        alert(res.error || res.message);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this news article?")) return;

    setActionLoading(id);
    try {
      const res = await apiFetch(`/news/${id}`, {
        method: 'DELETE'
      });
      if (res.success) {
        setArticles(prev => prev.filter(a => a._id !== id));
        setPagination(prev => prev ? { ...prev, totalDocs: Math.max(0, prev.totalDocs - 1) } : prev);
        setPendingReports(prev => Math.max(0, prev - 1));
      } else {
        alert(res.error || res.message);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const openDetailsModal = async (id) => {
    setSelectedArticleId(id);
    setDetailsLoading(true);
    setArticleDetails(null);
    try {
      const res = await apiFetch(`/admin/news/reported/${id}`);
      if (res.success) {
        setArticleDetails(res.data);
      } else {
        alert(res.error || res.message);
        setSelectedArticleId(null);
      }
    } catch (err) {
      alert(err.message);
      setSelectedArticleId(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetailsModal = () => {
    setSelectedArticleId(null);
    setArticleDetails(null);
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

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">Reported Articles</h1>
            {!loading && pagination && (
              <span className="bg-brand-red text-white px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
                {pagination.totalDocs} reported
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm">Review and moderate reported content</p>
        </div>
      </div>

      {error && (
        <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red px-4 py-3 rounded-xl text-sm inline-flex items-center gap-2 w-full">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {loading && (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 size={28} className="text-brand-green animate-spin" />
          <p className="text-gray-500 text-sm">Loading reported articles...</p>
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-12 text-center">
          <CheckCircle2 size={48} className="text-brand-green mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-white mb-2">No reported articles</h2>
          <p className="text-gray-400">All caught up! There is no content pending moderation.</p>
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <div className="space-y-4">
          {articles.map((item) => {
            const isLoading = actionLoading === item._id;

            return (
              <div key={item._id} className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 flex justify-between items-start hover:border-dark-500 transition-colors">
                <div className="flex-1 pr-8">
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mb-3">
                    <span className="bg-brand-red text-white px-1.5 py-0.5 rounded font-bold">
                      {item.reportCount} REPORTS
                    </span>
                    <span className="bg-dark-700 px-2 py-0.5 rounded border border-dark-600/50">{item.topic || 'No Topic'}</span>
                    <span>•</span>
                    <span>{new Date(item.publishedTime || item.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1.5">{item.headline}</h3>
                  <p className="text-sm text-gray-400 mb-4">{item.publisher} · {item.mediaHouse}</p>

                  {item.aiSummary && (
                    <div className="flex items-start gap-2 bg-brand-green/5 border border-brand-green/10 rounded-lg p-3 mb-4 text-sm">
                      <AlertTriangle size={16} className="text-brand-green shrink-0 mt-0.5" />
                      <p className="text-gray-300">
                        <span className="text-brand-green font-semibold">AI Summary:</span> {item.aiSummary}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    {item.keywords && item.keywords.map((tag, i) => (
                      <span key={i} className="bg-dark-700/50 text-gray-400 text-xs px-2.5 py-1 rounded border border-dark-600/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-32 shrink-0">
                  <button
                    onClick={() => openDetailsModal(item._id)}
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-md text-sm font-medium transition-colors border border-dark-600"
                  >
                    <Eye size={14} /> View
                  </button>
                  <button
                    onClick={() => handleApprove(item._id)}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-brand-green/10 hover:bg-brand-green/20 text-brand-green rounded-md text-sm font-medium transition-colors border border-brand-green/20 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                    Approve
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-brand-red/10 hover:bg-brand-red/20 text-brand-red rounded-md text-sm font-medium transition-colors border border-brand-red/20 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    Delete
                  </button>
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
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className={`p-1.5 rounded-md transition-colors ${pagination.hasPrevPage
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
                  className={`w-8 h-8 flex items-center justify-center rounded-md font-medium transition-colors ${page === currentPage
                      ? 'bg-brand-red/20 text-brand-red'
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
              className={`p-1.5 rounded-md transition-colors ${pagination.hasNextPage
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
      {selectedArticleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-dark-800 rounded-2xl border border-dark-600 w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-dark-600/50 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="text-brand-yellow" size={20} />
                Report Details
              </h3>
              <button
                onClick={closeDetailsModal}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {detailsLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <Loader2 size={24} className="text-brand-green animate-spin" />
                  <p className="text-gray-500 text-sm">Loading details...</p>
                </div>
              ) : articleDetails ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-bold text-lg mb-2">{articleDetails.news?.headline}</h4>
                    <p className="text-gray-400 text-sm mb-4">{articleDetails.news?.summary}</p>
                    <div className="flex gap-4 text-xs text-gray-500 bg-dark-900/50 p-3 rounded-lg border border-dark-600/50">
                      <div><span className="text-gray-400">Total Reports:</span> <span className="text-brand-red font-bold">{articleDetails.totalReports}</span></div>
                      <div><span className="text-gray-400">Publisher:</span> {articleDetails.news?.publisher}</div>
                      <div><span className="text-gray-400">Topic:</span> {articleDetails.news?.topic}</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-white font-medium text-sm mb-3 border-b border-dark-600/50 pb-2">Reporters</h5>
                    {articleDetails.reporters?.length > 0 ? (
                      <div className="space-y-3">
                        {articleDetails.reporters.map((reporter, idx) => (
                          <div key={idx} className="bg-dark-900 border border-dark-600/50 rounded-lg p-3 flex justify-between items-center">
                            <div>
                              <p className="text-gray-300 text-sm font-medium">
                                {reporter.user?.firstName} {reporter.user?.lastName}
                              </p>
                              <p className="text-gray-500 text-xs">{reporter.user?.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400 text-xs">{new Date(reporter.reportedAt).toLocaleDateString()}</p>
                              <p className="text-gray-500 text-[10px]">{new Date(reporter.reportedAt).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">No detailed reporter information available.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-brand-red">Failed to load details.</div>
              )}
            </div>

            <div className="p-6 bg-dark-900/50 border-t border-dark-600/50 flex gap-3 justify-end shrink-0">
              <button
                onClick={closeDetailsModal}
                className="px-4 py-2 text-sm font-medium text-white bg-dark-700 border border-dark-600 rounded-lg hover:bg-dark-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportedArticles;
