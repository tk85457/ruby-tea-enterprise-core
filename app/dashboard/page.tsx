'use client';

import useSWR from 'swr';
import {
  FaShoppingBag, FaUser, FaLeaf, FaRupeeSign,
  FaSpinner, FaChartLine, FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import StatsCard from '../../components/StatsCard';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const { data, isLoading } = useSWR('/api/admin/stats', fetcher, {
    refreshInterval: 10000 // Poll every 10s as a fallback to Pusher
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-[var(--ruby-red)]">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );
  }

  const { stats } = data || {};
  if (!stats) return <div className="p-8 text-center text-gray-500">Failed to load live telemetry.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Command Center</h1>
          <p className="text-gray-500 mt-1">Real-time performance metrics and business intelligence.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider">Live System Sync</span>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Gross Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={<FaRupeeSign className="text-emerald-600" size={20} />}
          trend="+14.2% from last month"
          trendUp={true}
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<FaShoppingBag className="text-ruby-red" size={20} />}
          trend={`${stats.todayOrders} orders today`}
          trendUp={stats.todayOrders > 0}
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalUsers}
          icon={<FaUser className="text-blue-600" size={20} />}
          trend="+24 this week"
          trendUp={true}
        />
        <StatsCard
          title="Critical Alerts"
          value={stats.stockAlerts}
          icon={<FaLeaf className="text-amber-600" size={20} />}
          trend="Low stock items"
          trendUp={stats.stockAlerts === 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
            <FaChartLine size={120} />
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FaChartLine className="text-blue-500" />
              Revenue Trends (Last 7 Days)
            </h3>
            <p className="text-sm text-gray-500">Aggregated daily sales performance.</p>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.last7Days}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b1d1d" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8b1d1d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{fill: '#9ca3af', fontSize: 12}}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{fill: '#9ca3af', fontSize: 12}}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  formatter={(val: any) => [`₹${val}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b1d1d"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaLeaf className="text-green-500" />
            Inventory Distribution
          </h3>
          <div className="flex-1 space-y-4">
            {stats.categoryStats.map((cat: any) => (
              <div key={cat._id} className="group cursor-default">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-amber-700 transition-colors">{cat._id}</span>
                  <span className="text-xs text-gray-400 font-medium">{cat.totalStock} units</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, (cat.totalStock / 500) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {stats.categoryStats.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 py-10">
                    <FaLeaf size={48} className="mb-2 opacity-20" />
                    <p className="text-xs uppercase tracking-widest font-bold">No Active Inventory</p>
                </div>
            )}
          </div>
          <button className="mt-8 w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-bold rounded-xl border border-gray-100 transition-all">
            Download Full Inventory Report
          </button>
        </div>
      </div>
    </div>
  );
}
