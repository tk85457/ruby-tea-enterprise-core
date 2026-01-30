'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { FaCreditCard, FaLock, FaLeaf, FaStar, FaCrown } from 'react-icons/fa';

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface FloatingElement {
  id: number;
  icon: typeof FaLeaf | typeof FaStar | typeof FaCrown;
  size: number;
  position: {
    top: string;
    left: string;
  };
  duration: number;
  delay: number;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface OrderData {
  id: string;
  amount: number;
  currency: string;
}

const PaymentSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(500); // Default amount in rupees

  const amounts = [
    { value: 250, label: 'Classic Blend - ₹250', icon: FaLeaf, description: 'Traditional taste' },
    { value: 500, label: 'Premium Blend - ₹500', icon: FaStar, description: 'Signature aroma' },
    { value: 750, label: 'Luxury Blend - ₹750', icon: FaCrown, description: 'Royal experience' },
    { value: 1000, label: 'Heritage Collection - ₹1000', icon: FaCrown, description: 'Century-old recipe' },
  ];

  // Create floating elements with stable random values using useRef
  const floatingElementsRef = useRef<FloatingElement[]>([]);

  useEffect(() => {
    if (floatingElementsRef.current.length === 0) {
      const elements: FloatingElement[] = [];
      for (let i = 0; i < 8; i++) {
        elements.push({
          id: i,
          icon: i % 3 === 0 ? FaLeaf : i % 3 === 1 ? FaStar : FaCrown,
          size: Math.random() * 16 + 12,
          position: {
            top: `${10 + Math.random() * 80}%`,
            left: `${5 + Math.random() * 90}%`,
          },
          duration: Math.random() * 8 + 10,
          delay: Math.random() * 3,
        });
      }
      floatingElementsRef.current = elements;
    }
  }, []);

  const floatingElements = floatingElementsRef.current;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async (amount: number) => {
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paisa
          currency: 'INR',
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      const res = await loadRazorpayScript();

      if (!res) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        setIsLoading(false);
        return;
      }

      const orderData = await createOrder(selectedAmount);

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Ruby Tea',
        description: 'Premium Tea Purchase',
        order_id: orderData.id,
        handler: function (response: RazorpaySuccessResponse) {
          // Redirect to success page with payment details
          window.location.href = `/payment-success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}&signature=${response.razorpay_signature}`;
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#d97706', // amber-600
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert('Payment initialization failed. Please try again.');
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-red-900 via-red-800 to-amber-900 overflow-hidden">
      {/* Animated Royal Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-red-900/95 via-red-800/80 to-amber-900/95"
        animate={{
          background: [
            "linear-gradient(135deg, rgba(153, 27, 27, 0.95), rgba(146, 64, 14, 0.8), rgba(120, 53, 15, 0.95))",
            "linear-gradient(135deg, rgba(146, 64, 14, 0.95), rgba(153, 27, 27, 0.8), rgba(120, 53, 15, 0.95))",
            "linear-gradient(135deg, rgba(153, 27, 27, 0.95), rgba(146, 64, 14, 0.8), rgba(120, 53, 15, 0.95))",
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
      />

      {/* Floating Elements */}
      {floatingElements.map((element, i) => {
        const IconComponent = element.icon;
        return (
          <motion.div
            key={`float-${element.id}`}
            className="absolute text-yellow-400/30"
            style={{
              top: element.position.top,
              left: element.position.left,
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, 15, 0],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.7, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              delay: element.delay,
            }}
          >
            <IconComponent size={element.size} />
          </motion.div>
        );
      })}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Premium Badge */}
          <motion.div
            className="inline-block px-8 py-3 bg-gradient-to-r from-red-600/20 to-amber-600/20 backdrop-blur-sm rounded-full border border-red-400/30 mb-8"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="text-red-200 text-lg font-medium tracking-wider">
              ROYAL PAYMENT
            </span>
          </motion.div>

          <motion.h2
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 font-serif leading-tight"
            variants={itemVariants}
          >
            Secure Your
            <br />
            <span className="text-yellow-300">Royal Experience</span>
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-amber-100 font-light leading-relaxed max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Experience the finest Ruby Tea blends with our secure payment gateway
            <br />
            <span className="text-amber-200/80 text-lg md:text-xl">Your trust, our heritage</span>
          </motion.p>
        </motion.div>

        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Amount Selection */}
          <motion.div className="mb-12" variants={itemVariants}>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center font-serif">
              Choose Your Royal Blend
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {amounts.map((amount, index) => {
                const IconComponent = amount.icon;
                return (
                  <motion.button
                    key={amount.value}
                    onClick={() => setSelectedAmount(amount.value)}
                    className={`relative p-6 rounded-2xl border-2 transition-all duration-500 overflow-hidden ${
                      selectedAmount === amount.value
                        ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 text-white shadow-2xl shadow-yellow-400/20'
                        : 'border-white/30 bg-white/5 text-amber-100 hover:border-yellow-400/50 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Background glow for selected */}
                    {selectedAmount === amount.value && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-amber-500/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    <div className="relative z-10 flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${
                        selectedAmount === amount.value
                          ? 'bg-yellow-400/20 text-yellow-300'
                          : 'bg-white/10 text-amber-300'
                      }`}>
                        <IconComponent size={24} />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-lg">{amount.label}</div>
                        <div className={`text-sm ${
                          selectedAmount === amount.value ? 'text-yellow-200' : 'text-amber-300/80'
                        }`}>
                          {amount.description}
                        </div>
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {selectedAmount === amount.value && (
                      <motion.div
                        className="absolute top-4 right-4 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Payment Summary */}
          <motion.div
            className="bg-amber-50 rounded-lg p-6 mb-8"
            variants={itemVariants}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-amber-800 font-medium">Selected Package:</span>
              <span className="text-amber-900 font-bold">
                ₹{selectedAmount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-amber-800 font-medium">Total Amount:</span>
              <span className="text-2xl font-bold text-amber-900">
                ₹{selectedAmount}
              </span>
            </div>
          </motion.div>

          {/* Payment Button */}
          <motion.div className="text-center" variants={itemVariants}>
            <motion.button
              onClick={handlePayment}
              disabled={isLoading}
              className={`inline-flex items-center px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 ${
                isLoading
                  ? 'bg-amber-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 hover:scale-105'
              }`}
              whileHover={!isLoading ? { scale: 1.05 } : {}}
              whileTap={!isLoading ? { scale: 0.95 } : {}}
            >
              {isLoading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Processing...
                </>
              ) : (
                <>
                  <FaCreditCard className="mr-3" />
                  Pay Securely with Razorpay
                </>
              )}
            </motion.button>

            <div className="flex items-center justify-center mt-4 text-sm text-amber-600">
              <FaLock className="mr-2" />
              <span>256-bit SSL Encrypted Payment</span>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-8 pt-8 border-t border-amber-200"
            variants={itemVariants}
          >
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-amber-600">
              <div className="flex items-center">
                <FaLock className="mr-2" />
                Secure Payment
              </div>
              <div className="flex items-center">
                <span className="mr-2">🔒</span>
                PCI DSS Compliant
              </div>
              <div className="flex items-center">
                <span className="mr-2">💳</span>
                All Cards Accepted
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PaymentSection;
