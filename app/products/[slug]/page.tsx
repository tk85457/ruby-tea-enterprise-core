'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShoppingBag, FaClock, FaWater, FaLeaf, FaStar } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/CartContext';
import { Product } from '@/lib/types';
import { MouseParallax } from 'react-just-parallax';
import JSONLD from '@/components/JSONLD';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        const data = await response.json();
        if (data.product) {
          setProduct(data.product);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[var(--accent-hover)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center flex-col gap-4 text-[var(--text-body)]">
        <h2 className="text-2xl font-serif">Essence Not Found</h2>
        <Link href="/products" className="btn-primary">Return to Archive</Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: images,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'RUBY TEA'
    },
    offers: {
      '@type': 'Offer',
      url: `https://rubytea.in/products/${slug}`,
      priceCurrency: 'INR',
      price: product.price,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-body)]">
      <JSONLD data={productSchema} />
      <Header />

      <main className="pt-32 pb-24">
        {/* Navigation Breadcrumb */}
        <div className="container mx-auto px-4 mb-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[var(--accent-hover)] uppercase tracking-widest text-xs font-bold opacity-60 hover:opacity-100 transition-opacity"
          >
            <FaArrowLeft /> Back to Archive
          </Link>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

            {/* Left: Images */}
            <div className="w-full lg:w-1/2 space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card)]"
              >
                <MouseParallax strength={0.05} isAbsolutelyPositioned>
                  <Image
                    src={images[activeImageIndex]}
                    alt={product.name}
                    fill
                    className="object-cover scale-105"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </MouseParallax>
              </motion.div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-center lg:justify-start">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx
                          ? 'border-[var(--accent-hover)] opacity-100'
                          : 'border-transparent opacity-50 hover:opacity-80'
                      }`}
                    >
                      <Image src={img} alt={`${product.name} view ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex items-center gap-4 mb-6">
                   <span className="px-4 py-1 border border-[var(--accent-hover)] rounded-full text-[10px] uppercase tracking-[0.2em] text-[var(--text-heading)] font-bold">
                     {product.category}
                   </span>
                   {product.inStock ? (
                     <span className="text-[var(--accent-hover)] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-[var(--accent-hover)] animate-pulse" /> In Stock
                     </span>
                   ) : (
                     <span className="text-[var(--text-body)]/40 text-xs font-bold uppercase tracking-widest">
                       Currently Unavailable
                     </span>
                   )}
                </div>

                <h1 className="text-5xl md:text-7xl font-serif font-bold text-[var(--text-heading)] mb-8 leading-none">
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-6 mb-12">
                   <span className="text-4xl font-serif text-[var(--accent-hover)]">₹{product.price}</span>
                   {product.originalPrice && (
                     <span className="text-xl text-[var(--text-body)]/40 line-through font-serif decoration-[var(--maroon-royal)]">₹{product.originalPrice}</span>
                   )}
                </div>

                <p className="text-lg text-[var(--text-body)]/80 leading-relaxed font-serif italic mb-12 border-l-2 border-[var(--accent-hover)] pl-6">
                  {product.description}
                </p>

                {/* Add to Cart */}
                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mb-16">
                  <button
                    onClick={() => {
                      addToCart(product!);
                      window.location.href = '/checkout'; // Direct to checkout
                    }}
                    disabled={!product.inStock}
                    className="flex-1 btn-primary py-4 text-sm flex items-center justify-center gap-3 group shadow-lg hover:shadow-[var(--accent)]/20"
                  >
                    <span>{product.inStock ? 'Buy Now' : 'Out of Stock'}</span>
                    <FaShoppingBag className="group-hover:scale-110 transition-transform" />
                  </button>

                  <button
                    onClick={() => addToCart(product!)}
                    disabled={!product.inStock}
                    className="flex-1 btn-secondary py-4 text-sm flex items-center justify-center gap-3 group"
                  >
                    <span>Add to Cart</span>
                  </button>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-8 py-8 border-t border-[var(--border-color)]">
                  {product.weight && (
                     <div className="space-y-2">
                       <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-heading)]/60 font-bold block">Net Weight</span>
                       <span className="font-serif text-xl text-[var(--text-heading)]">{product.weight}</span>
                     </div>
                  )}
                  {product.rating && (
                     <div className="space-y-2">
                       <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-heading)]/60 font-bold block">Rating</span>
                       <div className="flex items-center gap-2 text-[var(--accent-hover)]">
                         <FaStar /> <span className="font-serif text-xl text-[var(--text-heading)]">{product.rating}</span> <span className="text-xs text-[var(--text-body)]/40">({product.reviewCount})</span>
                       </div>
                     </div>
                  )}
                </div>

              </motion.div>
            </div>
          </div>

          {/* Detailed Sections */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-16"
          >
             {/* Brewing Guide */}
             <div className="bg-[var(--bg-card)] p-12 rounded-[3rem] border border-[var(--border-color)]">
               <h3 className="text-3xl font-serif font-bold text-[var(--text-heading)] mb-8 flex items-center gap-4">
                 <FaClock className="text-[var(--accent-hover)]" size={24} /> The Ritual
               </h3>
               <p className="text-[var(--text-body)]/80 leading-loose font-serif text-lg">
                 {product.brewingInstructions}
               </p>
             </div>

             {/* Ingredients / Benefits */}
             <div className="space-y-12">
               {product.ingredients && (
                 <div>
                   <h3 className="text-xl font-bold uppercase tracking-widest text-[var(--text-heading)] mb-6 flex items-center gap-4">
                     <FaLeaf className="text-[var(--accent-hover)]" /> Composition
                   </h3>
                   <div className="flex flex-wrap gap-3">
                     {product.ingredients.map((ing: string, i: number) => (
                       <span key={i} className="px-4 py-2 rounded-full border border-[var(--border-color)] text-sm text-[var(--text-body)]/80 hover:border-[var(--accent-hover)] transition-colors">
                         {ing}
                       </span>
                     ))}
                   </div>
                 </div>
               )}

               {product.benefits && (
                 <div>
                   <h3 className="text-xl font-bold uppercase tracking-widest text-[var(--text-heading)] mb-6 flex items-center gap-4">
                     <FaWater className="text-[var(--accent-hover)]" /> Benevolence
                   </h3>
                   <ul className="grid grid-cols-1 gap-4">
                     {product.benefits.map((benefit: string, i: number) => (
                       <li key={i} className="flex items-center gap-4 text-[var(--text-body)]/70">
                         <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-hover)]" />
                         {benefit}
                       </li>
                     ))}
                   </ul>
                 </div>
               )}
             </div>
          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
