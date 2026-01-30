'use client';

import useSWR, { mutate } from 'swr';
import { useState, useMemo } from 'react';
import {
  FaShoppingBag, FaSearch, FaFilter, FaSync,
  FaSpinner, FaEye, FaCheck, FaTruck, FaTimes,
  FaUndo, FaFileExport, FaCheckSquare, FaSquare
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToCSV } from '@/lib/export_utils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const STATUS_OPTIONS = [
  { label: 'All Orders', value: 'ALL', color: 'bg-gray-100 text-gray-600' },
  { label: 'Pending', value: 'PENDING', color: 'bg-amber-100 text-amber-700' },
  { label: 'Processing', value: 'PROCESSING', color: 'bg-blue-100 text-blue-700' },
  { label: 'Shipped', value: 'SHIPPED', color: 'bg-emerald-100 text-emerald-700' },
  { label: 'Delivered', value: 'DELIVERED', color: 'bg-green-100 text-green-700' },
  { label: 'Cancelled', value: 'CANCELLED', color: 'bg-red-100 text-red-700' },
];

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, isLoading } = useSWR(`/api/admin/orders?status=${statusFilter}`, fetcher);
  const orders = data?.orders || [];

  const filteredOrders = useMemo(() => {
    return orders.filter((o: any) =>
      o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) setSelectedIds([]);
    else setSelectedIds(filteredOrders.map((o: any) => o._id));
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        mutate(`/api/admin/orders?status=${statusFilter}`);
        if (selectedOrder) setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (e) { console.error(e); }
    setIsUpdating(false);
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (!confirm(`Update ${selectedIds.length} orders to ${newStatus}?`)) return;
    try {
        const res = await fetch('/api/admin/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ entity: 'Order', action: 'UPDATE_STATUS', ids: selectedIds, data: { status: newStatus } }),
        });
        if (res.ok) {
            mutate(`/api/admin/orders?status=${statusFilter}`);
            setSelectedIds([]);
        }
    } catch (e) { console.error(e); }
  };

  const handleExport = () => {
    const exportData = orders.map((o: any) => ({
      Order_ID: o._id,
      Customer: o.userId?.name || 'Guest',
      Email: o.userId?.email || o.email,
      Total: o.totalAmount,
      Status: o.status,
      Payment: o.paymentStatus,
      Created: new Date(o.createdAt).toLocaleString()
    }));
    exportToCSV(exportData, 'ruby_tea_orders');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Fulfillment Engine</h1>
          <p className="text-gray-500">Coordinate logisitic flows and customer deliveries.</p>
        </div>
        <div className="flex gap-2">
            <button onClick={handleExport} className="bg-white border border-gray-200 text-gray-600 px-4 py-3 rounded-2xl flex items-center gap-2 hover:bg-gray-50 transition-all font-bold text-sm shadow-sm">
                <FaFileExport /> Export Orders
            </button>
            <button className="bg-ruby-red text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-black transition-all shadow-xl font-bold">
                <FaSync className={isLoading ? 'animate-spin' : ''} /> Live Pulse
            </button>
        </div>
      </div>

      {/* Control & Bulk Actions */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
         <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-ruby-red transition-all text-sm font-medium"
              placeholder="Search by ID, Name, or Email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto items-center">
            {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 bg-ruby-red/10 px-3 py-2 rounded-xl border border-ruby-red/20 mr-2">
                    <span className="text-[10px] font-black text-ruby-red uppercase">{selectedIds.length} Selected</span>
                    <select
                      onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                      className="bg-white text-[10px] font-bold border-none rounded-lg px-2 py-1 outline-none shadow-sm"
                    >
                        <option value="">Bulk Status</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                    </select>
                </div>
            )}
            {STATUS_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => setStatusFilter(opt.value)} className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest transition-all whitespace-nowrap ${statusFilter === opt.value ? 'bg-gray-900 text-white shadow-xl scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
                    {opt.label}
                </button>
            ))}
         </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-6 w-10">
                 <button onClick={toggleSelectAll} className="text-ruby-red">
                    {selectedIds.length === filteredOrders.length && filteredOrders.length > 0 ? <FaCheckSquare /> : <FaSquare className="text-gray-200" />}
                 </button>
              </th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Descriptor</th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Customer Protocol</th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Valuation</th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Phase</th>
              <th className="p-6 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
             {isLoading ? (
                <tr><td colSpan={6} className="py-20 text-center"><FaSpinner className="animate-spin text-ruby-red text-3xl mx-auto" /></td></tr>
             ) : filteredOrders.map((o: any) => (
                <tr key={o._id} className={`hover:bg-gray-50/50 transition-colors group cursor-pointer ${selectedIds.includes(o._id) ? 'bg-ruby-red/5' : ''}`} onClick={() => setSelectedOrder(o)}>
                   <td className="p-6" onClick={(e) => { e.stopPropagation(); toggleSelect(o._id); }}>
                      <button className="text-ruby-red">
                         {selectedIds.includes(o._id) ? <FaCheckSquare /> : <FaSquare className="text-gray-100 group-hover:text-gray-200" />}
                      </button>
                   </td>
                   <td className="p-6">
                      <span className="font-mono text-[10px] font-black text-gray-300 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 uppercase scale-90 inline-block origin-left group-hover:bg-ruby-red/10 group-hover:text-ruby-red group-hover:border-ruby-red/20 transition-all">
                        #{o._id.slice(-8)}
                      </span>
                   </td>
                   <td className="p-6">
                      <div className="flex flex-col">
                         <span className="font-black text-gray-800">{o.userId?.name || 'Direct Order'}</span>
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{o.userId?.email || o.email}</span>
                      </div>
                   </td>
                   <td className="p-6">
                       <div className="flex flex-col">
                          <span className="text-lg font-black text-gray-900">₹{o.totalAmount.toLocaleString()}</span>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${o.paymentStatus === 'PAID' ? 'text-emerald-500' : 'text-amber-500'}`}>{o.paymentStatus}</span>
                       </div>
                   </td>
                   <td className="p-6">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
                          STATUS_OPTIONS.find(s => s.value === o.status)?.color || 'bg-gray-100 text-gray-600'
                       }`}>
                          {o.status}
                       </span>
                   </td>
                   <td className="p-6 text-right">
                       <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-ruby-red hover:text-white transition-all shadow-sm">
                          <FaEye size={14}/>
                       </button>
                   </td>
                </tr>
             ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal - Condensed & High-Contrast */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-[48px] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
               <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Command Transmission</h2>
                    <p className="text-xs font-black text-ruby-red border border-ruby-red/20 inline-block px-2 py-1 rounded-lg mt-1 font-mono">NODE_TX_{selectedOrder._id.toUpperCase()}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-4 text-gray-400 hover:text-gray-900 bg-white rounded-full shadow-lg border border-gray-100 transition-all active:scale-95"><FaTimes /></button>
               </div>

               <div className="flex-1 overflow-y-auto p-10 space-y-12">
                   {/* Logistics Controls */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Lifecycle Pulse</h3>
                          <div className="flex flex-wrap gap-2">
                             {['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                                <button key={s} onClick={() => handleUpdateStatus(selectedOrder._id, s)} disabled={isUpdating} className={`px-4 py-2 rounded-2xl text-[10px] font-black tracking-widest transition-all ${selectedOrder.status === s ? 'bg-gray-900 text-white shadow-xl ring-4 ring-gray-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:-translate-y-0.5'}`}>
                                   {s}
                                </button>
                             ))}
                          </div>
                       </div>
                       <div className="bg-ruby-red text-white p-6 rounded-[32px] shadow-xl relative overflow-hidden group">
                           <FaTruck className="absolute -right-4 -bottom-4 text-8xl opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-3">Delivery Target</h3>
                           <p className="font-black text-lg">{selectedOrder.userId?.name || 'Direct Node'}</p>
                           <p className="text-xs font-bold leading-relaxed mt-1 opacity-90">{selectedOrder.shippingAddress?.line1}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                           <p className="font-mono text-xs mt-4 mt-2 font-black bg-white/20 w-fit px-3 py-1 rounded-full">{selectedOrder.shippingAddress?.phone}</p>
                       </div>
                   </div>

                   {/* Item manifest */}
                   <div>
                       <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Manifest Content</h3>
                       <div className="grid grid-cols-1 gap-4">
                          {selectedOrder.items.map((item: any, i: number) => (
                             <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-[28px] border border-gray-100 hover:bg-white hover:shadow-lg transition-all">
                                <div className="flex items-center gap-5">
                                   <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-white">
                                      <img src={item.image} className="w-full h-full object-cover" />
                                   </div>
                                   <div>
                                      <p className="font-black text-gray-900">{item.name}</p>
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.quantity} units × ₹{item.price}</p>
                                   </div>
                                </div>
                                <span className="text-xl font-black text-gray-900 tracking-tighter">₹{(item.quantity * item.price).toLocaleString()}</span>
                             </div>
                          ))}
                       </div>
                   </div>
               </div>

               <div className="p-10 bg-gray-900 text-white flex justify-between items-center rounded-t-[48px]">
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-[0.5em] text-ruby-red">Valuation Matrix</p>
                     <p className="text-4xl font-black tracking-tighter">₹{selectedOrder.totalAmount.toLocaleString()}</p>
                  </div>
                  <button className="px-10 py-5 bg-ruby-red text-white rounded-[24px] font-black shadow-2xl hover:bg-white hover:text-ruby-red transition-all scale-105 active:scale-95">
                     Initiate Fulfillment Trace
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
