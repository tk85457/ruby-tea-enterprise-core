'use client';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { motion } from 'framer-motion';

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center space-x-4">
        <div className="flex items-center border border-gray-300 rounded-lg bg-white">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 text-xl hover:bg-gray-50 rounded-l-lg">-</button>
          <span className="px-4 font-medium">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="px-4 py-2 text-xl hover:bg-gray-50 rounded-r-lg">+</button>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleAdd}
        className={`w-full md:w-auto px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg ${
          added ? 'bg-deep-green text-white' : 'bg-ruby-red text-white hover:bg-red-700'
        }`}
      >
        {added ? 'Added to Cart ✓' : 'Add to Cart'}
      </motion.button>
    </div>
  );
}
