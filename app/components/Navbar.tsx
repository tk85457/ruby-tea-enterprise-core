'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCrown, FaStar, FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../lib/CartContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
      isScrolled
        ? 'bg-[var(--bg-site)]/90 backdrop-blur-xl shadow-lg border-b border-[var(--border-site)]'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={`relative p-3 rounded-full ${
              isScrolled
                ? 'bg-[var(--surface-site)] shadow-lg border border-[var(--border-site)]'
                : 'bg-white/10 backdrop-blur-sm shadow-2xl border border-white/20'
            }`}>
              <FaCrown className={`${
                isScrolled ? 'text-[var(--accent-site)]' : 'text-yellow-300'
              }`} size={24} />
              {/* Royal accent */}
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div className="flex flex-col">
              <span className={`text-2xl font-bold font-serif leading-tight ${
                isScrolled ? 'text-[var(--text-site)]' : 'text-white'
              }`}>
                Ruby Tea
              </span>
              <span className={`text-xs font-medium tracking-wider uppercase ${
                isScrolled ? 'text-[var(--accent-site)]' : 'text-amber-200'
              }`}>
                Royal Heritage
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className={`relative font-semibold transition-all duration-300 ${
                  isScrolled
                    ? 'text-[var(--text-site)] hover:text-[var(--accent-site)]'
                    : 'text-white hover:text-yellow-300'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.name}
                {/* Hover underline effect */}
                <motion.div
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r ${
                    isScrolled ? 'from-[var(--accent-site)] to-[var(--accent-site)]/60' : 'from-yellow-400 to-yellow-300'
                  }`}
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
            <motion.button
              className={`relative px-8 py-3 rounded-full font-bold transition-all duration-500 overflow-hidden ${
                isScrolled
                  ? 'bg-[var(--accent-site)] text-[var(--bg-site)] hover:brightness-110 shadow-lg'
                  : 'bg-gradient-to-r from-yellow-400/20 to-red-500/20 backdrop-blur-sm text-white border-2 border-yellow-400/50 hover:border-yellow-400 hover:bg-yellow-400/10 shadow-2xl'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <FaStar size={16} />
                <span>Order Royal Tea</span>
              </span>
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-3 rounded-lg ${
                isScrolled
                  ? 'text-[var(--text-site)] hover:bg-[var(--surface-site)]'
                  : 'text-white hover:bg-white/10'
              } transition-all duration-300`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className={`md:hidden overflow-hidden ${
            isScrolled
              ? 'bg-[var(--bg-site)]/95 backdrop-blur-lg border-t border-[var(--border-site)]'
              : 'bg-black/90 backdrop-blur-lg'
          }`}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="px-4 pt-4 pb-6 space-y-4">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className={`block px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isScrolled
                    ? 'text-[var(--text-site)] hover:text-[var(--accent-site)] hover:bg-[var(--surface-site)]'
                    : 'text-white hover:text-yellow-300 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02, x: 8 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </motion.a>
            ))}

            {/* Mobile Cart Link */}
            <Link href="/cart" onClick={() => setIsOpen(false)}>
              <motion.div
                className={`flex items-center px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isScrolled
                    ? 'text-[var(--text-site)] hover:text-[var(--accent-site)] hover:bg-[var(--surface-site)]'
                    : 'text-white hover:text-yellow-300 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02, x: 8 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FaShoppingCart size={20} className="mr-3" />
                <span>Cart</span>
                {cart.itemCount > 0 && (
                  <motion.span
                    className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={cart.itemCount}
                  >
                    {cart.itemCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            <motion.button
              className={`w-full mt-6 px-6 py-4 rounded-full font-bold transition-all duration-500 overflow-hidden ${
                isScrolled
                  ? 'bg-[var(--accent-site)] text-[var(--bg-site)] hover:brightness-110'
                  : 'bg-gradient-to-r from-yellow-400/20 to-red-500/20 backdrop-blur-sm text-white border-2 border-yellow-400/50 hover:border-yellow-400 hover:bg-yellow-400/10'
              } shadow-lg`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center justify-center space-x-2">
                <FaStar size={16} />
                <span>Order Royal Tea</span>
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </nav>
  );
}
