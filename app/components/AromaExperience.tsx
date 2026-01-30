import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useRef, useMemo, useState } from 'react';
import { FaLeaf, FaStar } from 'react-icons/fa';

const AromaExperience = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]);

  const [selectedTea, setSelectedTea] = useState(0);

  const teas = useMemo(() => [
    {
      name: "Ruby Earl Grey",
      description: "A delicate blend of Ceylon black tea with bergamot and ruby dust, offering a sophisticated and vibrant taste experience.",
      benefits: ["Calming", "Digestive", "Antioxidant-rich"],
      aroma: "Citrusy with floral notes"
    },
    {
      name: "Ruby Green Tea",
      description: "Premium green tea leaves infused with natural ruby extracts, delivering a refreshing and healthful beverage.",
      benefits: ["Metabolism Boost", "Rich in Antioxidants", "Detoxifying"],
      aroma: "Fresh and grassy with subtle ruby essence"
    },
    {
      name: "Ruby Chai",
      description: "Traditional Indian masala chai with a modern twist, enhanced with ruby infusions for an exotic experience.",
      benefits: ["Warming", "Digestive", "Energy Boost"],
      aroma: "Spicy and aromatic with cardamom and ruby notes"
    }
  ], []);

  return (
    <section ref={ref} className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--reddish-brown)]/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-5xl md:text-7xl font-bold text-[var(--soft-cream)] mb-6 font-serif"
            style={{ y }}
          >
            The Ruby Essence
          </motion.h2>
          <motion.p
            className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed"
            style={{ y }}
          >
            Discover the unique aroma and taste profile of our premium Ruby Tea collection,
            each blend crafted to perfection with natural ruby infusions.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8"
            style={{ scale }}
          >
            {teas.map((tea, index) => (
              <motion.div
                key={index}
                className={`p-8 rounded-3xl cursor-pointer transition-all duration-500 backdrop-blur-md ${
                  selectedTea === index
                    ? 'bg-white/10 border-2 border-[var(--gold)] shadow-[0_0_30px_rgba(212,175,55,0.1)]'
                    : 'bg-white/5 border border-white/10 hover:border-white/20'
                }`}
                onClick={() => setSelectedTea(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center">
                    <FaLeaf className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--soft-cream)] mb-2 font-serif">{tea.name}</h3>
                    <p className="text-white/50 mb-4 leading-relaxed">{tea.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tea.benefits.map((benefit, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-[var(--reddish-brown)]/20 text-[var(--gold)] border border-[var(--gold)]/20 px-3 py-1 rounded-full uppercase tracking-tighter"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-[var(--gold)]/70">
                      <FaStar className="mr-2 text-[var(--gold)]" />
                      <span className="font-bold text-sm uppercase tracking-widest">{tea.aroma}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="aspect-square bg-gradient-to-br from-zinc-800 to-black rounded-3xl shadow-2xl flex items-center justify-center p-12 border border-white/10">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-[var(--reddish-brown)] to-[var(--gold)] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-pulse">
                  <FaLeaf className="text-white text-6xl" />
                </div>
                <h3 className="text-3xl font-bold text-[var(--soft-cream)] mb-2 font-serif">{teas[selectedTea].name}</h3>
                <p className="text-[var(--gold)] font-bold tracking-widest uppercase text-sm">Ruby Infused</p>
              </div>
            </div>

            <motion.div
              className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <FaLeaf className="text-white text-xl" />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-[var(--soft-cream)] mb-10 font-serif">Aroma Profile</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {['Earthy', 'Floral', 'Fruity', 'Spicy'].map((note, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-[var(--gold)]/30 transition-all group"
                whileHover={{ y: -10 }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--reddish-brown)] to-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <FaLeaf className="text-[var(--gold)]" size={24} />
                </div>
                <h4 className="font-bold text-[var(--soft-cream)] uppercase tracking-widest text-sm">{note} Notes</h4>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AromaExperience;