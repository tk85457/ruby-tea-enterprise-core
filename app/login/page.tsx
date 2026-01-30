'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET;
    if (!ADMIN_SECRET) {
      setError('System configuration error: ADMIN_SECRET missing');
      return;
    }

    if (key === ADMIN_SECRET) {
      localStorage.setItem('ruby_tea_admin_key', key);
      router.push('/dashboard');
    } else {
      setError('Invalid Access Key');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-body)] flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[var(--bg-card)] p-12 rounded-[3rem] border border-[var(--border-color)] text-center"
        >
          <span className="text-[var(--accent-hover)] uppercase tracking-[0.4em] font-bold text-[10px] mb-8 block">
            Security Protocol
          </span>
          <h1 className="text-4xl font-serif font-bold text-[var(--text-heading)] mb-12">
            Admin Access
          </h1>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="text-left">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-hover)]/60 mb-4 block ml-4">
                Secret Archive Key
              </label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border border-[var(--border-color)] rounded-full px-8 py-4 text-[var(--text-body)] placeholder-[var(--text-body)]/20 focus:outline-none focus:border-[var(--accent-hover)] transition-all font-serif"
              />
              {error && <p className="mt-4 text-[10px] text-[var(--accent-hover)] uppercase tracking-widest text-center">{error}</p>}
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
            >
              Authorize
            </button>
          </form>

          <p className="mt-12 text-[10px] text-[var(--text-body)]/20 uppercase tracking-widest font-bold">
            Authorized Personnel Only
          </p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
