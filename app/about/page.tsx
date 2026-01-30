'use client';

import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-body)] transition-colors duration-500 selection:bg-[var(--accent)] selection:text-[var(--bg-primary)]">
      <Header />

      <main className="container mx-auto px-4 py-40">
        <div className="text-center mb-32">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[var(--accent-hover)] uppercase tracking-[0.5em] font-bold text-xs mb-8 block"
          >
            Since Generations
          </motion.span>
          <motion.h1
            className="text-7xl md:text-9xl font-serif font-bold text-[var(--text-heading)] mb-12"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Our Legacy
          </motion.h1>
          <div className="w-24 h-[1px] bg-[var(--accent-hover)] mx-auto opacity-30" />
        </div>

        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-3xl md:text-4xl leading-relaxed text-[var(--text-body)] text-center font-serif italic mb-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1.5 }}
          >
            <p className="max-w-4xl mx-auto">
              "To sip Ruby Tea is to participate in a rhythm that has played for centuries.
              We are not just blenders; we are keepers of the ancestral fire born in Gaya, Bihar."
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mb-40">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <h2 className="text-5xl font-bold text-[var(--text-heading)] font-serif">Noble Roots</h2>
              <p className="text-[var(--text-body)]/50 text-xl leading-relaxed font-serif">
                Born at the historic <span className="text-[var(--accent-hover)] italic">Panchatiya Akhara</span>, our heritage is etched into the very soil where our leaves are celebrated.
                We honor the rhythmic patterns of harvest that our ancestors perfected.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="bg-[var(--bg-card)] p-16 rounded-[4rem] border border-[var(--border-color)]"
            >
               <h2 className="text-5xl font-bold text-[var(--text-heading)] font-serif mb-12">The Promise</h2>
                <p className="text-[var(--text-body)]/40 text-lg leading-relaxed uppercase tracking-widest font-bold text-xs">
                  We define luxury as the absolute absence of compromise. Small batch purity, ancestral wisdom, and export-ready excellence for the most discerning palates.
                </p>
            </motion.div>
          </div>

          <motion.div
            className="text-center py-20 border-t border-[var(--border-color)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <p className="text-[var(--text-body)]/30 text-sm tracking-[0.4em] uppercase font-bold">
              Crafted for those who appreciate depth.
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}