'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export default function Button({ children, onClick, className = '', variant = 'primary' }: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-ruby-red text-cream-white hover:bg-opacity-90 focus:ring-ruby-red',
    secondary: 'bg-gold text-deep-green hover:bg-opacity-90 focus:ring-gold',
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}
