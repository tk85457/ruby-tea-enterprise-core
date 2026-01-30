'use client';

import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { FaLeaf, FaShoppingBag, FaHeart, FaShippingFast } from 'react-icons/fa';
import { useCart } from '../lib/CartContext';
import { useState, useEffect } from 'react';
import { Product } from '../lib/types';
import dynamic from 'next/dynamic';

const HeroSequence = dynamic(() => import('../components/HeroSequence'), { ssr: false });
// import HeroSequence from '../components/HeroSequence';
import { useRef } from 'react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 12, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1] // Luxury Easing
    }
  }
};

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=4');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Create motion values for text overlays
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  });

  const headlineOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 1, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 0.2, 0.4], [20, 0, -20]);
  const headlineScale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);

  const ctaOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.5], [0, 1, 0]);
  const ctaY = useTransform(scrollYProgress, [0.1, 0.3, 0.5], [20, 0, -30]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-body)] transition-colors duration-500 font-sans selection:bg-[var(--accent)] selection:text-[var(--bg-primary)]">
      <Header />

      {/* Hero Section - Strategic Storytelling Intro */}
      <section ref={heroRef} className="relative h-[250vh] w-full z-0">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Background Animation */}
          <HeroSequence scrollRef={heroRef} />

          {/* Premium Overlays */}
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
            <motion.div
              style={{
                opacity: headlineOpacity,
                y: headlineY,
                scale: headlineScale
              }}
              className="max-w-4xl"
            >
              <span className="text-[var(--accent-hover)] uppercase tracking-[0.4em] font-bold text-xs mb-6 block drop-shadow-lg">
                Established 1974
              </span>
              <h1 className="text-6xl md:text-8xl font-bold font-serif text-[var(--text-heading)] mb-8 leading-tight drop-shadow-2xl">
                The Essence <br /> of Royalty
              </h1>
            </motion.div>

            <motion.div
              style={{
                opacity: ctaOpacity,
                y: ctaY
              }}
              className="pointer-events-auto"
            >
              <p className="text-lg md:text-xl text-[var(--text-body)]/60 mb-12 max-w-xl mx-auto font-serif italic drop-shadow-lg">
                Experience the rhythmic depth of pure, slow-processed Indian heritage tea.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <Link href="/products">
                  <button className="btn-primary px-12 py-5 text-sm shadow-2xl">
                    Explore Collection
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="text-[var(--text-body)]/40 hover:text-[var(--accent-hover)] transition-colors uppercase tracking-widest text-[10px] font-bold border-b border-transparent hover:border-[var(--accent-hover)] pb-1">
                    Our Legacy
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Luxury Aesthetics */}
          <div className="vignette-overlay" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[var(--bg-primary)] to-transparent z-40 pointer-events-none" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-[var(--bg-primary)] border-y border-[var(--border-color)] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[var(--accent-hover)] uppercase tracking-[0.3em] font-bold text-xs mb-4 block"
            >
              Ancestral Wisdom
            </motion.span>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-5xl md:text-6xl font-bold font-serif text-[var(--text-heading)] mb-8"
            >
              The Luxury of Tradition
            </motion.h2>
            <div className="w-24 h-[1px] bg-[var(--accent-hover)] mx-auto opacity-30" />
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Traditional Roots",
                desc: "Rooted in Indian tea heritage, following harvesting wisdom passed down through generations.",
                icon: FaLeaf
              },
              {
                title: "Small Batch Craft",
                desc: "Handcrafted in small batches to preserve the rhythmic depth of every single leaf.",
                icon: FaShoppingBag
              },
              {
                title: "Noble Aroma",
                desc: "A silent luxury that speaks through its scent. Pure, deep, and truly royal.",
                icon: FaHeart
              },
              {
                title: "Export Quality",
                desc: "Crafted for those who appreciate depth. Delivering Bihar's finest to the global elite.",
                icon: FaShippingFast
              }
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-[var(--bg-card)] p-12 rounded-[2.5rem] border border-[var(--border-color)] text-center transition-all duration-700 hover:border-[var(--text-heading)]"
              >
                <feature.icon className="text-3xl text-[var(--accent-hover)] mx-auto mb-10 opacity-60" />
                <h3 className="text-lg font-bold font-serif text-[var(--text-heading)] mb-6 tracking-wide">{feature.title}</h3>
                <p className="text-[var(--text-body)]/40 leading-relaxed text-xs font-medium uppercase tracking-widest">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 bg-[var(--bg-site)] relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl text-left">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-[var(--accent-hover)] uppercase tracking-[0.3em] font-bold text-xs mb-4 block"
              >
                The Collection
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-5xl md:text-6xl font-bold font-serif text-[var(--text-heading)]"
              >
                Noble Blends
              </motion.h2>
            </div>
            <Link href="/products">
              <motion.button
                whileHover={{ x: 5 }}
                className="text-[var(--accent-hover)] font-bold uppercase tracking-[0.2em] text-[10px] border-b border-[var(--accent-hover)] pb-2 transition-all"
              >
                Explore Full Legacy
              </motion.button>
            </Link>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {products.map((product, idx) => (
              <motion.div
                key={product._id || product.id || `product-${idx}`}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="group cursor-pointer relative"
              >
                <Link href={`/products/${product.slug || product._id}`} className="absolute inset-0 z-10" aria-label={`View ${product.name}`} />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[var(--bg-card)] mb-10 border border-[var(--border-color)]">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[var(--text-heading)]/10 font-serif italic text-4xl">RUBY</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-60" />
                </div>
                <h3 className="text-xl font-bold font-serif text-[var(--text-heading)] mb-3 tracking-wide">{product.name}</h3>
                <div className="flex items-center gap-6">
                   <span className="text-[var(--accent-hover)] font-bold text-lg">₹{product.price}</span>
                   <div className="h-[1px] flex-grow bg-[var(--border-color)]" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-[var(--coffee-brown)]/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[var(--accent-hover)] uppercase tracking-[0.3em] font-bold text-xs mb-4 block"
            >
              Testimony
            </motion.span>
            <motion.h2
              className="text-5xl md:text-6xl font-bold font-serif text-[var(--text-heading)]"
            >
              Voices of Depth
            </motion.h2>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { name: 'Aarav Gupta', text: 'Truly authentic and rich in flavor. A rhythmic journey in every sip.', location: 'Delhi' },
              { name: 'Priya Sharma', text: 'Crafted for those who appreciate the true art of fine tea.', location: 'Mumbai' },
              { name: 'Vikram Singh', text: 'Ruby Tea has a consistent excellence that speaks of legacy.', location: 'Bangalore' },
            ].map((testimonial) => (
              <motion.div
                key={`${testimonial.name}-${testimonial.location}`}
                className="text-center"
                variants={itemVariants}
              >
                <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center text-xl font-bold text-white mb-10 mx-auto shadow-2xl">
                  {testimonial.name[0]}
                </div>
                <p className="text-[var(--text-body)]/60 text-lg italic mb-10 leading-relaxed font-serif px-4">
                  "{testimonial.text}"
                </p>
                <h4 className="font-bold text-[var(--accent-hover)] text-xs uppercase tracking-[0.3em]">{testimonial.name}</h4>
                <p className="text-[var(--text-body)]/20 text-[10px] tracking-[0.2em] uppercase font-bold mt-2">{testimonial.location}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-[var(--bg-primary)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--accent)]/5 pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            className="text-6xl md:text-8xl font-bold font-serif text-[var(--text-heading)] mb-12"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
          >
            Savor the Royalty
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl text-[var(--text-body)]/40 max-w-2xl mx-auto mb-20 leading-relaxed font-serif italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            "Export-ready excellence, crafted for those who appreciate the true depth of heritage."
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-12 justify-center items-center">
            <Link href="/products">
              <motion.button className="btn-primary">
                Explore Collection
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button className="btn-secondary">
                Speak with Us
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
