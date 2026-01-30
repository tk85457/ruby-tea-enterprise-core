'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaTimes } from 'react-icons/fa';

const ProductFilters: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState<string>('featured');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Black Tea', label: 'Black Tea' },
    { value: 'Flavored Tea', label: 'Flavored Tea' },
    { value: 'Masala Tea', label: 'Masala Tea' },
    { value: 'Green Tea', label: 'Green Tea' },
    { value: 'Herbal Tea', label: 'Herbal Tea' },
    { value: 'Gift Sets', label: 'Gift Sets' },
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
  ];

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors duration-200"
        >
          <FaFilter size={16} />
          <span>Filters</span>
          {isOpen && <FaTimes size={16} />}
        </button>
      </div>

      {/* Filters Panel */}
      <motion.div
        className={`bg-white rounded-2xl shadow-lg border border-amber-100 p-6 ${
          isOpen ? 'block' : 'hidden lg:block'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-bold text-amber-900 mb-6">Filters</h3>

        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-50"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
          </label>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider mt-2"
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-50"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => {
            setSelectedCategory('all');
            setPriceRange([0, 2000]);
            setSortBy('featured');
          }}
          className="w-full px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-semibold"
        >
          Clear All Filters
        </button>
      </motion.div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #d97706;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #d97706;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
};

export default ProductFilters;
