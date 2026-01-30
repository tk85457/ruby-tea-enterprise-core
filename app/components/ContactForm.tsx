'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaPaperPlane, FaCheck } from 'react-icons/fa';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return value.trim() ? '' : 'Identity is required';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'A valid address is required';
      case 'message':
        return value.trim().length >= 10 ? '' : 'Depth is required in your message';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="w-full">
      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 border border-[var(--accent-hover)] rounded-full flex items-center justify-center mx-auto mb-8">
            <FaCheck className="text-[var(--accent-hover)]" size={24} />
          </div>
          <h4 className="text-2xl font-serif italic text-[var(--text-heading)] mb-4">Received</h4>
          <p className="text-[var(--text-body)]/40 text-sm uppercase tracking-widest">We shall respond in due time.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-hover)]/60 mb-4 block">Identity</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-transparent border-b border-[var(--border-color)] py-4 text-[var(--text-body)] placeholder-[var(--text-body)]/20 focus:outline-none focus:border-[var(--accent-hover)] transition-all font-serif italic text-lg"
              />
              {errors.name && <p className="mt-2 text-[10px] text-[var(--accent-hover)] uppercase tracking-widest">{errors.name}</p>}
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-hover)]/60 mb-4 block">Archive Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full bg-transparent border-b border-[var(--border-color)] py-4 text-[var(--text-body)] placeholder-[var(--text-body)]/20 focus:outline-none focus:border-[var(--accent-hover)] transition-all font-serif italic text-lg"
              />
              {errors.email && <p className="mt-2 text-[10px] text-[var(--accent-hover)] uppercase tracking-widest">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-hover)]/60 mb-4 block">The Narrative</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              placeholder="Your inquiry..."
              className="w-full bg-transparent border-b border-[var(--border-color)] py-4 text-[var(--text-body)] placeholder-[var(--text-body)]/20 focus:outline-none focus:border-[var(--accent-hover)] transition-all font-serif italic text-lg resize-none"
            />
            {errors.message && <p className="mt-2 text-[10px] text-[var(--accent-hover)] uppercase tracking-widest">{errors.message}</p>}
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full md:w-auto"
            >
              {isSubmitting ? 'Transmitting...' : 'Initiate Dialogue'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
