'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaShoppingCart, FaEye } from 'react-icons/fa';
import { Product } from '../../lib/types';
import { useCart } from '../../lib/CartContext';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-amber-100"
        >
          <Link href={`/products/${product.slug}`} className="block">
            <div className="relative overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
                {product.featured && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Quick Actions Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={!product.inStock}
                    className="p-3 bg-white/90 hover:bg-white text-amber-900 rounded-full transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaShoppingCart size={16} />
                  </button>
                  <Link
                    href={`/products/${product.slug}`}
                    className="p-3 bg-white/90 hover:bg-white text-amber-900 rounded-full transition-all duration-200 transform hover:scale-110"
                  >
                    <FaEye size={16} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={12}
                      className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviewCount})
                </span>
              </div>

              <h3 className="text-lg font-bold text-amber-900 mb-2 line-clamp-2 group-hover:text-red-700 transition-colors duration-200">
                {product.name}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.shortDescription}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-amber-900">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>

                <span className="text-xs text-amber-600 font-semibold bg-amber-100 px-2 py-1 rounded-full">
                  {product.weight}
                </span>
              </div>

              <button
                onClick={(e) => handleAddToCart(e, product)}
                disabled={!product.inStock}
                className={`w-full mt-4 py-3 px-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isInCart(product.id)
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductGrid;
