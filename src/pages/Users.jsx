import { Search, Eye, Shield, MoreHorizontal, AlertTriangle } from 'lucide-react';

const usersData = [
  {
    id: 1, avatar: 'JM', name: 'John Martinez', email: 'john.m@email.com',
    role: 'Reader', riskLevel: 'Low Risk', reports: 2, comments: 145, status: 'Active'
  },
  {
    id: 2, avatar: 'BA', name: 'Bot Account #4421', email: 'bot4421@temp.io',
    role: 'Reader', riskLevel: 'High Risk', reports: 89, comments: 2341, status: 'Suspended'
  },
  {
    id: 3, avatar: 'FH', name: 'Fatima Al-Hassan', email: 'fatima.h@email.com',
    role: 'Contributor', riskLevel: 'Low Risk', reports: 1, comments: 78, status: 'Active'
  },
  {
    id: 4, avatar: 'SK', name: 'SpamKing2026', email: 'spam@fastmail.cc',
    role: 'Reader', riskLevel: 'High Risk', reports: 124, comments: 3200, status: 'Banned'
  },
  {
    id: 5, avatar: 'WZ', name: 'Dr. Wei Zhang', email: 'wei.zhang@university.edu',
    role: 'Editor', riskLevel: 'Low Risk', reports: 0, comments: 34, status: 'Active'
  },
  {
    id: 6, avatar: 'NH', name: 'NewsHater99', email: 'hater99@proton.me',
    role: 'Reader', riskLevel: 'Medium Risk', reports: 34, comments: 567, status: 'Active'
  },
  {
    id: 7, avatar: 'AD', name: 'Amara Diallo', email: 'amara.d@gmail.com',
    role: 'Contributor', riskLevel: 'Low Risk', reports: 3, comments: 230, status: 'Active'
  },
  {
    id: 8, avatar: 'TM', name: 'TrollMaster', email: 'troll@anon.com',
    role: 'Reader', riskLevel: 'High Risk', reports: 67, comments: 1890, status: 'Suspended'
  },
  {
    id: 9, avatar: 'SL', name: 'Sophie Laurent', email: 'sophie.l@media.fr',
    role: 'Editor', riskLevel: 'Low Risk', reports: 0, comments: 89, status: 'Active'
  },
  {
    id: 10, avatar: 'AU', name: 'Anonymous User', email: 'anon123@temp.com',
    role: 'Reader', riskLevel: 'Medium Risk', reports: 18, comments: 445, status: 'Active'
  }
];

const RiskBadge = ({ risk }) => {
  if (risk === 'High Risk') return (
    <span className="flex items-center gap-1.5 bg-brand-red/10 text-brand-red px-2 py-0.5 rounded-full text-xs font-medium border border-brand-red/20 w-fit"><div className="w-2 h-2 rounded-full bg-brand-red"></div>High Risk</span>
  );
  if (risk === 'Medium Risk') return (
    <span className="flex items-center gap-1.5 bg-brand-yellow/10 text-brand-yellow px-2 py-0.5 rounded-full text-xs font-medium border border-brand-yellow/20 w-fit"><div className="w-2 h-2 rounded-full bg-brand-yellow"></div>Medium Risk</span>
  );
  return (
    <span className="flex items-center gap-1.5 bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full text-xs font-medium border border-brand-green/20 w-fit"><div className="w-2 h-2 rounded-full bg-brand-green"></div>Low Risk</span>
  );
};

const Users = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">User Management</h1>
          <p className="text-gray-400 text-sm">10 users · 3 high-risk</p>
        </div>
        <div className="flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 px-4 py-2 rounded-lg text-brand-red text-sm font-bold">
          <AlertTriangle size={16} />
          3 High Risk Users
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl border border-dark-600/50 overflow-hidden">
        {/* Filters and Search Bar */}
        <div className="p-4 border-b border-dark-600/50 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-3 py-2 border border-dark-600 rounded-md leading-5 bg-dark-900 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-green sm:text-sm"
              placeholder="Search users..."
            />
          </div>
          
          <div className="flex items-center gap-1 text-sm bg-dark-900 border border-dark-600 rounded-md p-1 overflow-x-auto">
            <button className="bg-dark-700 text-gray-300 px-3 py-1 rounded shadow-sm text-xs font-medium border border-dark-600">All</button>
            <button className="text-gray-400 hover:text-white px-3 py-1 rounded text-xs font-medium">Active</button>
            <button className="text-gray-400 hover:text-white px-3 py-1 rounded text-xs font-medium">Suspended</button>
            <button className="text-gray-400 hover:text-white px-3 py-1 rounded text-xs font-medium mr-2">Banned</button>
            
            <div className="h-4 w-px bg-dark-600 mx-1"></div>
            
            <button className="text-gray-400 hover:text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-red"></div>High Risk</button>
            <button className="text-gray-400 hover:text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-yellow"></div>Medium</button>
            <button className="text-gray-400 hover:text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5 mr-2"><div className="w-2 h-2 rounded-full bg-brand-green"></div>Low Risk</button>
            
            <div className="h-4 w-px bg-dark-600 mx-1"></div>

            <button className="text-gray-400 hover:text-white px-3 py-1 rounded text-xs font-medium">Reader</button>
            <button className="text-gray-400 hover:text-white px-3 py-1 rounded text-xs font-medium">Contributor</button>
            <button className="text-gray-400 hover:text-white px-3 py-1 rounded text-xs font-medium">Editor</button>
          </div>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-dark-600/50 bg-dark-900/50 text-gray-500 font-semibold tracking-wider text-[11px]">
                <th className="px-6 py-4 uppercase">User</th>
                <th className="px-6 py-4 uppercase">Role</th>
                <th className="px-6 py-4 uppercase">Risk Level</th>
                <th className="px-6 py-4 uppercase">Reports</th>
                <th className="px-6 py-4 uppercase">Comments</th>
                <th className="px-6 py-4 uppercase">Status</th>
                <th className="px-6 py-4 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-600/50">
              {usersData.map((user) => (
                <tr key={user.id} className="hover:bg-dark-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded text-white font-bold flex items-center justify-center border border-dark-500 ${user.riskLevel === 'High Risk' ? 'bg-brand-red/80' : 'bg-dark-600'}`}>
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-dark-900 border border-dark-600 text-gray-300 px-2 py-1 rounded text-xs">{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <RiskBadge risk={user.riskLevel} />
                  </td>
                  <td className="px-6 py-4">
                    {user.reports > 20 ? (
                      <div className="flex items-center gap-1.5 text-brand-yellow font-bold">
                        <AlertTriangle size={14} /> {user.reports}
                      </div>
                    ) : (
                      <span className="text-gray-300">{user.reports}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={user.comments > 1000 ? "text-brand-red font-bold" : "text-gray-300"}>
                      {user.comments.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.status === 'Active' && <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-2.5 py-1 rounded-md text-xs font-medium">Active</span>}
                    {user.status === 'Suspended' && <span className="bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20 px-2.5 py-1 rounded-md text-xs font-medium">Suspended</span>}
                    {user.status === 'Banned' && <span className="bg-brand-red/10 text-brand-red border border-brand-red/20 px-2.5 py-1 rounded-md text-xs font-medium">Banned</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-gray-400">
                      <button className="p-1.5 hover:text-white hover:bg-dark-700 space-x-1 rounded transition-colors"><Eye size={16} /></button>
                      <button className="p-1.5 hover:text-white hover:bg-dark-700 space-x-1 rounded transition-colors"><Shield size={16} /></button>
                      <button className="p-1.5 hover:text-white hover:bg-dark-700 space-x-1 rounded transition-colors"><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
