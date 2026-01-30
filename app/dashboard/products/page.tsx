'use client';

import { useState, useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import {
  FaPlus, FaTrash, FaEdit, FaBoxOpen, FaSpinner,
  FaSearch, FaFilter, FaFileExport, FaCheck, FaTimes,
  FaCheckSquare, FaSquare, FaStar
} from 'react-icons/fa';
import Image from 'next/image';
import { addProduct, deleteProduct, updateProduct } from '@/lib/actions';
import { exportToCSV } from '@/lib/export_utils';
import { motion, AnimatePresence } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductsPage() {
  const { data, isLoading } = useSWR('/api/products', fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const products = data?.products || [];

  const filteredProducts = useMemo(() => {
    return products.filter((p: any) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p: any) => p._id));
    }
  };

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    const file = formData.get('file') as File;
    if (file && file.size > 0) {
        try {
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
            });
            formData.set('image', base64);
        } catch (e) { console.error("Img error", e); }
    }

    try {
        let result;
        if (editingProduct) {
            result = await updateProduct(editingProduct._id, formData);
        } else {
            result = await addProduct(formData);
        }

        if (result.success) {
          handleCloseModal();
          mutate('/api/products');
        } else {
          alert('Failed: ' + result.message);
        }
    } catch (err) {
        alert('An error occurred during sync.');
    }
    setIsSubmitting(false);
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} products?`)) return;
    try {
        const res = await fetch('/api/admin/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ entity: 'Product', action: 'DELETE', ids: selectedIds }),
        });
        if (res.ok) {
            mutate('/api/products');
            setSelectedIds([]);
        }
    } catch (e) { console.error(e); }
  };

  const handleExport = () => {
    const exportData = products.map((p: any) => ({
      ID: p._id,
      SKU: p.sku || 'N/A',
      Name: p.name,
      Category: p.category,
      Price: p.price,
      Stock: p.stock,
      Status: p.status || 'active'
    }));
    exportToCSV(exportData, 'ruby_tea_products');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setPreviewImage(null);
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center text-ruby-red"><FaSpinner className="animate-spin text-4xl" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Product Architecture</h1>
          <p className="text-gray-500">Manage your high-fidelity catalog and variants.</p>
        </div>
        <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="bg-white border border-gray-200 text-gray-600 px-4 py-3 rounded-2xl flex items-center gap-2 hover:bg-gray-50 transition-all font-bold text-sm"
            >
              <FaFileExport /> Export CSV
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-ruby-red text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-black transition-all shadow-xl font-bold"
            >
              <FaPlus /> New Product
            </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
         <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-ruby-red transition-all text-sm font-medium"
              placeholder="Search by SKU, Name, or Category..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
         </div>
         {selectedIds.length > 0 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 bg-ruby-red/10 px-4 py-2 rounded-2xl border border-ruby-red/20"
            >
                <span className="text-xs font-black text-ruby-red uppercase tracking-widest">{selectedIds.length} Selected</span>
                <button onClick={handleBulkDelete} className="p-2 text-ruby-red hover:bg-ruby-red hover:text-white rounded-xl transition-all"><FaTrash size={12}/></button>
            </motion.div>
         )}
      </div>

      {/* Enhanced Product Grid/Table */}
      <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-6 w-10">
                 <button onClick={toggleSelectAll} className="text-ruby-red">
                    {selectedIds.length === filteredProducts.length ? <FaCheckSquare /> : <FaSquare className="text-gray-200" />}
                 </button>
              </th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Metadata</th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Pricing & SKU</th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Inventory</th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="p-6 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProducts.map((p: any) => (
              <tr key={p._id} className={`hover:bg-gray-50/50 transition-colors group ${selectedIds.includes(p._id) ? 'bg-ruby-red/5' : ''}`}>
                <td className="p-6">
                   <button onClick={() => toggleSelect(p._id)} className="text-ruby-red">
                      {selectedIds.includes(p._id) ? <FaCheckSquare /> : <FaSquare className="text-gray-100 group-hover:text-gray-200" />}
                   </button>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg bg-gray-100 border border-gray-200">
                       <Image src={p.image} alt="" fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-900 group-hover:text-ruby-red transition-colors flex items-center gap-2">
                         {p.name}
                         {p.featured && <FaStar className="text-amber-400" size={12} title="Featured Product" />}
                      </p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{p.category}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-gray-900">₹{p.price}</span>
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">SKU: {p.sku || 'UNSET'}</span>
                  </div>
                </td>
                <td className="p-6">
                   <div className="flex flex-col">
                      <span className={`text-sm font-bold ${p.stock < 10 ? 'text-red-600' : 'text-gray-700'}`}>{p.stock} units</span>
                      <div className="w-20 bg-gray-100 h-1 rounded-full mt-1 overflow-hidden">
                        <div className={`h-full rounded-full ${p.stock < 10 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (p.stock / 200) * 100)}%` }}></div>
                      </div>
                   </div>
                </td>
                <td className="p-6">
                   <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                      p.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                   }`}>
                      {p.status || 'active'}
                   </span>
                </td>
                <td className="p-6 text-right">
                   <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); setEditingProduct(p); setPreviewImage(p.image); setIsModalOpen(true); }} className="p-3 text-blue-500 hover:bg-blue-50 rounded-2xl transition-all"><FaEdit /></button>
                      <button onClick={(e) => { e.stopPropagation(); deleteProduct(p._id); }} className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all"><FaTrash /></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enterprise Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[40px] max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">{editingProduct ? 'Recalibrate' : 'Initiate'} Product</h2>
                  <button onClick={handleCloseModal} className="p-3 text-gray-400 hover:text-gray-900 transition-colors bg-white rounded-full shadow-sm"><FaTimes /></button>
              </div>

              <form action={handleSubmit} className="p-8 overflow-y-auto space-y-6 flex-1">
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Codename / Name</label>
                       <input name="name" required defaultValue={editingProduct?.name} className="w-full mt-2 px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-ruby-red/10 transition-all font-bold" />
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">SKU Reference</label>
                      <input name="sku" defaultValue={editingProduct?.sku} className="w-full mt-2 px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-ruby-red/10 transition-all font-mono font-bold" placeholder="RT-BLK-001" />
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-6">
                    <div>
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Market Price (₹)</label>
                       <input name="price" type="number" required defaultValue={editingProduct?.price} className="w-full mt-2 px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100 transition-all font-bold text-emerald-600" />
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Compare At (₹)</label>
                      <input name="originalPrice" type="number" defaultValue={editingProduct?.originalPrice} className="w-full mt-2 px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 transition-all font-bold text-gray-400" />
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Asset Cost (₹)</label>
                      <input name="cost" type="number" defaultValue={editingProduct?.cost} className="w-full mt-2 px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 transition-all font-bold text-ruby-red" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Stock Inventory</label>
                       <input name="stock" type="number" defaultValue={editingProduct?.stock ?? 100} className="w-full mt-2 px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 transition-all font-bold" />
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Classification</label>
                      <select name="category" defaultValue={editingProduct?.category || "Black Tea"} className="w-full mt-2 px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 transition-all font-bold appearance-none">
                         <option>Black Tea</option>
                         <option>Green Tea</option>
                         <option>Herbal Tea</option>
                         <option>Spiced Chai</option>
                         <option>Luxury Gift</option>
                      </select>
                    </div>
                 </div>

                 <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100 shadow-inner">
                    <div className="relative w-32 h-32 rounded-[24px] overflow-hidden border-4 border-white shadow-xl flex-shrink-0 bg-gray-200">
                       {previewImage ? <Image src={previewImage} alt="" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold uppercase text-[10px]">No Asset</div>}
                    </div>
                    <div className="flex-1">
                       <h4 className="text-sm font-black text-gray-800 mb-2 uppercase tracking-wide">Primary Visual Asset</h4>
                       <input type="file" name="file" onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            const r = new FileReader();
                            r.onload = () => setPreviewImage(r.result as string);
                            r.readAsDataURL(f);
                          }
                       }} className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-ruby-red file:text-white file:font-bold cursor-pointer" />
                    </div>
                 </div>

                 <div className="flex justify-between items-center bg-gray-50 p-6 rounded-3xl">
                    <div className="flex items-center gap-2">
                       <input type="checkbox" name="featured" defaultChecked={editingProduct?.featured} className="w-5 h-5 accent-ruby-red" />
                       <span className="text-sm font-bold text-gray-700">Display in Featured Section</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <label className="text-xs font-bold text-gray-400 uppercase">Status:</label>
                       <select name="status" defaultValue={editingProduct?.status || 'active'} className="bg-white px-3 py-1 rounded-lg border-none shadow-sm font-bold text-xs uppercase outline-none">
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                       </select>
                    </div>
                 </div>
              </form>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
                 <button type="button" onClick={handleCloseModal} className="flex-1 py-4 text-sm font-black text-gray-400 hover:text-gray-900 transition-colors">Discard Changes</button>
                 <button
                   disabled={isSubmitting}
                   onClick={() => (document.querySelector('form') as any)?.requestSubmit()}
                   className="flex-[2] py-4 bg-gray-900 text-white rounded-3xl font-black shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3"
                 >
                    {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                    {editingProduct ? 'Update Core Specifications' : 'Authorize New Product'}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
