'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import {
  FaCog, FaSave, FaShieldAlt, FaTruck,
  FaGlobe, FaEnvelope, FaBell, FaSpinner
} from 'react-icons/fa';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SettingsPage() {
  const { data, isLoading } = useSWR('/api/admin/settings', fetcher);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const settings = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        alert('Settings Synchronized!');
        mutate('/api/admin/settings');
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
    setIsSaving(false);
  };

  if (isLoading) return <div className="py-20 text-center"><FaSpinner className="animate-spin text-ruby-red text-3xl mx-auto" /></div>;

  const s = data?.settings || {};

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Configuration</h1>
        <p className="text-gray-500">Fine-tune the core parameters of the Ruby Tea engine.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Identity */}
        <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-ruby-red/10 text-ruby-red rounded-lg"><FaGlobe /></div>
              <h2 className="text-xl font-bold text-gray-800">Domain & Identity</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Site Name</label>
                 <input name="siteName" defaultValue={s.siteName} className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-ruby-red" />
              </div>
              <div>
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Contact Email</label>
                 <input name="contactEmail" defaultValue={s.contactEmail} className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-ruby-red" />
              </div>
           </div>
        </section>

        {/* Global Logistics */}
        <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FaTruck /></div>
              <h2 className="text-xl font-bold text-gray-800">Logistics & Tax</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Shipping Fee (₹)</label>
                 <input name="shippingFee" type="number" defaultValue={s.shippingFee} className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-ruby-red" />
              </div>
              <div>
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Free Delivery Threshold (₹)</label>
                 <input name="freeShippingThreshold" type="number" defaultValue={s.freeShippingThreshold} className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-ruby-red" />
              </div>
              <div>
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">GST Rate (%)</label>
                 <input name="taxRate" type="number" defaultValue={s.taxRate} className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-ruby-red" />
              </div>
           </div>
        </section>

        {/* Security & Maintenance */}
        <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><FaShieldAlt /></div>
              <h2 className="text-xl font-bold text-gray-800">Operational Integrity</h2>
           </div>
           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                 <p className="font-bold text-gray-800">Maintenance Mode</p>
                 <p className="text-xs text-gray-500">Temporarily disable frontend access for routine maintenance.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="maintenanceMode" defaultChecked={s.maintenanceMode} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ruby-red"></div>
              </label>
           </div>
        </section>

        <div className="flex justify-end">
           <button
             disabled={isSaving}
             type="submit"
             className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-2xl hover:bg-black transition-all flex items-center gap-2 hover:-translate-y-1"
           >
              {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
              Synchronize Global Parameters
           </button>
        </div>
      </form>
    </div>
  );
}
