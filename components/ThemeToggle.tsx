'use client';

import { motion } from 'framer-motion';
import { GiTeapotLeaves } from 'react-icons/gi';
import { RiCupLine } from 'react-icons/ri';
import { useTheme } from '../lib/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-3 rounded-full bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border-color)] text-[var(--text-heading)] hover:border-[var(--text-heading)] transition-all duration-500 shadow-xl"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${theme === 'heritage' ? 'Ivory Minimal' : 'Royal Heritage'} personality`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'heritage' ? 0 : 360,
          scale: theme === 'heritage' ? 1 : 1.1
        }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
        className="flex items-center justify-center"
      >
        {theme === 'heritage' ? <RiCupLine size={22} /> : <GiTeapotLeaves size={22} />}
      </motion.div>
    </motion.button>
  );
}
