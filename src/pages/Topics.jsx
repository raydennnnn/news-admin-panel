import { GripVertical, Building2, Monitor, TrendingUp, Circle, HeartPulse, Microscope, Clapperboard, Palette } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const topicsData = [
  {
    id: 1, priority: 1, name: 'Politics', slug: '/topics/politics', icon: Building2,
    articles: '3,420', trend: '+12%', isPositive: true,
    data: [{v: 10}, {v: 12}, {v: 11}, {v: 15}, {v: 14}, {v: 18}]
  },
  {
    id: 2, priority: 2, name: 'Technology', slug: '/topics/technology', icon: Monitor,
    articles: '2,890', trend: '+28%', isPositive: true,
    data: [{v: 5}, {v: 8}, {v: 12}, {v: 18}, {v: 24}, {v: 32}]
  },
  {
    id: 3, priority: 3, name: 'Business', slug: '/topics/business', icon: TrendingUp,
    articles: '2,100', trend: '+8%', isPositive: true,
    data: [{v: 20}, {v: 21}, {v: 21}, {v: 22}, {v: 23}, {v: 25}]
  },
  {
    id: 4, priority: 4, name: 'Sports', slug: '/topics/sports', icon: Circle,
    articles: '1,890', trend: '-3%', isPositive: false,
    data: [{v: 30}, {v: 29}, {v: 29}, {v: 28}, {v: 27}, {v: 26}]
  },
  {
    id: 5, priority: 5, name: 'Health', slug: '/topics/health', icon: HeartPulse,
    articles: '1,450', trend: '+15%', isPositive: true,
    data: [{v: 10}, {v: 11}, {v: 14}, {v: 15}, {v: 17}, {v: 20}]
  },
  {
    id: 6, priority: 6, name: 'Science', slug: '/topics/science', icon: Microscope,
    articles: '980', trend: '+22%', isPositive: true,
    data: [{v: 5}, {v: 7}, {v: 9}, {v: 11}, {v: 15}, {v: 18}]
  },
  {
    id: 7, priority: 7, name: 'Entertainment', slug: '/topics/entertainment', icon: Clapperboard,
    articles: '1,200', trend: '-8%', isPositive: false,
    data: [{v: 25}, {v: 22}, {v: 20}, {v: 21}, {v: 18}, {v: 15}]
  },
  {
    id: 8, priority: 8, name: 'Culture', slug: '/topics/culture', icon: Palette,
    articles: '670', trend: '+5%', isPositive: true,
    data: [{v: 8}, {v: 9}, {v: 8}, {v: 10}, {v: 11}, {v: 11}]
  }
];

const Topics = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Topics Management</h1>
          <p className="text-gray-400 text-sm">Drag to reorder display priority · 8 topics</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-green/20 hover:bg-brand-green/30 px-4 py-2 rounded-lg text-brand-green text-sm font-bold border border-brand-green/30 transition-colors">
          Save Order
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
          <h2 className="text-4xl font-bold text-blue-500 mb-2">8</h2>
          <p className="text-gray-400 text-sm">Total Topics</p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
          <h2 className="text-4xl font-bold text-brand-green mb-2">4</h2>
          <p className="text-gray-400 text-sm">Growing (&gt;10%)</p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
          <h2 className="text-4xl font-bold text-brand-red mb-2">2</h2>
          <p className="text-gray-400 text-sm">Declining</p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
          <h2 className="text-4xl font-bold text-brand-yellow mb-2">14,600</h2>
          <p className="text-gray-400 text-sm">Total Articles</p>
        </div>
      </div>

      <div className="bg-brand-green/10 border border-brand-green/30 rounded-lg p-3 flex items-center gap-3 text-sm text-brand-green mb-6 shadow-sm">
        <GripVertical size={16} /> Drag and drop rows to reorder topic display priority in the app
      </div>

      <div className="bg-dark-800 rounded-xl border border-dark-600/50 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-dark-600/50 bg-dark-900/50 text-gray-500 font-semibold tracking-wider text-[11px]">
                <th className="px-6 py-4 w-10"></th>
                <th className="px-4 py-4 uppercase">Priority</th>
                <th className="px-6 py-4 uppercase">Topic</th>
                <th className="px-6 py-4 uppercase">Articles</th>
                <th className="px-6 py-4 uppercase">Trend</th>
                <th className="px-6 py-4 uppercase">Weekly Growth</th>
                <th className="px-6 py-4 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-600/50">
              {topicsData.map((topic) => (
                <tr key={topic.id} className="hover:bg-dark-700/30 transition-colors cursor-move">
                  <td className="px-6 py-4">
                    <GripVertical size={18} className="text-dark-600" />
                  </td>
                  <td className="px-4 py-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${topic.priority === 1 ? 'bg-brand-green text-dark-900' : 'bg-dark-700 text-white'}`}>
                      {topic.priority}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="text-gray-400 bg-dark-700 p-2 rounded w-8 h-8 flex items-center justify-center">
                        <topic.icon size={16} />
                      </div>
                      <div>
                        <p className="text-white font-bold">{topic.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{topic.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {topic.articles}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1 font-medium ${topic.isPositive ? 'text-brand-green' : 'text-brand-red'}`}>
                      <TrendingUp size={14} className={!topic.isPositive ? 'rotate-180' : ''} />
                      {topic.trend}
                    </div>
                  </td>
                  <td className="px-6 py-4 w-48">
                     <div className="h-8 w-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={topic.data}>
                            <Line 
                              type="monotone" 
                              dataKey="v" 
                              stroke={topic.isPositive ? '#10B981' : '#EF4444'} 
                              strokeWidth={2} 
                              dot={false} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <button className="px-3 py-1 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded text-xs font-medium transition-colors border border-dark-600">Edit</button>
                       <button className="px-3 py-1 bg-brand-red/10 hover:bg-brand-red/20 text-brand-red rounded text-xs font-medium transition-colors border border-brand-red/20">Hide</button>
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

export default Topics;
