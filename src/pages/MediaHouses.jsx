import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Lock, Unlock, Mail, MapPin, Users as UsersIcon, Loader2 } from 'lucide-react';
import apiFetch from '../services/api';

const backendUrl = 'https://newsapi.dextora.org/api';

const getLogoUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${backendUrl}${url}`;
};

const MediaHouses = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [expandedId, setExpandedId] = useState(null);
  const [houseDetails, setHouseDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [suspensionLoading, setSuspensionLoading] = useState(null);

  const fetchMediaHouses = async (page) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(`/admin/media-houses?page=${page}&limit=${limit}`);
      if (res.success) {
        setHouses(res.data.mediaHouses || []);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaHouses(currentPage);
  }, [currentPage]);

  const toggleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    
    setExpandedId(id);
    
    if (!houseDetails[id]) {
      setDetailsLoading(true);
      try {
        const res = await apiFetch(`/admin/media-houses/${id}`);
        if (res.success) {
          setHouseDetails(prev => ({ ...prev, [id]: res.data }));
        }
      } catch (err) {
        console.error("Failed to load details", err);
      } finally {
        setDetailsLoading(false);
      }
    }
  };

  const handleToggleSuspension = async (id, e) => {
    e.stopPropagation();
    setSuspensionLoading(id);
    try {
      const res = await apiFetch(`/admin/media-houses/${id}/toggle-suspension`, {
        method: 'POST'
      });
      if (res.success) {
        setHouseDetails(prev => {
          if (!prev[id]) return prev;
          return {
            ...prev,
            [id]: {
              ...prev[id],
              isSuspended: res.data.isSuspended
            }
          };
        });
      } else {
        alert(res.message || res.error);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSuspensionLoading(null);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      setCurrentPage(page);
      setExpandedId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Media Houses</h1>
        <p className="text-gray-400 text-sm">
          {pagination?.totalDocs || 0} registered media organizations
        </p>
      </div>

      {error && (
        <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red p-4 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-brand-green" size={32} />
        </div>
      ) : houses.length === 0 ? (
        <div className="bg-dark-800 rounded-xl p-8 text-center text-gray-400 border border-dark-600/50">
          No media houses found.
        </div>
      ) : (
        <div className="space-y-4">
          {houses.map((house) => {
            const isExpanded = expandedId === house._id;
            const details = houseDetails[house._id];
            const logo = getLogoUrl(house.logoUrl);

            return (
              <div key={house._id} className="bg-dark-800 rounded-xl border border-dark-600/50 overflow-hidden transition-all duration-200 hover:border-dark-500">
                {/* Header row */}
                <div 
                  className="p-6 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpand(house._id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-dark-600/50 text-brand-green font-bold text-xl flex items-center justify-center border border-dark-500 shadow-inner overflow-hidden">
                      {logo ? (
                        <img src={logo} alt={house.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{house.name?.substring(0, 2).toUpperCase() || 'MH'}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-white">{house.name}</h3>
                        {details?.isSuspended && (
                          <span className="bg-brand-red/10 text-brand-red px-2 py-0.5 rounded text-xs font-bold border border-brand-red/20">Suspended</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        Owner: {house.ownerName || 'Unknown'} 
                        {house.location && ` · ${house.location}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-white font-bold text-lg leading-tight">{house.numberOfArticles}</p>
                      <p className="text-gray-500 text-xs">Articles</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold text-lg leading-tight">{house.numberOfMembers}</p>
                      <p className="text-gray-500 text-xs">Members</p>
                    </div>
                    <div className="text-gray-500 pl-4">
                      {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </div>
                </div>

                {/* Expanded Content Area */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-dark-600/50 bg-dark-900/30 pt-6">
                    {detailsLoading ? (
                       <div className="flex justify-center py-10"><Loader2 className="animate-spin text-brand-green" size={24} /></div>
                    ) : details ? (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          
                          {/* Details & Contact */}
                          <div className="bg-dark-900 rounded-xl p-5 border border-dark-600/50">
                            <h4 className="text-white font-bold text-sm mb-4">About & Contact</h4>
                            <div className="space-y-3">
                              {details.description && <p className="text-sm text-gray-300 mb-4">{details.description}</p>}
                              
                              {details.email && (
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                  <Mail size={16} className="text-brand-green" />
                                  <span>{details.email}</span>
                                </div>
                              )}
                              
                              {details.location && (
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                  <MapPin size={16} className="text-brand-green" />
                                  <span>{details.location}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-3 text-sm text-gray-400">
                                <UsersIcon size={16} className="text-brand-green" />
                                <span>{details.members?.length || 0} Total Members</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Members List */}
                          <div className="bg-dark-900 rounded-xl p-5 border border-dark-600/50 max-h-64 overflow-y-auto custom-scrollbar">
                            <h4 className="text-white font-bold text-sm mb-4">Team Members</h4>
                            {details.members && details.members.length > 0 ? (
                              <div className="space-y-3">
                                {details.members.map((member, idx) => (
                                  <div key={member.id || idx} className="flex items-center justify-between text-sm p-3 bg-dark-800 rounded-lg border border-dark-600/50">
                                    <div>
                                      <div className="text-white font-medium">{member.name}</div>
                                      <div className="text-gray-500 text-xs">{member.email}</div>
                                      {member.mobileNumber && <div className="text-gray-500 text-xs">{member.mobileNumber}</div>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">No members found.</p>
                            )}
                          </div>
                          
                        </div>
                        
                        {/* Actions */}
                        <div className="flex justify-end items-center border-t border-dark-600/50 pt-4">
                          <button 
                            onClick={(e) => handleToggleSuspension(house._id, e)}
                            disabled={suspensionLoading === house._id}
                            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors border ${
                              details.isSuspended 
                                ? 'text-brand-green bg-brand-green/10 hover:bg-brand-green/20 border-brand-green/20' 
                                : 'text-brand-red bg-brand-red/10 hover:bg-brand-red/20 border-brand-red/20'
                            } disabled:opacity-50`}
                          >
                            {suspensionLoading === house._id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : details.isSuspended ? (
                              <Unlock size={16} />
                            ) : (
                              <Lock size={16} />
                            )}
                            {details.isSuspended ? 'Lift Suspension' : 'Suspend Media House'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-brand-red">Failed to load details.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-dark-800 p-4 rounded-xl border border-dark-600/50 mt-6">
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
      )}
    </div>
  );
};

export default MediaHouses;
