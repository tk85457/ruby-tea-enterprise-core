'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../lib/CartContext';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { Product } from '../../lib/types';

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-body)] selection:bg-[var(--accent)] selection:text-[var(--bg-primary)] transition-colors duration-500">
      <Header />

      {/* Banner */}
      <section className="py-40 bg-[var(--bg-primary)] relative border-b border-[var(--border-color)]">
        <div className="absolute inset-0 bg-[var(--accent)]/5 pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[var(--accent-hover)] uppercase tracking-[0.4em] font-bold text-xs mb-8 block"
          >
            The Archive
          </motion.span>
          <motion.h1
            className="text-6xl md:text-8xl font-bold font-serif mb-12 text-[var(--text-heading)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Noble Blends
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl max-w-2xl mx-auto text-[var(--text-body)]/40 font-serif italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            "A curated collection of handcrafted tea essences, rooted in generations of ancestral wisdom."
          </motion.p>
        </div>
      </section>

      {/* Control Area */}
      <section className="py-12 bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="relative w-full md:w-1/2">
               <input
                type="text"
                placeholder="Search the archive..."
                className="w-full bg-transparent border-b border-[var(--border-color)] p-4 pl-0 text-[var(--text-body)] placeholder-[var(--text-body)]/20 focus:outline-none focus:border-[var(--text-heading)] transition-all font-serif text-xl italic"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--text-heading)]/40" />
            </div>

            <div className="flex items-center gap-8 w-full md:w-auto">
               <span className="text-[var(--accent-hover)] uppercase tracking-widest text-[10px] font-bold">Category:</span>
               <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {['all', 'black', 'green', 'masala', 'elaichi'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-[10px] uppercase tracking-widest font-bold px-6 py-2 rounded-full border transition-all ${
                        selectedCategory === cat
                        ? 'bg-[var(--text-heading)] text-[var(--bg-primary)] border-[var(--text-heading)]'
                        : 'border-[var(--border-color)] text-[var(--text-body)]/40 hover:border-[var(--text-heading)]/60'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          {loading ? (
             <div className="text-center py-40">
                <div className="w-12 h-12 border-2 border-[var(--accent-hover)] border-t-transparent rounded-full animate-spin mx-auto mb-8" />
                <p className="text-[var(--text-heading)] font-serif italic tracking-widest">Mastering the blend...</p>
             </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-40 border border-[var(--border-color)] rounded-[3rem]">
              <h3 className="text-3xl font-bold text-[var(--text-body)] mb-4 font-serif">Empty Space</h3>
              <p className="text-[var(--text-body)]/30 text-sm tracking-widest">A unique taste awaits your exploration.</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-16"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product._id || product.id || `product-${idx}`}
                  className="group"
                  variants={itemVariants}
                >
                   <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[var(--bg-card)] border border-[var(--border-color)] mb-8 transition-colors duration-500">
                     <Link href={`/products/${product.slug || product._id || product.id}`} className="absolute inset-0 z-0" aria-label={`View ${product.name}`} />
                     {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[var(--text-heading)]/10 font-serif italic text-4xl uppercase">RUBY</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-60" />
                  </div>

                   <div className="text-center px-4 relative z-10">
                    <Link href={`/products/${product.slug || product._id || product.id}`}>
                     <h3 className="text-2xl font-bold font-serif text-[var(--text-heading)] mb-2 tracking-wide group-hover:text-[var(--accent-hover)] transition-colors">{product.name}</h3>
                    </Link>
                    <div className="flex items-center justify-center gap-4 mb-8">
                       <span className="text-[var(--accent-hover)] font-bold text-lg tracking-widest">₹{product.price}</span>
                       <div className="h-[1px] w-8 bg-[var(--accent-hover)] opacity-30" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}
                      className="btn-primary w-full text-xs relative z-20 cursor-pointer"
                    >
                      Inquire Essence
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}