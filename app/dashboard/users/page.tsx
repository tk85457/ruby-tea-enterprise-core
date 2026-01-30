'use client';

import useSWR, { mutate } from 'swr';
import { useState } from 'react';
import {
  FaUserShield, FaSearch, FaSpinner, FaUserClock,
  FaUserSlash, FaUserCog, FaShieldAlt, FaEllipsisV
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER', 'CUSTOMER'];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const { data, isLoading } = useSWR(`/api/admin/users?role=${roleFilter}`, fetcher);
  const users = data?.users || [];

  const handleUpdate = async (userId: string, updates: any) => {
    setIsUpdating(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        mutate(`/api/admin/users?role=${roleFilter}`);
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
    setIsUpdating(null);
  };

  const filteredUsers = users.filter((u: any) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Governance</h1>
        <p className="text-gray-500">Manage administrative access and monitor customer activity.</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ruby-red outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg outline-none bg-gray-50 font-bold text-gray-600 focus:ring-2 focus:ring-ruby-red"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="ALL">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Identity</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Authorization Role</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Activity</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
               <tr><td colSpan={5} className="py-20 text-center"><FaSpinner className="animate-spin text-ruby-red text-2xl mx-auto" /></td></tr>
            ) : filteredUsers.map((user: any) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-ruby-red/10 text-ruby-red flex items-center justify-center font-bold">
                       {user.name[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">{user.name}</span>
                      <span className="text-xs text-gray-400">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <select
                     className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase border-none outline-none cursor-pointer tracking-wider ${
                        user.role.includes('ADMIN') ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                     }`}
                     disabled={isUpdating === user._id}
                     value={user.role}
                     onChange={(e) => handleUpdate(user._id, { role: e.target.value })}
                   >
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                   </select>
                </td>
                <td className="px-6 py-4">
                   <button
                     disabled={isUpdating === user._id || user.role === 'SUPER_ADMIN'}
                     onClick={() => handleUpdate(user._id, { status: user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' })}
                     className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all ${
                       user.status === 'ACTIVE' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                     }`}
                   >
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {user.status}
                   </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FaUserClock />
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never logged in'}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-gray-400 hover:text-ruby-red rounded-lg transition-colors">
                    <FaEllipsisV />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
