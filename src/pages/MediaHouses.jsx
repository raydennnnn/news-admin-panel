import { useState } from 'react';
import { ChevronDown, ChevronUp, Lock, ArrowUpRight, Plus, ExternalLink, BarChart2, List, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'W2', value: 10000 },
  { name: 'W3', value: 10500 },
  { name: 'W4', value: 11000 },
  { name: 'W5', value: 11500 },
  { name: 'W6', value: 12100 },
  { name: 'W7', value: 12400 },
];

const mediaHousesData = [
  {
    id: 1,
    acronym: 'GNN',
    name: 'Globe News Network',
    status: 'Active',
    location: 'United States',
    owner: 'Richard Hartley',
    articles: '12,400',
    editors: 3,
    contributors: 24,
    expanded: true
  },
  {
    id: 2,
    acronym: 'TPM',
    name: 'TechPulse Media',
    status: 'Active',
    location: 'United Kingdom',
    owner: 'Aisha Nwosu',
    articles: '3,400',
    editors: 2,
    contributors: 12,
    expanded: false
  },
  {
    id: 3,
    acronym: 'SZD',
    name: 'SportZone Daily',
    status: 'Active',
    location: 'Brazil',
    owner: 'Carlos Mendes',
    articles: '8,900',
    editors: 2,
    contributors: 18,
    expanded: false
  },
  {
    id: 4,
    acronym: 'FPI',
    name: 'FreePress Independent',
    status: 'Active',
    location: 'Unknown',
    owner: 'Unknown',
    articles: '890',
    editors: 1,
    contributors: 6,
    expanded: false
  },
  {
    id: 5,
    acronym: 'HFM',
    name: 'HealthFirst Media',
    status: 'Active',
    location: 'Canada',
    owner: 'Dr. Leonard Park',
    articles: '2,200',
    editors: 2,
    contributors: 9,
    expanded: false
  }
];

