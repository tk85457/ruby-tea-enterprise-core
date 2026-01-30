'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const AboutRubyTea = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut' as const,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-soft-lavender via-pearl-white to-warm-amber relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23elegant-purple' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center"
          style={{ y, opacity }}
        >
          {/* Text Content */}
          <motion.div
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-900 mb-6">
              A Legacy of Excellence
            </h2>
            <motion.p
              className="text-lg text-amber-800 mb-6 leading-relaxed"
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Ruby Tea embodies the rich tapestry of Indian tea culture, where ancient traditions meet modern craftsmanship. For generations, our family has nurtured the art of tea-making in the heart of Bihar, blending time-honored techniques with cutting-edge quality standards.
            </motion.p>
            <motion.p
              className="text-lg text-amber-800 mb-6 leading-relaxed"
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Every leaf tells a story of dedication, from the misty plantations of Panchatiya Akhara to your cup. We honor the legacy of our ancestors while embracing innovation, ensuring that each sip delivers unparalleled purity and flavor.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-amber-100 p-4 rounded-lg">
                <h4 className="font-semibold text-amber-900 mb-2">Traditional Roots</h4>
                <p className="text-amber-700 text-sm">Sourced from heritage estates with centuries of expertise</p>
              </div>
              <div className="bg-amber-100 p-4 rounded-lg">
                <h4 className="font-semibold text-amber-900 mb-2">Modern Quality</h4>
                <p className="text-amber-700 text-sm">Rigorous testing and sustainable practices</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            className="relative"
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl p-8 shadow-2xl">
              {/* Tea Leaves Illustration */}
              <div className="relative h-80 flex items-center justify-center">
                <motion.div
                  className="absolute"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <svg
                    width="200"
                    height="200"
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-amber-100"
                  >
                    <path
                      d="M100 20C120 20 140 40 140 60C140 80 120 100 100 100C80 100 60 80 60 60C60 40 80 20 100 20Z"
                      fill="currentColor"
                      opacity="0.3"
                    />
                    <path
                      d="M100 100C140 100 170 130 170 170H30C30 130 60 100 100 100Z"
                      fill="currentColor"
                      opacity="0.5"
                    />
                    <circle cx="100" cy="150" r="10" fill="currentColor" opacity="0.7" />
                  </svg>
                </motion.div>

                {/* Floating Elements */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-amber-200 rounded-full"
                    style={{
                      top: `${20 + (i % 4) * 20}%`,
                      left: `${20 + (i % 4) * 20}%`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>

              {/* Quote */}
              <motion.div
                className="text-center mt-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <blockquote className='text-amber-100 font-serif italic text-lg'>
                  &ldquo;Where tradition meets innovation, and every cup tells a story.&rdquo;
                </blockquote>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutRubyTea;
