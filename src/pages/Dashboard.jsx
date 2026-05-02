import { useState, useEffect } from 'react';
import { 
  FileText, 
  Building2, 
  Users, 
  Flag, 
  ShieldCheck, 
  Newspaper,
  TrendingUp,
  TrendingDown,
  Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import apiFetch from '../services/api';

const MetricCard = ({ title, value, icon: Icon, type, loading }) => (
  <div className="bg-dark-800 p-5 rounded-xl border border-dark-600/50 flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2.5 rounded-lg ${
        type === 'blue' ? 'bg-blue-500/10 text-blue-500' :
        type === 'green' ? 'bg-brand-green/10 text-brand-green' :
        type === 'purple' ? 'bg-purple-500/10 text-purple-500' :
        type === 'red' ? 'bg-brand-red/10 text-brand-red' :
        type === 'yellow' ? 'bg-brand-yellow/10 text-brand-yellow' :
        'bg-orange-500/10 text-orange-500'
      }`}>
        <Icon size={20} />
      </div>
    </div>
    {loading ? (
      <div className="flex items-center gap-2 mb-1">
        <div className="w-20 h-8 bg-dark-700 rounded animate-pulse" />
      </div>
    ) : (
      <h3 className="text-3xl font-bold text-white mb-1">{value?.toLocaleString() ?? '—'}</h3>
    )}
    <p className="text-gray-400 text-sm">{title}</p>
  </div>
);

const WeeklyChart = ({ title, subtitle, data, dataKey, color, loading }) => {
  const gradientId = `gradient-${dataKey}`;

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-600/50 p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
        <TrendingUp className="text-brand-green" size={20} />
      </div>
      <div className="h-64 w-full">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 size={28} className="text-gray-500 animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis 
                dataKey="label" 
                stroke="#6B7280" 
                tick={{ fill: '#6B7280', fontSize: 12 }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                stroke="#6B7280" 
                tick={{ fill: '#6B7280', fontSize: 12 }} 
                axisLine={false} 
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111827', 
                  borderColor: '#374151', 
                  color: '#F3F4F6',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
                itemStyle={{ color: '#F3F4F6' }}
                labelStyle={{ color: '#9CA3AF', marginBottom: '4px' }}
              />
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={2} 
                fillOpacity={1} 
                fill={`url(#${gradientId})`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

/**
 * Get the last 7 days as YYYY-MM-DD strings and short labels (Mon, Tue, etc.)
 */
const getLast7Days = () => {
  const days = [];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const label = dayLabels[d.getDay()];
    days.push({ dateStr, label });
  }
  return days;
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingWeekly, setLoadingWeekly] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard summary stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiFetch('/admin/dashboard/stats');
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch date-wise stats for the last 7 days
  useEffect(() => {
    const fetchWeeklyStats = async () => {
      try {
        const days = getLast7Days();
        const results = await Promise.all(
          days.map(async ({ dateStr, label }) => {
            try {
              const res = await apiFetch(`/admin/dashboard/stats/date?date=${dateStr}`);
              if (res.success) {
                return {
                  label,
                  date: dateStr,
                  totalNewsPublished: res.data.totalNewsPublished || 0,
                  totalReports: res.data.totalReports || 0,
                  newRegisteredUsers: res.data.newRegisteredUsers || 0,
                };
              }
            } catch {
              // If a single day fails, return zeros
              return {
                label,
                date: dateStr,
                totalNewsPublished: 0,
                totalReports: 0,
                newRegisteredUsers: 0,
              };
            }
          })
        );
        setWeeklyData(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingWeekly(false);
      }
    };
    fetchWeeklyStats();
  }, []);

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Command Center</h1>
        <p className="text-gray-400 text-sm">{today} — Real-time platform overview</p>
      </div>

      {error && (
        <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard 
          title="Total Articles" 
          value={stats?.totalArticles} 
          type="blue"
          icon={FileText} 
          loading={loadingStats}
        />
        <MetricCard 
          title="Active Publishers" 
          value={stats?.totalActivePublishers} 
          type="green"
          icon={Building2} 
          loading={loadingStats}
        />
        <MetricCard 
          title="Registered Users" 
          value={stats?.totalRegisteredUsers} 
          type="purple"
          icon={Users} 
          loading={loadingStats}
        />
        <MetricCard 
          title="Reports Today" 
          value={stats?.totalReportsToday} 
          type="red"
          icon={Flag} 
          loading={loadingStats}
        />
        <MetricCard 
          title="Published Today" 
          value={stats?.totalNewsPublishedToday} 
          type="orange"
          icon={Newspaper} 
          loading={loadingStats}
        />
        <MetricCard 
          title="Pending Verifications" 
          value={stats?.pendingPublisherVerifications} 
          type="yellow"
          icon={ShieldCheck} 
          loading={loadingStats}
        />
      </div>

      {/* Weekly Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <WeeklyChart
          title="News Published"
          subtitle="Total articles published per day — last 7 days"
          data={weeklyData}
          dataKey="totalNewsPublished"
          color="#22C55E"
          loading={loadingWeekly}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyChart
          title="Reports"
          subtitle="Total reports filed per day — last 7 days"
          data={weeklyData}
          dataKey="totalReports"
          color="#EF4444"
          loading={loadingWeekly}
        />
        <WeeklyChart
          title="New Registered Users"
          subtitle="New user sign-ups per day — last 7 days"
          data={weeklyData}
          dataKey="newRegisteredUsers"
          color="#3B82F6"
          loading={loadingWeekly}
        />
      </div>
    </div>
  );
};

export default Dashboard;
