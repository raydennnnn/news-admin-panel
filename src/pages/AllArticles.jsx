import { useState, useEffect } from 'react';
import { Search, Filter, RefreshCcw, AlertTriangle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import apiFetch from '../services/api';

const AllArticles = () => {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 10;

  const fetchArticles = async (page) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(`/news?page=${page}&limit=${limit}`);
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
    fetchArticles(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Filter articles by search query (client-side for now)
  const filteredArticles = searchQuery.trim()
    ? articles.filter(
        (a) =>
          a.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.publisher?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.mediaHouse?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.topic?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles;

  // Generate page numbers to display
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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">All Articles</h1>
          <p className="text-gray-400 text-sm">
            {pagination ? `${pagination.totalDocs.toLocaleString()} total articles` : 'Loading...'}
          </p>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl border border-dark-600/50 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-dark-600/50 flex items-center justify-between gap-4">
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-dark-600 rounded-md leading-5 bg-dark-900 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-green sm:text-sm"
              placeholder="Search articles, publishers..."
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchArticles(currentPage)}
              className="p-2 border border-dark-600 bg-dark-900 text-gray-400 hover:text-white hover:bg-dark-700 rounded-md transition-colors"
              title="Refresh"
            >
              <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-6 text-center">
            <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red px-4 py-3 rounded-xl text-sm inline-flex items-center gap-2">
              <AlertTriangle size={16} />
              {error}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 size={28} className="text-brand-green animate-spin" />
            <p className="text-gray-500 text-sm">Fetching articles...</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-dark-600/50 bg-dark-900/50 text-gray-500 font-semibold tracking-wider text-xs">
                  <th className="px-6 py-4 uppercase">Title</th>
                  <th className="px-6 py-4 uppercase">Media House</th>
                  <th className="px-6 py-4 uppercase">Publisher</th>
                  <th className="px-6 py-4 uppercase">Topic</th>
                  <th className="px-6 py-4 uppercase">Views</th>
                  <th className="px-6 py-4 uppercase">Reports</th>
                  <th className="px-6 py-4 uppercase">Comments</th>
                  <th className="px-6 py-4 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-600/50">
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No articles found.
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-dark-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-white font-medium max-w-[350px] truncate" title={article.headline}>
                          {article.headline}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-300">{article.mediaHouse || '—'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-400">{article.publisher || '—'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-dark-600/30 text-gray-400 px-2.5 py-1 rounded-md text-xs border border-dark-600">
                          {article.topic || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {(article.viewCount ?? 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {article.reportCount > 0 ? (
                          <div className={`flex items-center gap-1.5 font-medium text-sm ${
                            article.reportCount >= 5 ? 'text-brand-red' : 'text-brand-yellow'
                          }`}>
                            <AlertTriangle size={14} />
                            <span>{article.reportCount}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">0</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {(article.commentCount ?? 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {formatDate(article.publishedTime || article.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination && (
          <div className="p-4 border-t border-dark-600/50 bg-dark-900/50 flex items-center justify-between text-sm">
            <p className="text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages} · {pagination.totalDocs.toLocaleString()} articles
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
      </div>
    </div>
  );
};

export default AllArticles;