const MediaHouses = () => {
  const [houses, setHouses] = useState(mediaHousesData);

  const toggleExpand = (id) => {
    setHouses(houses.map(h => h.id === id ? { ...h, expanded: !h.expanded } : h));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Media Houses</h1>
        <p className="text-gray-400 text-sm">5 media organizations</p>
      </div>

      <div className="space-y-4">
        {houses.map((house) => (
          <div key={house.id} className="bg-dark-800 rounded-xl border border-dark-600/50 overflow-hidden transition-all duration-200 hover:border-dark-500">
            {/* Header row */}
            <div 
              className="p-6 flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand(house.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-dark-600/50 text-brand-green font-bold text-xl flex items-center justify-center border border-dark-500 shadow-inner">
                  {house.acronym}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-white">{house.name}</h3>
                    {house.status === 'Active' && <span className="bg-brand-green/10 text-brand-green px-2 py-0.5 rounded text-xs font-bold border border-brand-green/20">Active</span>}
                  </div>
                  <p className="text-sm text-gray-400">{house.location} · Owner: {house.owner}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-white font-bold text-lg leading-tight">{house.articles}</p>
                  <p className="text-gray-500 text-xs">Articles</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-lg leading-tight">{house.editors}</p>
                  <p className="text-gray-500 text-xs">Editors</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-lg leading-tight">{house.contributors}</p>
                  <p className="text-gray-500 text-xs">Contributors</p>
                </div>
                <div className="text-gray-500 pl-4">
                  {house.expanded ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>
            </div>

            {/* Expanded Content Area */}
            {house.expanded && (
              <div className="px-6 pb-6 border-t border-dark-600/50 bg-dark-900/30 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Organizational Hierarchy */}
                  <div className="bg-dark-900 rounded-xl p-5 border border-dark-600/50">
                    <h4 className="text-white font-bold text-sm mb-4">Organizational Hierarchy</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                          <span className="text-white font-medium pl-1">👑 Richard Hartley</span>
                        </div>
                        <span className="text-brand-green text-xs font-medium bg-brand-green/10 px-2 rounded">Owner</span>
                      </div>
                      
                      <div className="pl-5 space-y-3 border-l border-dark-600 ml-1">
                        <div className="flex items-center justify-between text-sm pl-4 relative">
                          <span className="absolute left-0 top-1/2 w-3 border-t border-dark-600"></span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300">🖊️ Sarah Chen</span>
                          </div>
                          <span className="text-brand-yellow text-xs font-medium bg-brand-yellow/10 px-2 rounded">Editor</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm pl-4 relative">
                          <span className="absolute left-0 top-1/2 w-3 border-t border-dark-600"></span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300">🖊️ Elena Rodriguez</span>
                          </div>
                          <span className="text-brand-yellow text-xs font-medium bg-brand-yellow/10 px-2 rounded">Editor</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm pl-4 relative">
                          <span className="absolute left-0 top-1/2 w-3 border-t border-dark-600"></span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300">🖊️ David Kim</span>
                          </div>
                          <span className="text-brand-yellow text-xs font-medium bg-brand-yellow/10 px-2 rounded">Editor</span>
                        </div>

                        <div className="flex items-center justify-between text-sm pl-4 relative mt-2">
                           <span className="absolute left-0 top-1/2 w-3 border-t border-dark-600"></span>
                           <div className="flex items-center gap-2 text-gray-500 bg-dark-800 px-3 py-1 rounded w-full border border-dark-600/50">
                             👥 24 Contributors
                           </div>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 border border-dark-600 text-gray-400 rounded-lg text-sm hover:text-white hover:bg-dark-700 transition-colors">
                      <Plus size={16} /> Add Member
                    </button>
                  </div>

                  {/* Top Articles */}
                  <div className="bg-dark-900 rounded-xl p-5 border border-dark-600/50">
                    <h4 className="text-white font-bold text-sm mb-4">🔥 Top Articles</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="text-brand-green font-bold text-lg italic">#1</span>
                          <span className="text-gray-300 text-sm group-hover:text-white transition-colors">Climate Summit Coverage</span>
                        </div>
                        <ExternalLink size={14} className="text-gray-600 group-hover:text-brand-green transition-colors" />
                      </div>
                      <div className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="text-brand-green/80 font-bold text-lg italic">#2</span>
                          <span className="text-gray-300 text-sm group-hover:text-white transition-colors">Fed Rate Decision Analysis</span>
                        </div>
                        <ExternalLink size={14} className="text-gray-600 group-hover:text-brand-green transition-colors" />
                      </div>
                      <div className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="text-brand-green/60 font-bold text-lg italic">#3</span>
                          <span className="text-gray-300 text-sm group-hover:text-white transition-colors">Election Night Special</span>
                        </div>
                        <ExternalLink size={14} className="text-gray-600 group-hover:text-brand-green transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Content Growth Chart */}
                  <div className="bg-dark-900 rounded-xl p-5 border border-dark-600/50 flex flex-col">
                    <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                       <TrendingUp size={16} className="text-brand-green" /> Content Growth
                    </h4>
                    <h2 className="text-3xl font-bold text-white mb-1">12,400</h2>
                    <p className="text-gray-500 text-xs mb-4">Total articles published</p>
                    
                    <div className="w-full h-24 mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <XAxis dataKey="name" stroke="#4B5563" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#F3F4F6', fontSize: '12px' }}
                          />
                          <Line type="basis" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

                <div className="mt-6 flex justify-between items-center border-t border-dark-600/50 pt-6">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 text-sm text-gray-300 bg-dark-800 hover:bg-dark-700 border border-dark-600 px-4 py-2 rounded-lg transition-colors">
                      <List size={16} /> View All Articles
                    </button>
                    <button className="flex items-center gap-2 text-sm text-gray-300 bg-dark-800 hover:bg-dark-700 border border-dark-600 px-4 py-2 rounded-lg transition-colors">
                      <BarChart2 size={16} /> Performance Report
                    </button>
                  </div>
                  <button className="flex items-center gap-2 text-sm font-medium text-brand-red bg-brand-red/10 hover:bg-brand-red/20 px-4 py-2 rounded-lg transition-colors border border-brand-red/20">
                    <Lock size={16} /> Suspend
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaHouses;
