import { Search } from 'lucide-react';

const auditData = [
  {
    id: 1, timestamp: '2026-04-05 09:15:32', adminName: 'Admin Alex', adminRole: 'Super Admin',
    action: 'Article Removed', target: '10 Cryptocurrency Scams...', type: 'Article', severity: 'Critical'
  },
  {
    id: 2, timestamp: '2026-04-05 09:10:15', adminName: 'Admin Lisa', adminRole: 'Moderator',
    action: 'Publisher Suspended', target: 'CryptoKing99', type: 'Publisher', severity: 'Critical'
  },
  {
    id: 3, timestamp: '2026-04-04 16:45:00', adminName: 'Admin Alex', adminRole: 'Super Admin',
    action: 'Article Flagged', target: 'EXCLUSIVE: Government Surveillance', type: 'Article', severity: 'Warning'
  },
  {
    id: 4, timestamp: '2026-04-03 14:00:22', adminName: 'System', adminRole: 'Automated',
    action: 'Report Threshold Alert', target: 'AI Startup Raises $800M...', type: 'Article', severity: 'Warning'
  },
  {
    id: 5, timestamp: '2026-04-03 11:30:44', adminName: 'Admin Lisa', adminRole: 'Moderator',
    action: 'User Banned', target: 'SpamKing2026', type: 'User', severity: 'Critical'
  },
  {
    id: 6, timestamp: '2026-04-02 15:20:10', adminName: 'Admin Raj', adminRole: 'Analyst',
    action: 'Publisher Verified', target: 'Priya Sharma', type: 'Publisher', severity: 'Info'
  },
  {
    id: 7, timestamp: '2026-04-02 10:05:33', adminName: 'Admin Alex', adminRole: 'Super Admin',
    action: 'Topic Reordered', target: 'Technology', type: 'Topic', severity: 'Info'
  },
  {
    id: 8, timestamp: '2026-04-01 19:45:00', adminName: 'Admin Lisa', adminRole: 'Moderator',
    action: 'Comment Removed', target: 'TrollMaster comment on Climate Sum', type: 'Comment', severity: 'Warning'
  },
  {
    id: 9, timestamp: '2026-04-01 02:33:18', adminName: 'System', adminRole: 'Automated',
    action: 'Suspicious Activity Detected', target: 'Bot Account #4421', type: 'User', severity: 'Critical'
  },
  {
    id: 10, timestamp: '2026-03-30 14:00:00', adminName: 'Admin Alex', adminRole: 'Super Admin',
    action: 'Media House Reviewed', target: 'FreePress Independent', type: 'Media House', severity: 'Warning'
  }
];

const getTypeColor = (type) => {
  switch(type) {
    case 'Article': return 'text-blue-400 border-blue-400/20 bg-blue-400/10';
    case 'Publisher': return 'text-brand-yellow border-brand-yellow/20 bg-brand-yellow/10';
    case 'User': return 'text-purple-400 border-purple-400/20 bg-purple-400/10';
    case 'Topic': return 'text-brand-green border-brand-green/20 bg-brand-green/10';
    case 'Comment': return 'text-pink-400 border-pink-400/20 bg-pink-400/10';
    case 'Media House': return 'text-teal-400 border-teal-400/20 bg-teal-400/10';
    default: return 'text-gray-400 border-gray-400/20 bg-gray-400/10';
  }
};

const AuditLogs = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Audit Logs</h1>
          <p className="text-gray-400 text-sm">Complete record of all admin actions · 10 entries</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-green/20 hover:bg-brand-green/30 px-4 py-2 rounded-lg text-brand-green text-sm font-bold border border-brand-green/30 transition-colors">
          Export Logs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
          <h2 className="text-4xl font-bold text-brand-red mb-2">4</h2>
          <p className="text-gray-400 text-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-red"></span>Critical Actions</p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
          <h2 className="text-4xl font-bold text-brand-yellow mb-2">4</h2>
          <p className="text-gray-400 text-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-yellow"></span>Warnings</p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
          <h2 className="text-4xl font-bold text-blue-400 mb-2">2</h2>
          <p className="text-gray-400 text-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400"></span>Info</p>
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
              placeholder="Search logs..."
            />
          </div>
          
          <div className="flex items-center gap-1 text-sm bg-dark-900 border border-dark-600 rounded-md p-1 overflow-x-auto">
            <button className="bg-brand-green/20 text-brand-green px-3 py-1.5 rounded shadow-sm text-xs font-medium">All</button>
            <button className="text-gray-400 hover:text-white px-3 py-1.5 rounded text-xs font-medium">Critical</button>
            <button className="text-gray-400 hover:text-white px-3 py-1.5 rounded text-xs font-medium">Warning</button>
            <button className="text-gray-400 hover:text-white px-3 py-1.5 rounded text-xs font-medium mr-2">Info</button>
            <div className="w-px h-4 bg-dark-600 mx-1"></div>
            <button className="text-gray-400 hover:text-white px-3 py-1.5 rounded text-xs font-medium">Article</button>
            <button className="text-gray-400 hover:text-white px-3 py-1.5 rounded text-xs font-medium">User</button>
            <button className="text-gray-400 hover:text-white px-3 py-1.5 rounded text-xs font-medium">Publisher</button>
            <button className="text-gray-400 hover:text-white px-3 py-1.5 rounded text-xs font-medium">Comment</button>
          </div>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-dark-600/50 bg-dark-900/50 text-gray-500 font-semibold tracking-wider text-[11px]">
                <th className="px-6 py-4 uppercase">Timestamp</th>
                <th className="px-6 py-4 uppercase">Admin</th>
                <th className="px-6 py-4 uppercase">Action</th>
                <th className="px-6 py-4 uppercase">Target</th>
                <th className="px-6 py-4 uppercase">Type</th>
                <th className="px-6 py-4 uppercase text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-600/50">
              {auditData.map((log) => (
                <tr key={log.id} className="hover:bg-dark-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-gray-300">
                      <div>{log.timestamp.split(' ')[0]}</div>
                      <div className="text-xs text-gray-500">{log.timestamp.split(' ')[1]}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{log.adminName}</p>
                      <p className="text-gray-500 text-xs italic">{log.adminRole}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {log.target}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getTypeColor(log.type)}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                      log.severity === 'Critical' ? 'bg-brand-red/10 text-brand-red border-brand-red/20' : 
                      log.severity === 'Warning' ? 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20' : 
                      'bg-blue-400/10 text-blue-400 border-blue-400/20'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        log.severity === 'Critical' ? 'bg-brand-red' : 
                        log.severity === 'Warning' ? 'bg-brand-yellow' : 
                        'bg-blue-400'
                      }`}></div>
                      {log.severity.toLowerCase()}
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

export default AuditLogs;
