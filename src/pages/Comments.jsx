import { Search, Shield, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

const commentsData = [
  {
    id: 1,
    user: '@John Martinez',
    article: 'Global Markets Rally',
    date: '2026-04-04 14:23',
    body: 'Great article, very insightful analysis of the market trends. Well written!',
    status: 'Safe',
    toxicity: 4,
    selected: true,
    reports: 0
  },
  {
    id: 2,
    user: '@TrollMaster',
    article: 'Climate Summit Agreement',
    date: '2026-04-03 22:10',
    body: 'You are all IDIOTS for believing this garbage propaganda! Wake up sheeple!!!',
    status: 'Toxic',
    toxicity: 94,
    selected: false,
    reports: 12
  },
  {
    id: 3,
    user: '@NewsHater99',
    article: 'Government Surveillance',
    date: '2026-04-03 18:45',
    body: 'This journalist should be fired. Completely biased coverage with no balance.',
    status: 'Risky',
    toxicity: 58,
    selected: false,
    reports: 4
  },
  {
    id: 4,
    user: '@Dr. Wei Zhang',
    article: 'Global Markets Rally',
    date: '2026-04-04 09:30',
    body: 'Interesting perspective but I think they missed the economic angle entirely.',
    status: 'Safe',
    toxicity: 12,
    selected: false,
    reports: 0
  },
  {
    id: 5,
    user: '@SpamKing2026',
    article: 'AI Startup Raises $800M',
    date: '2026-04-03 20:00',
    body: 'Check out this amazing investment opportunity! 💰 DM me for 10x returns guaranteed!',
    status: 'Risky',
    toxicity: 72,
    selected: false,
    reports: 28,
    isRemoved: true
  },
  {
    id: 6,
    user: '@Bot Account #4421',
    article: 'Climate Summit Agreement',
    date: '2026-04-04 01:15',
    body: 'I hate everyone who supports this agenda. People like you are destroying society.',
    status: 'Toxic',
    toxicity: 88,
    selected: false,
    reports: 8
  },
  {
    id: 7,
    user: '@Fatima Al-Hassan',
    article: 'AI Startup Raises $800M',
    date: '2026-04-03 16:20',
    body: 'Can anyone fact-check the statistics in paragraph 3? The numbers seem off.',
    status: 'Safe',
    toxicity: 8,
    selected: false,
    reports: 0
  },
  {
    id: 8,
    user: '@Anonymous User',
    article: 'Government Surveillance',
    date: '2026-04-04 11:00',
    body: 'This is clearly fake news. Show me sources or I will report this whole site!',
    status: 'Risky',
    toxicity: 61,
    selected: false,
    reports: 3,
    isWarned: true
  }
];

const Comments = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Comment Moderation</h1>
          <p className="text-gray-400 text-sm">8 comments · AI-powered toxicity detection</p>
        </div>
        <div className="flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 px-4 py-2 rounded-lg text-brand-red text-sm font-bold">
          <AlertTriangle size={16} />
          2 toxic comments
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-800 rounded-xl border border-brand-red/30 p-6 shadow-sm border-t-4 border-t-brand-red bg-gradient-to-b from-brand-red/5 to-transparent">
          <h2 className="text-4xl font-bold text-brand-red mb-2">2</h2>
          <p className="text-gray-400 text-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-red"></span>Toxic</p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-brand-yellow/30 p-6 shadow-sm border-t-4 border-t-brand-yellow bg-gradient-to-b from-brand-yellow/5 to-transparent">
          <h2 className="text-4xl font-bold text-brand-yellow mb-2">3</h2>
          <p className="text-gray-400 text-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-yellow"></span>Risky</p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-brand-green/30 p-6 shadow-sm border-t-4 border-t-brand-green bg-gradient-to-b from-brand-green/5 to-transparent">
          <h2 className="text-4xl font-bold text-brand-green mb-2">3</h2>
          <p className="text-gray-400 text-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-green"></span>Safe</p>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl border border-dark-600/50 overflow-hidden">
        {/* Filters and Search Bar */}
        <div className="p-4 border-b border-dark-600/50 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-3 py-2 border border-dark-600 rounded-md leading-5 bg-dark-900 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-green sm:text-sm"
              placeholder="Search comments..."
            />
          </div>
          
          <div className="flex items-center gap-1 text-sm bg-dark-900 border border-dark-600 rounded-md p-1">
            <button className="bg-brand-green/20 text-brand-green px-4 py-1.5 rounded shadow-sm text-xs font-medium">All</button>
            <button className="text-gray-400 hover:text-white px-4 py-1.5 rounded text-xs font-medium w-full md:w-auto">Toxic</button>
            <button className="text-gray-400 hover:text-white px-4 py-1.5 rounded text-xs font-medium w-full md:w-auto">Risky</button>
            <button className="text-gray-400 hover:text-white px-4 py-1.5 rounded text-xs font-medium w-full md:w-auto">Safe</button>
            <div className="w-px h-4 bg-dark-600 mx-1"></div>
            <button className="text-gray-400 hover:text-white px-4 py-1.5 rounded text-xs font-medium w-full md:w-auto">Active</button>
            <button className="text-gray-400 hover:text-white px-4 py-1.5 rounded text-xs font-medium w-full md:w-auto">Removed</button>
            <button className="text-gray-400 hover:text-white px-4 py-1.5 rounded text-xs font-medium w-full md:w-auto">Warned</button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-brand-green/10 border-b border-dark-600/50 px-4 py-3 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-4">
            <span className="text-brand-green font-semibold text-sm">1 selected</span>
            <button className="flex items-center gap-1.5 bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30 hover:bg-brand-yellow/30 px-3 py-1.5 rounded-md text-xs font-bold transition-colors">
              <AlertTriangle size={14} /> Warn All Users
            </button>
            <button className="flex items-center gap-1.5 bg-brand-red/20 text-brand-red border border-brand-red/30 hover:bg-brand-red/30 px-3 py-1.5 rounded-md text-xs font-bold transition-colors">
              <Trash2 size={14} /> Delete Selected
            </button>
          </div>
          <button className="text-gray-400 hover:text-white text-sm font-medium">Clear</button>
        </div>

        {/* Comment List */}
        <div className="divide-y divide-dark-600/50">
          {commentsData.map((comment) => (
            <div key={comment.id} className={`p-6 flex items-start gap-4 hover:bg-dark-700/30 transition-colors ${comment.selected ? 'bg-brand-green/5' : ''}`}>
              <div className="pt-1">
                <input type="checkbox" checked={comment.selected} readOnly className="w-4 h-4 rounded border-dark-500 bg-dark-700 text-brand-green focus:ring-brand-green" />
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-white text-sm">{comment.user}</span>
                  <span className="text-gray-500">on</span>
                  <span className="text-brand-green font-medium">{comment.article}</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-500">{comment.date}</span>
                  {comment.reports > 0 && (
                    <span className="bg-brand-red/10 text-brand-red px-1.5 py-0.5 rounded ml-2">
                       {comment.reports} reports
                    </span>
                  )}
                  {comment.isRemoved && (
                    <span className="bg-dark-600 text-gray-300 px-1.5 py-0.5 rounded ml-1">
                       removed
                    </span>
                  )}
                  {comment.isWarned && (
                    <span className="bg-dark-600 text-gray-300 px-1.5 py-0.5 rounded ml-1">
                       warned
                    </span>
                  )}
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed max-w-4xl">{comment.body}</p>
                
                <div className="flex items-center gap-4">
                   <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold border ${
                      comment.status === 'Safe' ? 'bg-brand-green/10 text-brand-green border-brand-green/20' :
                      comment.status === 'Risky' ? 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20' :
                      'bg-brand-red/10 text-brand-red border-brand-red/20'
                   }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        comment.status === 'Safe' ? 'bg-brand-green' : comment.status === 'Risky' ? 'bg-brand-yellow' : 'bg-brand-red'
                      }`}></div>
                      {comment.status}
                   </div>
                   
                   <div className="flex items-center gap-2">
                     <div className="w-24 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                       <div 
                         className={`h-full ${comment.status === 'Safe' ? 'bg-brand-green' : comment.status === 'Risky' ? 'bg-brand-yellow' : 'bg-brand-red'}`} 
                         style={{ width: `${comment.toxicity}%` }}
                       ></div>
                     </div>
                     <span className="text-xs text-gray-500 font-medium">{comment.toxicity}%</span>
                   </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 opacity-50 hover:opacity-100 transition-opacity">
                <button className="p-2 text-brand-green hover:bg-brand-green/10 rounded transition-colors"><CheckCircle2 size={18} /></button>
                <button className="p-2 text-brand-yellow hover:bg-brand-yellow/10 rounded transition-colors"><Shield size={18} /></button>
                <button className="p-2 text-brand-red hover:bg-brand-red/10 rounded transition-colors"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comments;
