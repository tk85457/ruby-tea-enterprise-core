'use client';

import useSWR from 'swr';
import { FaHistory, FaUser, FaInfoCircle, FaSpinner, FaSearch } from 'react-icons/fa';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading } = useSWR('/api/admin/logs', fetcher);
  const logs = data?.logs || [];

  const filteredLogs = logs.filter((log: any) =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Activity & Audit Trail</h1>
        <p className="text-gray-500">A tamper-proof record of every administrative action.</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <FaSearch className="text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="Filter logs by action, entity, or actor..."
            className="flex-1 bg-transparent border-none outline-none text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Entity Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={5} className="py-20 text-center"><FaSpinner className="animate-spin text-ruby-red text-2xl mx-auto" /></td></tr>
              ) : filteredLogs.map((log: any) => (
                <tr key={log._id} className="text-sm border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-400 font-mono text-[10px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <FaUser className="text-gray-300" />
                       <span className="font-bold text-gray-800">{log.userName || 'System Auto'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest ${
                      log.action.includes('DELETE') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-600">
                    {log.entity}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 w-fit">
                      <FaInfoCircle className="text-blue-400" />
                      <span className="text-xs">{JSON.stringify(log.details)}</span>
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
}
