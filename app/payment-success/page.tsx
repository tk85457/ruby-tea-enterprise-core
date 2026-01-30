'use client';

import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [orderRef] = useState(() => `RT-2024-ARCH-${Math.floor(Math.random() * 9000) + 1000}`);

  useEffect(() => {
    // Simulate verification for demo/refactor purposes
    const timer = setTimeout(() => setStatus('success'), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[var(--bg-site)] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-2 border-[var(--accent-site)] border-t-transparent rounded-full mx-auto mb-12"
          />
          <h1 className="text-3xl font-serif text-[var(--accent-site)] italic">Securing Transaction...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-site)] text-[var(--off-white)]">
      <Header />
      <main className="container mx-auto px-4 py-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto text-center space-y-16"
        >
          {status === 'success' ? (
            <>
              <div className="w-24 h-24 border border-[var(--accent-site)] rounded-full flex items-center justify-center mx-auto mb-12">
                <FaCheckCircle className="text-[var(--accent-site)] text-4xl" />
              </div>

              <div className="space-y-6">
                <h1 className="text-6xl md:text-8xl font-serif font-bold text-[var(--accent-site)]">Confirmed</h1>
                <p className="text-xl text-[var(--off-white)]/40 font-serif italic max-w-xl mx-auto">
                  &quot;Your selection has been officially archived. The legacy of Ruby Tea is now yours to savor.&quot;
                </p>
              </div>

              <div className="bg-[var(--coffee-brown)]/10 p-12 rounded-[3.5rem] border border-[var(--border-site)] inline-block w-full">
                 <div className="grid grid-cols-2 gap-12 text-left uppercase tracking-widest text-[10px] font-bold">
                    <div className="space-y-4">
                       <span className="text-[var(--accent-site)]/40">Reference</span>
                       <p className="text-[var(--off-white)] font-mono text-sm">{orderRef}</p>
                    </div>
                  <div className="space-y-4">
                     <span className="text-[var(--accent-site)]/40">Status</span>
                     <p className="text-[var(--accent-site)] text-sm">Noble Verified</p>
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-8">
              <Link href="/products" className="btn-primary">
                Explore More
              </Link>
              <button onClick={() => window.print()} className="text-[var(--accent-site)] text-xs uppercase tracking-widest font-bold border-b border-[var(--accent-site)] pb-2 transition-all hover:opacity-50">
                 Capture Receipt
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-24 h-24 border border-[var(--maroon-royal)] rounded-full flex items-center justify-center mx-auto mb-12">
              <FaTimesCircle className="text-[var(--maroon-royal)] text-4xl" />
            </div>
            <h1 className="text-6xl font-serif font-bold text-[var(--maroon-royal)]">Interrupted</h1>
            <p className="text-xl text-[var(--off-white)]/40 font-serif italic">The transaction could not be finalized. Please attempt the ritual again.</p>
            <Link href="/checkout" className="btn-primary inline-block">
              Return to Checkout
            </Link>
          </>
        )}
      </motion.div>
    </main>
    <Footer />
  </div>
  );
};

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg-site)] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[var(--accent-site)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
