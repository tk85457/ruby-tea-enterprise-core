'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';

const CustomerTrust = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [counters, setCounters] = useState({ customers: 0, blends: 0 });

  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setCounters(prev => ({
          customers: prev.customers < 1000 ? prev.customers + 10 : 1000,
          blends: prev.blends < 365 ? prev.blends + 1 : 365,
        }));
      }, 20);

      return () => clearInterval(interval);
    }
  }, [isInView]);

  const starVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        type: 'spring' as const,
        stiffness: 100,
      },
    },
  };

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-amber-100 to-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-serif font-bold text-amber-900 mb-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Trusted by Tea Lovers Worldwide
          </motion.h2>
          <motion.p
            className="text-xl text-amber-700 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of satisfied customers who choose Ruby Tea for its exceptional quality and taste.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Star Ratings */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-amber-900 mb-6">Customer Satisfaction</h3>
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.div
                  key={star}
                  custom={star}
                  variants={starVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                >
                  <FaStar className="text-4xl text-yellow-400 mx-1" />
                </motion.div>
              ))}
            </div>
            <p className="text-amber-700 font-medium">4.9/5 Average Rating</p>
            <p className="text-sm text-amber-600 mt-2">Based on 2,500+ reviews</p>
          </motion.div>

          {/* Counters */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              <div>
                <motion.div
                  className="text-5xl md:text-6xl font-bold text-amber-900 font-serif"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  {counters.customers}+
                </motion.div>
                <p className="text-xl text-amber-700 mt-2">Happy Customers</p>
              </div>
              <div>
                <motion.div
                  className="text-5xl md:text-6xl font-bold text-amber-900 font-serif"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  {counters.blends}
                </motion.div>
                <p className="text-xl text-amber-700 mt-2">Daily Fresh Blends</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CustomerTrust;
