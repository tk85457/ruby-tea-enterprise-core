'use client';

import useSWR, { mutate } from 'swr';
import { useState } from 'react';
import {
  FaTags, FaPlus, FaEdit, FaTrash,
  FaSpinner, FaSort, FaCheck, FaTimes
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CategoriesPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useSWR('/api/admin/categories', fetcher);
  const categories = data?.categories || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      if (res.ok) {
        mutate('/api/admin/categories');
        resetForm();
      }
    } catch (error) {
      console.error('Category operation failed:', error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? Products in this category might be affected.')) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) mutate('/api/admin/categories');
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setName('');
    setDescription('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Taxonomy Manager</h1>
          <p className="text-gray-500">Organize your product catalog into meaningful hierarchies.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-ruby-red text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:bg-black transition-all flex items-center gap-2"
        >
          <FaPlus /> New Category
        </button>
      </div>

      {/* Form Overlay */}
      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 space-y-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Name</label>
                 <input
                   className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-ruby-red transition-all"
                   value={name}
                   onChange={e => setName(e.target.value)}
                   required
                 />
               </div>
               <div>
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Description (Optional)</label>
                 <input
                   className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-ruby-red transition-all"
                   value={description}
                   onChange={e => setDescription(e.target.value)}
                 />
               </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
               <button type="button" onClick={resetForm} className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">Cancel</button>
               <button
                 disabled={isSubmitting}
                 type="submit"
                 className="px-8 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2"
               >
                  {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                  {editingId ? 'Update' : 'Create'} Category
               </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-2 py-20 text-center"><FaSpinner className="animate-spin text-ruby-red text-3xl mx-auto" /></div>
        ) : categories.map((cat: any) => (
          <div key={cat._id} className="bg-white p-6 rounded-3xl shadow-lg border border-gray-50 hover:border-ruby-red/20 transition-all group">
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-ruby-red group-hover:text-white transition-all">
                    <FaTags size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{cat.name}</h3>
                    <p className="text-xs text-gray-400 font-mono">/{cat.slug}</p>
                  </div>
               </div>
               <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                        setEditingId(cat._id);
                        setName(cat.name);
                        setDescription(cat.description || '');
                    }}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                  >
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <FaTrash />
                  </button>
               </div>
            </div>
            {cat.description && <p className="mt-4 text-sm text-gray-500 leading-relaxed">{cat.description}</p>}
          </div>
        ))}
        {categories.length === 0 && !isLoading && !isAdding && (
            <div className="col-span-2 py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 text-center">
                <FaTags className="mx-auto text-4xl text-gray-200 mb-2" />
                <p className="text-gray-400 font-bold uppercase tracking-widest">Workspace is empty</p>
                <p className="text-xs text-gray-300">Create your first category to begin.</p>
            </div>
        )}
      </div>
    </div>
  );
}
