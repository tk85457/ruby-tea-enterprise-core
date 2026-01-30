'use client';

import useSWR, { mutate } from 'swr';
import { useState } from 'react';
import { FaLeaf, FaHistory, FaSpinner, FaBoxOpen } from 'react-icons/fa';
import { updateStock } from '@/lib/actions';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function InventoryPage() {
  const { data, isLoading } = useSWR('/api/products', fetcher);
  const products = data?.products || [];

  const [selectedProductId, setSelectedProductId] = useState('');
  const [stockInput, setStockInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !stockInput) return;

    setIsUpdating(true);
    const result = await updateStock(selectedProductId, Number(stockInput));

    if (result.success) {
      alert('Stock Updated Successfully!');
      setStockInput('');
      mutate('/api/products');
      mutate('/api/stats');
    } else {
      alert('Update Failed');
    }
    setIsUpdating(false);
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center text-[var(--tea-green)]"><FaSpinner className="animate-spin text-4xl" /></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Inventory Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stock Update Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold text-[var(--tea-green)] mb-6 flex items-center">
            <FaLeaf className="mr-2" />
            Update Stock Availability
          </h2>
          <form className="space-y-4" onSubmit={handleUpdateStock}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                required
              >
                <option value="">-- Choose Product --</option>
                {products.map((p: any) => (
                    <option key={p._id || p.id} value={p._id || p.id}>{p.name} (Current: {p.stock})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Total Quantity</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. 50"
                value={stockInput}
                onChange={(e) => setStockInput(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Sets the absolute stock level.</p>
            </div>
            <button
                type="submit"
                disabled={isUpdating || !selectedProductId}
                className="w-full bg-[var(--tea-green)] text-white py-3 rounded-lg font-bold hover:bg-green-800 transition-colors shadow-md mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center gap-2"
            >
              {isUpdating && <FaSpinner className="animate-spin"/>}
              Update Inventory
            </button>
          </form>
        </div>

        {/* Current Stock Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FaHistory className="mr-2 text-gray-500" />
            Stock Overview
          </h2>
          <div className="overflow-hidden rounded-lg border border-gray-200">
             {products.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                    <FaBoxOpen className="mx-auto mb-2 text-2xl"/>
                    No products found.
                </div>
             ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-sm font-semibold text-gray-600">Product</th>
                  <th className="p-3 text-sm font-semibold text-gray-600">Quantity</th>
                  <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item: any, idx: number) => (
                  <tr key={item._id || item.id} className="border-t border-gray-100">
                    <td className="p-3 text-gray-800 font-medium">{item.name}</td>
                    <td className="p-3 text-gray-600">{item.stock} units</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        item.stock > 20 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.stock > 20 ? 'Good' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
