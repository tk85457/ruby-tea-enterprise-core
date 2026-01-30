'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaCreditCard, FaLock, FaTruck, FaShieldAlt } from 'react-icons/fa';
import { useCart } from '../../lib/CartContext';
import { CustomerDetails } from '../../lib/types';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cart.items.length === 0) {
      router.push('/cart');
    }
  }, [cart.items.length, router]);

  const shippingCost = cart.total > 500 ? 0 : 50;
  const taxAmount = Math.round(cart.total * 0.18);
  const finalTotal = cart.total + shippingCost + taxAmount;

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCustomerDetails((prev: any) => ({
        ...prev,
        address: { ...prev.address, [child]: value }
      }));
    } else {
      setCustomerDetails((prev: any) => ({ ...prev, [field]: value }));
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    clearCart();
    router.push('/payment-success');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-site)] text-[var(--off-white)]">
      <Header />

      {/* Banner */}
      <section className="py-24 border-b border-[var(--border-site)] bg-[var(--coffee-dark)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <Link href="/cart" className="flex items-center gap-4 text-[var(--accent-site)]/60 hover:text-[var(--accent-site)] transition-all uppercase tracking-widest text-[10px] font-bold">
              <FaArrowLeft size={10} />
              <span>Back to Selection</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--accent-site)]">Finalizing</h1>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
          {/* Form */}
          <div className="space-y-24">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              <h2 className="text-4xl font-serif font-bold text-[var(--accent-site)] pb-8 border-b border-[var(--border-site)]">Shipping Narrative</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                   <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-site)]/60 mb-4 block">Identity First</label>
                   <input
                    type="text"
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full bg-transparent border-b border-[var(--border-site)] py-4 text-[var(--off-white)] placeholder-[var(--off-white)]/20 focus:outline-none focus:border-[var(--accent-site)] font-serif italic text-lg"
                    placeholder="First Name"
                  />
                </div>
                <div>
                   <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-site)]/60 mb-4 block">Identity Last</label>
                   <input
                    type="text"
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full bg-transparent border-b border-[var(--border-site)] py-4 text-[var(--off-white)] placeholder-[var(--off-white)]/20 focus:outline-none focus:border-[var(--accent-site)] font-serif italic text-lg"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-site)]/60 mb-4 block">Archive Channel</label>
                  <input
                    type="email"
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-transparent border-b border-[var(--border-site)] py-4 text-[var(--off-white)] placeholder-[var(--off-white)]/20 focus:outline-none focus:border-[var(--accent-site)] font-serif italic text-lg"
                    placeholder="Email Address"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-site)]/60 mb-4 block">Direct Line</label>
                  <input
                    type="tel"
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full bg-transparent border-b border-[var(--border-site)] py-4 text-[var(--off-white)] placeholder-[var(--off-white)]/20 focus:outline-none focus:border-[var(--accent-site)] font-serif italic text-lg"
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-site)]/60 mb-4 block">Destination Street</label>
                <input
                  type="text"
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  className="w-full bg-transparent border-b border-[var(--border-site)] py-4 text-[var(--off-white)] placeholder-[var(--off-white)]/20 focus:outline-none focus:border-[var(--accent-site)] font-serif italic text-lg"
                  placeholder="Street Address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-site)]/60 mb-4 block">City</label>
                  <input type="text" onChange={(e) => handleInputChange('address.city', e.target.value)} className="w-full bg-transparent border-b border-[var(--border-site)] py-4 text-[var(--off-white)] placeholder-[var(--off-white)]/20 focus:outline-none focus:border-[var(--accent-site)] font-serif italic text-lg" placeholder="City" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-site)]/60 mb-4 block">State</label>
                  <input type="text" onChange={(e) => handleInputChange('address.state', e.target.value)} className="w-full bg-transparent border-b border-[var(--border-site)] py-4 text-[var(--off-white)] placeholder-[var(--off-white)]/20 focus:outline-none focus:border-[var(--accent-site)] font-serif italic text-lg" placeholder="State" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-site)]/60 mb-4 block">Pincode</label>
                  <input type="text" onChange={(e) => handleInputChange('address.pincode', e.target.value)} className="w-full bg-transparent border-b border-[var(--border-site)] py-4 text-[var(--off-white)] placeholder-[var(--off-white)]/20 focus:outline-none focus:border-[var(--accent-site)] font-serif italic text-lg" placeholder="Pincode" />
                </div>
              </div>
            </motion.div>

            <motion.div
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               className="p-12 rounded-[3.5rem] bg-[var(--maroon-royal)]/5 border border-[var(--border-site)]"
            >
               <div className="flex items-center gap-6 mb-8 text-[var(--accent-site)]">
                  <FaShieldAlt size={32} />
                  <h3 className="text-3xl font-serif font-bold">Noble Security</h3>
               </div>
               <p className="text-[var(--off-white)]/40 text-sm leading-relaxed font-serif italic">
                 Your transition is guarded by industry-leading encryption. We prioritize your privacy as much as our heritage.
               </p>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            <motion.div
               className="bg-[var(--coffee-brown)]/10 p-12 rounded-[4rem] border border-[var(--border-site)] sticky top-32"
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
            >
              <h2 className="text-3xl font-serif font-bold text-[var(--accent-site)] mb-12">Noble Archive</h2>
              <div className="space-y-10 mb-12">
                {cart.items.map((item) => (
                  <div key={item.product._id} className="flex gap-8 group">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[var(--coffee-brown)]/20 border border-[var(--border-site)]">
                       <Image src={item.product.image} alt={item.product.name} fill className="object-cover opacity-80" />
                    </div>
                    <div className="flex-1">
                       <h4 className="text-lg font-serif font-bold text-[var(--off-white)]">{item.product.name}</h4>
                       <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--off-white)]/20">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-[var(--accent-site)] font-serif">₹{item.product.price * item.quantity}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--border-site)] pt-10 space-y-6 text-[10px] uppercase tracking-[0.2em] font-bold">
                 <div className="flex justify-between text-[var(--off-white)]/30">
                    <span>Selections</span>
                    <span>₹{cart.total}</span>
                 </div>
                 <div className="flex justify-between text-[var(--off-white)]/30">
                    <span>Transport</span>
                    <span>{shippingCost === 0 ? 'Heritage Free' : `₹${shippingCost}`}</span>
                 </div>
                 <div className="flex justify-between text-[var(--off-white)]/30">
                    <span>Tax Account</span>
                    <span>₹{taxAmount}</span>
                 </div>
                 <div className="border-t border-[var(--border-site)] pt-8 flex justify-between text-2xl font-serif text-[var(--accent-site)]">
                    <span>Final Legacy</span>
                    <span>₹{finalTotal}</span>
                 </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="btn-primary w-full mt-12 text-xs"
              >
                {isProcessing ? 'Processing Transaction...' : `Finalize ₹${finalTotal}`}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
