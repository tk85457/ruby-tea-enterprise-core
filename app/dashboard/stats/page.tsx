'use client';

import useSWR from 'swr';
import { FaChartLine, FaArrowUp, FaArrowDown, FaSpinner, FaBoxOpen } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PerformancePage() {
  const { data, isLoading } = useSWR('/api/stats', fetcher);

  if (isLoading) return <div className="flex h-screen items-center justify-center text-[var(--ruby-red)]"><FaSpinner className="animate-spin text-4xl" /></div>;

  const { stats } = data || { stats: { revenue: 0, orders: 0, customers: 0 } };

  // Mock data for graphs since we don't have historical data store yet
  const salesData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  const orderData = [
      { name: 'Mon', orders: 12 },
      { name: 'Tue', orders: 8 },
      { name: 'Wed', orders: 5 },
      { name: 'Thu', orders: 9 },
      { name: 'Fri', orders: 7 },
      { name: 'Sat', orders: 15 },
      { name: 'Sun', orders: 18 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Performance Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-2">Weekly Revenue</h3>
            <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-gray-800">₹{stats.revenue.toLocaleString()}</span>
                <span className="text-green-500 text-sm font-bold flex items-center mb-1"><FaArrowUp className="mr-1"/> 12.5%</span>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-2">Total Orders</h3>
            <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-gray-800">{stats.orders}</span>
                <span className="text-green-500 text-sm font-bold flex items-center mb-1"><FaArrowUp className="mr-1"/> 5.2%</span>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-2">Conversion Rate</h3>
            <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-gray-800">3.2%</span>
                <span className="text-red-500 text-sm font-bold flex items-center mb-1"><FaArrowDown className="mr-1"/> 0.8%</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FaChartLine className="mr-2 text-[var(--ruby-red)]" />
            Revenue Trend (Last 7 Days)
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3"/>
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="var(--ruby-red)" strokeWidth={3} dot={{ fill: 'var(--ruby-red)', strokeWidth: 2 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

         {/* Orders Chart */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FaBoxOpen className="mr-2 text-blue-600" />
            Order Volume
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
