'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaLeaf, FaStar } from 'react-icons/fa';

interface TeaLeaf {
  id: number;
  size: number;
  position: {
    top: string;
    left: string;
  };
}

interface SteamParticle {
  id: number;
  size: number;
  position: {
    bottom: string;
    left: string;
  };
}

interface AromaParticle {
  id: number;
  size: number;
  position: {
    top: string;
    right: string;
  };
}

interface HeroProps {
  scrollRef?: React.RefObject<HTMLElement | null>;
}

const Hero = ({ scrollRef }: HeroProps) => {
  const [teaLeaves, setTeaLeaves] = useState<TeaLeaf[]>([]);
  const [steamParticles, setSteamParticles] = useState<SteamParticle[]>([]);
  const [aromaParticles, setAromaParticles] = useState<AromaParticle[]>([]);

  // Scroll Progress Logic
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform values driven by scroll
  const cupScale = useTransform(smoothProgress, [0, 1], [1, 1.2]);
  const cupY = useTransform(smoothProgress, [0, 1], [0, -50]);
  const contentOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(smoothProgress, [0, 0.5], [0, -100]);
  const leavesY = useTransform(smoothProgress, [0, 1], [0, -200]);

  useEffect(() => {
    // Generate random values once on mount
    const leaves = [];
    for (let i = 0; i < 12; i++) {
        leaves.push({
            id: i,
            size: Math.random() * 16 + 12,
            position: {
                top: `${15 + Math.random() * 70}%`,
                left: `${5 + Math.random() * 90}%`,
            },
        });
    }
    setTeaLeaves(leaves);

    const particles = [];
    for (let i = 0; i < 6; i++) {
        particles.push({
            id: i,
            size: Math.random() * 12 + 8,
            position: {
                bottom: '35%',
                left: `${35 + i * 6}%`,
            },
        });
    }
    setSteamParticles(particles);

    const aroma = [];
    for (let i = 0; i < 8; i++) {
        aroma.push({
            id: i,
            size: Math.random() * 6 + 4,
            position: {
                top: `${20 + Math.random() * 60}%`,
                right: `${10 + Math.random() * 80}%`,
            },
        });
    }
    setAromaParticles(aroma);
  }, []);

  // Animation variants with slow, cinematic easing
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const titleVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
      },
    },
  };

  const subtitleVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        delay: 0.2,
      },
    },
  };

  const buttonVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.4,
      },
    },
  };

  const steamVariants = {
    animate: {
      y: [-5, -25, -5],
      x: [0, 3, 0],
      opacity: [0.8, 0.4, 0.8],
      scale: [1, 1.1, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
      },
    },
  };

  const leafVariants = {
    float: {
      y: [0, -15, 0],
      x: [0, 8, 0],
      rotate: [0, 5, 0],
      opacity: [0.6, 0.9, 0.6],
      transition: {
        duration: 6,
        repeat: Infinity,
      },
    },
  };

  const aromaParticleVariants = {
    float: {
      y: [0, -20, 0],
      x: [0, 12, 0],
      opacity: [0.3, 0.7, 0.3],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 5,
        repeat: Infinity,
      },
    },
  };

  return (
    <section className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#1C120B] via-[#3B2416] to-[#1C120B]">
      {/* Animated Royal Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-red-800/70 to-amber-900/90"
        animate={{
          background: [
            "linear-gradient(135deg, rgba(153, 27, 27, 0.9), rgba(146, 64, 14, 0.7), rgba(120, 53, 15, 0.9))",
            "linear-gradient(135deg, rgba(146, 64, 14, 0.9), rgba(153, 27, 27, 0.7), rgba(120, 53, 15, 0.9))",
            "linear-gradient(135deg, rgba(153, 27, 27, 0.9), rgba(146, 64, 14, 0.7), rgba(120, 53, 15, 0.9))",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />

      {/* Floating Tea Leaves with Scroll Parallax */}
      <motion.div style={{ y: leavesY }} className="absolute inset-0 z-0">
          {teaLeaves.map((leaf, i) => (
            <motion.div
              key={`leaf-${leaf.id}`}
              className="absolute text-green-400/30"
              style={{
                top: leaf.position.top,
                left: leaf.position.left,
              }}
              variants={leafVariants}
              animate="float"
              custom={i}
            >
              <FaLeaf size={leaf.size} />
            </motion.div>
          ))}
      </motion.div>

      {/* Aroma Particles */}
      {aromaParticles.map((particle, i) => (
        <motion.div
          key={`aroma-${particle.id}`}
          className="absolute w-2 h-2 bg-yellow-300/40 rounded-full"
          style={{
            top: particle.position.top,
            right: particle.position.right,
          }}
          variants={aromaParticleVariants}
          animate="float"
          custom={i}
        />
      ))}

      {/* Central Tea Experience */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div style={{ scale: cupScale, y: cupY }} className="relative">
          {/* Premium Tea Cup */}
          <motion.div
            className="relative w-64 h-64 md:w-80 md:h-80"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 1.5,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.5,
            }}
          >
            {/* Cup Body */}
            <div className="w-full h-full bg-gradient-to-br from-amber-50/30 to-amber-100/20 rounded-full border-4 border-amber-200/40 backdrop-blur-sm flex items-center justify-center shadow-2xl">
              <div className="w-11/12 h-11/12 bg-gradient-to-br from-amber-200/30 to-amber-300/20 rounded-full flex items-center justify-center">
                <div className="w-10/12 h-10/12 bg-gradient-to-br from-amber-300/40 to-amber-400/30 rounded-full flex items-center justify-center">
                  <div className="w-9/12 h-9/12 bg-gradient-to-br from-amber-400/50 to-amber-500/40 rounded-full" />
                </div>
              </div>
            </div>

            {/* Elegant Cup Handle */}
            <motion.div
              className="absolute top-1/2 -right-8 w-6 h-20 rounded-r-full border-4 border-amber-200/40 bg-gradient-to-r from-amber-100/20 to-transparent backdrop-blur-sm"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 1,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 1,
              }}
            />

            {/* Steam Particles */}
            {steamParticles.map((steam, i) => (
              <motion.div
                key={`steam-${steam.id}`}
                className="absolute w-1 h-8 bg-gradient-to-t from-amber-200/60 to-transparent rounded-full"
                style={{
                  bottom: steam.position.bottom,
                  left: steam.position.left,
                  width: steam.size,
                  height: steam.size * 3,
                }}
                variants={steamVariants}
                animate="animate"
                custom={i}
              />
            ))}
          </motion.div>

          {/* Royal Star Accents */}
          <motion.div
            className="absolute -top-8 -left-8 text-yellow-400/60"
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <FaStar size={24} />
          </motion.div>
          <motion.div
            className="absolute -top-6 -right-6 text-yellow-400/60"
            animate={{ rotate: -360 }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <FaStar size={20} />
          </motion.div>
        </motion.div>
      </div>

      {/* Hero Content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center pointer-events-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="mb-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.8,
          }}
        >
          <div className="inline-block px-6 py-2 bg-red-600/20 backdrop-blur-sm rounded-full border border-red-400/30 mb-6">
            <span className="text-red-200 text-sm font-medium tracking-wider uppercase">
              Premium Indian Tea
            </span>
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-7xl lg:text-8xl font-bold text-white mb-6 max-w-5xl font-serif leading-tight"
          variants={titleVariants}
        >
          Every Sip
          <br />
          <span className="text-yellow-300">Tells a Story</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl lg:text-3xl text-amber-100 mb-12 max-w-3xl font-light leading-relaxed"
          variants={subtitleVariants}
        >
          Experience the Royal Aroma of Ruby Tea
          <br />
          <span className="text-amber-200/80 text-lg md:text-xl">Crafted with tradition, served with love</span>
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-6"
          variants={buttonVariants}
        >
          <motion.button
            className="group relative px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-full shadow-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Brew Happiness Today</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.button>

          <motion.button
            className="group px-10 py-5 bg-transparent border-2 border-amber-300/60 text-amber-100 hover:bg-amber-300/10 hover:border-amber-300 font-semibold rounded-full shadow-xl transition-all duration-500 transform hover:scale-105 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Discover Our Story
          </motion.button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-16 flex flex-col sm:flex-row items-center gap-8 text-amber-200/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 1.2,
          }}
        >
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-400" size={16} />
            <span className="text-sm font-medium">1000+ Happy Customers</span>
          </div>
          <div className="flex items-center gap-2">
            <FaLeaf className="text-green-400" size={16} />
            <span className="text-sm font-medium">Daily Fresh Blends</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Authentic Indian Tradition</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Subtle animated overlay for depth */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />
    </section>
  );
};

export default Hero;

