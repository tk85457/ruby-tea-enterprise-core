'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrash, FaShoppingBag, FaArrowLeft, FaPlus, FaMinus } from 'react-icons/fa';
import Footer from '../../components/Footer';
import { useCart } from '../../lib/CartContext';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const shippingCost = cart.total > 500 ? 0 : 50;
  const taxAmount = Math.round(cart.total * 0.18); // 18% GST
  const finalTotal = cart.total + shippingCost + taxAmount;

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <motion.div
           className="text-center max-w-md mx-auto px-4"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1 }}
        >
          <div className="w-24 h-24 border border-[var(--border-color)] rounded-full flex items-center justify-center mx-auto mb-12">
            <FaShoppingBag size={32} className="text-[var(--accent-hover)] opacity-40" />
          </div>
          <h1 className="text-4xl font-serif text-[var(--text-heading)] mb-6">Empty Archive</h1>
          <p className="text-[var(--text-body)]/40 text-sm mb-12 tracking-widest font-bold uppercase">
             Your cart awaits the selection of noble essences.
          </p>
          <div className="space-y-8">
            <Link href="/products" className="btn-primary block w-full text-center">
              Explore Legacy
            </Link>
            <Link href="/" className="text-[var(--accent-hover)] text-xs uppercase tracking-widest font-bold border-b border-[var(--accent-hover)] pb-2 inline-block">
               Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-body)]">
      {/* Header */}
      <section className="py-24 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
             <Link href="/products" className="flex items-center gap-4 text-[var(--accent-hover)]/60 hover:text-[var(--accent-hover)] transition-all uppercase tracking-widest text-[10px] font-bold">
              <FaArrowLeft size={10} />
              <span>The Collection</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--text-heading)]">
              Selections ({cart.itemCount})
            </h1>
            <button onClick={clearCart} className="text-[var(--accent-hover)] hover:text-[var(--text-heading)] transition-colors text-[10px] uppercase tracking-widest font-bold">
               Clear Archive
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-12">
            {cart.items.map((item, index) => {
              const productId = item.product._id || item.product.id;
              return (
                <motion.div
                  key={productId || `cart-item-${index}`}
                  className="group border-b border-[var(--border-color)] pb-12 last:border-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <div className="flex flex-col sm:flex-row gap-12">
                    <div className="relative w-40 h-40 overflow-hidden rounded-[2rem] bg-[var(--bg-card)] border border-[var(--border-color)]">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000"
                      />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-3xl font-serif font-bold text-[var(--text-heading)]">{item.product.name}</h3>
                        <button onClick={() => removeFromCart(productId)} className="text-[var(--text-body)]/40 hover:text-[var(--accent-hover)] transition-colors">
                          <FaTrash size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-8 text-[var(--accent-hover)]/60 text-sm font-bold tracking-widest uppercase">
                        <span>₹{item.product.price}</span>
                        <div className="h-[1px] w-8 bg-[var(--border-color)]" />
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center border border-[var(--border-color)] rounded-full px-4 py-2">
                          <button onClick={() => updateQuantity(productId, item.quantity - 1)} className="text-[var(--accent-hover)] hover:opacity-50" disabled={item.quantity <= 1}>
                            <FaMinus size={10} />
                          </button>
                          <span className="px-6 text-sm font-bold min-w-[3rem] text-center font-serif">{item.quantity}</span>
                          <button onClick={() => updateQuantity(productId, item.quantity + 1)} className="text-[var(--accent-hover)] hover:opacity-50">
                            <FaPlus size={10} />
                          </button>
                        </div>
                        <div className="text-2xl font-serif text-[var(--accent-hover)]">₹{item.product.price * item.quantity}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <motion.div
               className="bg-[var(--bg-card)] p-12 rounded-[3.5rem] border border-[var(--border-color)] sticky top-32"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
             >
              <h2 className="text-3xl font-serif font-bold text-[var(--text-heading)] mb-12">Archive Summary</h2>
              <div className="space-y-6 text-xs font-bold uppercase tracking-[0.2em]">
                <div className="flex justify-between text-[var(--text-body)]/40">
                  <span>Subtotal</span>
                   <span>₹{cart.total}</span>
                </div>
                <div className="flex justify-between text-[var(--text-body)]/40">
                  <span>Transport</span>
                   <span className={shippingCost === 0 ? 'text-[var(--accent-hover)]' : ''}>
                    {shippingCost === 0 ? 'Heritage Free' : `₹${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-[var(--text-body)]/40">
                  <span>Custom Tax (18%)</span>
                   <span>₹{taxAmount}</span>
                </div>
                <div className="border-t border-[var(--border-color)] pt-8">
                  <div className="flex justify-between text-2xl font-serif text-[var(--accent-hover)]">
                     <span>Legacy Total</span>
                     <span>₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary block w-full text-center mt-12">
                 Proceed to Checkout
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
