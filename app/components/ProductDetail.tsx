import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaStar, FaShoppingCart, FaHeart, FaShare, FaLeaf, FaWeight, FaClock, FaCheck, FaMinus, FaPlus, FaTimes, FaShieldAlt } from 'react-icons/fa';
import { Product } from '../../lib/types';
import { useCart } from '../../lib/CartContext';
import { products } from '../../data/products';
import Footer from '../../components/Footer';

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const relatedProducts = products
    .filter(p => p.category === product.category && p._id !== product._id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      alert('Please fill in all details for your delivery experience.');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customerInfo,
          items: [{
            productId: product._id,
            name: product.name,
            quantity: quantity,
            price: product.price
          }],
          total: product.price * quantity
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_7f1XfW6n6P9p1U',
        amount: data.amount,
        currency: data.currency,
        name: 'RUBY TEA',
        description: `Experience the essence of ${product.name}`,
        order_id: data.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              router.push(`/payment-success?orderId=${data.orderId}`);
            } else {
              alert('Payment verification failed. Please contact our support archive.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('An error occurred during verification.');
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        theme: {
          color: '#3B2416',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Order creation error:', err);
      alert('Failed to initiate transaction. Please try again.');
    } finally {
      setIsProcessing(false);
      setIsBuyModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-site)] text-[var(--off-white)]">
      {/* Breadcrumb */}
      <div className="border-b border-[var(--border-site)] bg-[var(--coffee-dark)]">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--off-white)]/30">
            <Link href="/" className="hover:text-[var(--accent-site)]">Archive</Link>
            <span className="mx-4 opacity-20">/</span>
            <Link href="/products" className="hover:text-[var(--accent-site)]">Collections</Link>
            <span className="mx-4 opacity-20">/</span>
            <span className="text-[var(--accent-site)]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">
            {/* Gallery */}
            <div className="space-y-12">
              <motion.div
                className="aspect-[4/5] relative overflow-hidden rounded-[3.5rem] bg-[var(--coffee-brown)]/20 border border-[var(--border-site)] group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000"
                />
              </motion.div>

              <div className="grid grid-cols-4 gap-6">
                 {[product.image, product.image, product.image].map((img, i) => (
                    <div key={i} className="aspect-square relative rounded-2xl overflow-hidden border border-[var(--border-site)] bg-[var(--coffee-brown)]/10 cursor-pointer hover:border-[var(--accent-site)] transition-all">
                       <Image src={img} alt="alt" fill className="object-cover opacity-40 hover:opacity-100" />
                    </div>
                 ))}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-16">
              <div>
                <motion.span
                  className="text-[var(--accent-site)] uppercase tracking-[0.4em] font-bold text-[10px] mb-8 block"
                >
                  {product.category} Essence
                </motion.span>
                <motion.h1
                  className="text-6xl md:text-8xl font-serif font-bold text-[var(--off-white)] mb-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {product.name}
                </motion.h1>
                <div className="flex items-center gap-6 mb-12">
                   <span className="text-4xl font-serif text-[var(--accent-site)]">₹{product.price}</span>
                   <div className="h-[1px] w-12 bg-[var(--accent-site)] opacity-30" />
                   <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--off-white)]/20">{product.weight}</span>
                </div>
                <p className="text-xl text-[var(--off-white)]/50 leading-relaxed font-serif italic max-w-xl">
                  &quot;{product.description}&quot;
                </p>
              </div>

              {/* Interaction */}
              <div className="space-y-12 bg-[var(--coffee-brown)]/10 p-12 rounded-[3.5rem] border border-[var(--border-site)]">
                 <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="flex items-center border border-[var(--border-site)] rounded-full px-6 py-3 w-full sm:w-auto justify-between sm:justify-center">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-[var(--accent-site)] hover:opacity-50">
                        <FaMinus size={12} />
                      </button>
                      <span className="px-8 text-lg font-serif font-bold min-w-[4rem] text-center">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="text-[var(--accent-site)] hover:opacity-50">
                        <FaPlus size={12} />
                      </button>
                    </div>
                    <div className="flex gap-4 w-full">
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 h-16 rounded-full border border-[var(--border-site)] text-[var(--off-white)] hover:bg-[var(--accent-site)] hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
                      >
                        {isInCart(product._id) ? 'In Archive' : 'Add to Archive'}
                      </button>
                      <button className="w-16 h-16 rounded-full border border-[var(--border-site)] flex items-center justify-center text-[var(--off-white)]/40 hover:text-[var(--maroon-royal)] hover:border-[var(--maroon-royal)] transition-all">
                        <FaHeart />
                      </button>
                    </div>
                 </div>

                 <button
                   onClick={() => setIsBuyModalOpen(true)}
                   className="btn-primary w-full text-sm"
                 >
                   Buy Essence Now
                 </button>
              </div>

              {/* Heritage Notes */}
              <div className="grid grid-cols-2 gap-12 pt-8 border-t border-[var(--border-site)]">
                 <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-site)]">The Ritual</h4>
                    <p className="text-sm text-[var(--off-white)]/40 font-serif leading-relaxed italic">3-5 minutes of silent brewing in mountain water.</p>
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-site)]">Integrity</h4>
                    <p className="text-sm text-[var(--off-white)]/40 font-serif leading-relaxed italic">Small batch harvested. No artificial synthetics.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Info Modal */}
      <AnimatePresence>
        {isBuyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBuyModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-[var(--coffee-dark)] rounded-[4rem] border border-[var(--border-site)] p-12 overflow-hidden"
            >
              <button
                onClick={() => setIsBuyModalOpen(false)}
                className="absolute top-8 right-8 text-[var(--off-white)]/30 hover:text-[var(--off-white)] transition-all"
              >
                <FaTimes size={24} />
              </button>

              <div className="space-y-12">
                <div>
                  <h2 className="text-4xl font-serif font-bold text-[var(--accent-site)] mb-4">The Final Passage</h2>
                  <p className="text-[var(--off-white)]/40 text-sm font-serif italic">Provide your destination for this tea narrative.</p>
                </div>

                <form onSubmit={handleBuyNow} className="space-y-10">
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                         <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-site)]/60 block">Guardian Name</label>
                         <input
                           required
                           type="text"
                           value={customerInfo.name}
                           onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                           className="w-full bg-transparent border-b border-[var(--border-site)] py-4 text-[var(--off-white)] placeholder-[var(--off-white)]/20 focus:outline-none focus:border-[var(--accent-site)] font-serif italic text-lg"
                           placeholder="Full Name"
                         />
                       </div>
                       <div className="space-y-4">
                         <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-site)]/60 block">Archive Channel</label>
                         <input
                           required
                           type="email"
                           value={customerInfo.email}
                           onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                           className="w-full bg-transparent border-b border-[var(--border-site)] py-4 text-[var(--off-white)] placeholder-[var(--off-white)]/20 focus:outline-none focus:border-[var(--accent-site)] font-serif italic text-lg"
                           placeholder="Email Address"
                         />
                       </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-site)]/60 block">Direct Line</label>
                      <input
                        required
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        className="w-full bg-transparent border-b border-[var(--border-site)] py-4 text-[var(--off-white)] placeholder-[var(--off-white)]/20 focus:outline-none focus:border-[var(--accent-site)] font-serif italic text-lg"
                        placeholder="Phone Number"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-site)]/60 block">Destination Essence</label>
                      <textarea
                        required
                        rows={3}
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                        className="w-full bg-transparent border border-[var(--border-site)] rounded-3xl p-6 text-[var(--off-white)] placeholder-[var(--off-white)]/20 focus:outline-none focus:border-[var(--accent-site)] font-serif italic text-lg resize-none"
                        placeholder="Complete Delivery Address"
                      />
                    </div>
                  </div>

                  <div className="bg-[var(--maroon-royal)]/5 p-8 rounded-3xl border border-[var(--border-site)] flex items-center gap-6">
                    <FaShieldAlt className="text-[var(--accent-site)]" size={24} />
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--off-white)]/40">Secure Passage via Razorpay</p>
                  </div>

                  <button
                    disabled={isProcessing}
                    type="submit"
                    className="btn-primary w-full"
                  >
                    {isProcessing ? 'Mastering the Blend...' : `Finalize Purchase - ₹${product.price * quantity}`}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Narrative Section */}
      <section className="py-40 bg-[var(--coffee-dark)] relative overflow-hidden">
         <div className="absolute inset-0 bg-[var(--maroon-royal)]/5 pointer-events-none" />
         <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-5xl font-serif font-bold text-[var(--accent-site)] mb-12">Export-Ready Excellence</h2>
            <p className="text-xl text-[var(--off-white)]/30 max-w-3xl mx-auto font-serif italic leading-relaxed">
              &quot;Every leaf in the {product.name} collection undergoes a meticulous selection process. Rooted in the ancestral wisdom of Gaya, we bring you a taste that transcends borders.&quot;
            </p>
         </div>
      </section>

      {/* Related */}
      {relatedProducts.length > 0 && (
         <section className="py-32">
            <div className="container mx-auto px-4">
               <h3 className="text-3xl font-serif font-bold text-[var(--accent-site)] mb-20 text-center uppercase tracking-[0.2em]">Other Legacies</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                  {relatedProducts.map((p) => (
                    <Link key={p._id} href={`/products/${p.slug}`} className="group block text-center">
                       <div className="aspect-[4/5] relative rounded-[2.5rem] bg-[var(--coffee-brown)]/20 border border-[var(--border-site)] mb-8 overflow-hidden">
                          <Image src={p.image} alt={p.name} fill className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
                       </div>
                       <h4 className="text-2xl font-serif font-bold text-[var(--off-white)] group-hover:text-[var(--accent-site)] transition-colors">{p.name}</h4>
                       <p className="text-[var(--accent-site)]/60 font-bold tracking-widest text-[10px] uppercase mt-4">₹{p.price}</p>
                    </Link>
                  ))}
               </div>
            </div>
         </section>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
