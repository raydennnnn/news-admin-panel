import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';

const dauData = [
  { name: 'Apr 2', uv: 42000 }, { name: 'Apr 3', uv: 44000 }, { name: 'Apr 4', uv: 43000 },
  { name: 'Apr 5', uv: 48000 }, { name: 'Apr 6', uv: 52000 }, { name: 'Apr 7', uv: 49000 },
  { name: 'Apr 8', uv: 55000 }, { name: 'Apr 9', uv: 58000 }, { name: 'Apr 10', uv: 54000 },
  { name: 'Apr 11', uv: 61000 }, { name: 'Apr 12', uv: 64000 }, { name: 'Apr 13', uv: 68000 },
  { name: 'Apr 14', uv: 71000 }, { name: 'Apr 15', uv: 69000 }
];

const retentionData = [
  { day: 'D0', val: 100 }, { day: 'D1', val: 75 }, { day: 'D2', val: 62 },
  { day: 'D3', val: 51 }, { day: 'D4', val: 45 }, { day: 'D5', val: 42 },
  { day: 'D6', val: 38 }, { day: 'D7', val: 36 }, { day: 'D8', val: 34 },
  { day: 'D9', val: 33 }, { day: 'D10', val: 32 }, { day: 'D11', val: 31 },
  { day: 'D12', val: 30 }
];

const weeklyData = [
  { name: 'Mon', count: 125 }, { name: 'Tue', count: 138 }, { name: 'Wed', count: 142 },
  { name: 'Thu', count: 156 }, { name: 'Fri', count: 172 }, { name: 'Sat', count: 98 },
  { name: 'Sun', count: 85 }
];

const pieData = [
  { name: 'Politics', value: 3420, color: '#3B82F6' },
  { name: 'Technology', value: 2890, color: '#10B981' },
  { name: 'Business', value: 2100, color: '#8B5CF6' },
  { name: 'Sports', value: 1890, color: '#F59E0B' },
  { name: 'Health', value: 1450, color: '#EF4444' }
];

const heatmapDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const heatmapTopics = ['Politics', 'Technology', 'Business', 'Sports', 'Health', 'Science'];

// Generate varying opacities for the heatmap representing data values
const getHeatmapOpacity = (topicIndex, dayIndex) => {
  const base = ((topicIndex * 7) + dayIndex + 5) * 11;
  return (base % 100) / 100 * 0.8 + 0.1; // Range 0.1 to 0.9
};

const Analytics = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
        <p className="text-gray-400 text-sm">Executive Dashboard · Last 30 days</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
          <p className="text-gray-400 text-xs font-bold tracking-wider mb-2 uppercase">Daily Active Users</p>
          <h2 className="text-3xl font-bold text-brand-green mb-2">71,000</h2>
          <p className="text-xs text-gray-500"><span className="text-brand-green font-medium">+6.2%</span> Today</p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
          <p className="text-gray-400 text-xs font-bold tracking-wider mb-2 uppercase">Monthly Active Users</p>
          <h2 className="text-3xl font-bold text-blue-500 mb-2">1.55M</h2>
          <p className="text-xs text-gray-500"><span className="text-brand-green font-medium">+4.8%</span> April 2026</p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
          <p className="text-gray-400 text-xs font-bold tracking-wider mb-2 uppercase">DAU / MAU Ratio</p>
          <h2 className="text-3xl font-bold text-purple-400 mb-2">4.6%</h2>
          <p className="text-xs text-gray-500"><span className="text-brand-green font-medium">+0.3%</span> Stickiness</p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
          <p className="text-gray-400 text-xs font-bold tracking-wider mb-2 uppercase">Avg. Session Time</p>
          <h2 className="text-3xl font-bold text-brand-yellow mb-2">8m 42s</h2>
          <p className="text-xs text-gray-500"><span className="text-brand-green font-medium">+12.1%</span> Per user</p>
        </div>
      </div>

      {/* Top Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-white font-bold text-lg">Daily Active Users</h3>
            <p className="text-gray-400 text-sm">April 2026 — daily engagement</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dauData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#4B5563" tick={{ fill: '#6B7280', fontSize: 10 }} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#4B5563" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#F3F4F6' }} />
                <Area type="monotone" dataKey="uv" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-white font-bold text-lg">User Retention Curve</h3>
            <p className="text-gray-400 text-sm">% of users still active after N days</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retentionData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#4B5563" tick={{ fill: '#6B7280', fontSize: 10 }} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#4B5563" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#F3F4F6' }} />
                <Line type="monotone" dataKey="val" stroke="#8B5CF6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Middle Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-white font-bold text-lg">Weekly Platform Activity</h3>
            <p className="text-gray-400 text-sm">Articles published vs. reports generated</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#4B5563" tick={{ fill: '#6B7280', fontSize: 10 }} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#4B5563" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#F3F4F6' }} cursor={{fill: '#374151', opacity: 0.4}}/>
                <Bar dataKey="count" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-white font-bold text-lg">Content by Topic</h3>
            <p className="text-gray-400 text-sm">Article distribution</p>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#F3F4F6', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 space-y-3">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-300">{item.name}</span>
                </div>
                <span className="text-gray-500">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-white font-bold text-lg">Content Performance Heatmap</h3>
          <p className="text-gray-400 text-sm">Views by topic and day of week</p>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Header row */}
            <div className="grid grid-cols-8 gap-2 mb-4 text-xs font-semibold text-gray-500">
              <div className="col-span-1">Topic</div>
              {heatmapDays.map(day => (
                <div key={day} className="text-center">{day}</div>
              ))}
            </div>
            
            {/* Heatmap rows */}
            <div className="space-y-2">
               {heatmapTopics.map((topic, tIndex) => (
                 <div key={topic} className="grid grid-cols-8 gap-2 items-center">
                   <div className="col-span-1 text-sm text-gray-300">{topic}</div>
                   {heatmapDays.map((day, dIndex) => (
                     <div key={`${topic}-${day}`} className="flex justify-center">
                       <div 
                         className="w-10 h-6 rounded bg-brand-green"
                         style={{ opacity: getHeatmapOpacity(tIndex, dIndex) }}
                       ></div>
                     </div>
                   ))}
                 </div>
               ))}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
              <span>Low</span>
              <div className="flex gap-1">
                {[0.1, 0.3, 0.5, 0.7, 0.9].map((op, i) => (
                  <div key={i} className="w-6 h-4 rounded bg-brand-green" style={{ opacity: op }}></div>
                ))}
              </div>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
