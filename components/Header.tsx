'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { useCart } from '../lib/CartContext';
import { motion } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();

  return (
    <header className="bg-[var(--bg-primary)]/80 shadow-md sticky top-0 z-50 transition-colors duration-500 border-b border-[var(--border-color)] backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-3xl font-bold text-[var(--text-heading)] font-serif tracking-widest">
            RUBY TEA
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-12">
          {['Home', 'Products', 'About', 'Contact'].map((item) => (
            <Link
              key={item}
              href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className="text-[var(--text-body)]/80 hover:text-[var(--text-heading)] font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 relative group"
            >
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[var(--text-heading)] transition-all duration-500 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/cart" className="p-2 relative group">
            <FaShoppingCart className="text-xl text-[var(--text-body)] group-hover:text-[var(--text-heading)] transition-colors" />
            {cart.itemCount > 0 && (
              <motion.span
                key={cart.itemCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-[var(--accent)] text-[var(--btn-text)] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-[var(--bg-primary)]"
              >
                {cart.itemCount}
              </motion.span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[var(--text-body)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-[var(--bg-primary)] py-4 px-4 border-t border-[var(--border-color)] shadow-2xl">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="text-[var(--text-body)]/80 hover:text-[var(--text-heading)] font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/products" className="text-[var(--text-body)]/80 hover:text-[var(--text-heading)] font-medium" onClick={() => setIsMenuOpen(false)}>Products</Link>
            <Link href="/about" className="text-[var(--text-body)]/80 hover:text-[var(--text-heading)] font-medium" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link href="/contact" className="text-[var(--text-body)]/80 hover:text-[var(--text-heading)] font-medium" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;