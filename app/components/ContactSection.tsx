'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaPhone, FaMapMarkerAlt, FaClock, FaEnvelope, FaLeaf, FaStar, FaCrown } from 'react-icons/fa';

const ContactSection = () => {
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

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Create floating elements
  const [floatingElements] = useState(() =>
    Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      icon: i % 3 === 0 ? FaLeaf : i % 3 === 1 ? FaStar : FaCrown,
      size: Math.random() * 16 + 12,
      position: {
        top: `${10 + Math.random() * 80}%`,
        left: `${5 + Math.random() * 90}%`,
      },
      duration: Math.random() * 8 + 10,
      delay: Math.random() * 3,
    }))
  );

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
      {floatingElements.map((element) => {
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              ROYAL TEA HOUSE
            </span>
          </motion.div>

          <motion.h2
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 font-serif leading-tight"
            variants={itemVariants}
          >
            Visit Our
            <br />
            <span className="text-yellow-300">Heritage Store</span>
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-amber-100 font-light leading-relaxed max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Experience the warmth of our traditional tea house in the heart of Bihar
            <br />
            <span className="text-amber-200/80 text-lg md:text-xl">Where every cup carries centuries of tradition</span>
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8"
              variants={itemVariants}
            >
              <h3 className="text-2xl font-semibold text-amber-900 mb-6">Store Information</h3>

              {/* Address */}
              <div className="flex items-start mb-6">
                <FaMapMarkerAlt className="text-amber-600 mt-1 mr-4 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Address</h4>
                  <p className="text-amber-700 leading-relaxed">
                    Panchatiya Akhara<br />
                    Gaya, Bihar 823001<br />
                    India
                  </p>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="flex items-start mb-6">
                <FaPhone className="text-amber-600 mt-1 mr-4 flex-shrink-0" size={20} />
                <div className="w-full">
                  <h4 className="font-semibold text-amber-900 mb-3">Phone Numbers</h4>
                  <div className="space-y-3">
                    <motion.button
                      onClick={() => handleCall('9631321029')}
                      className="flex items-center justify-between w-full p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors duration-300 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-amber-800 font-medium">+91 9631321029</span>
                      <FaPhone className="text-amber-600 group-hover:text-amber-700" size={16} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleCall('7277173643')}
                      className="flex items-center justify-between w-full p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors duration-300 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-amber-800 font-medium">+91 7277173643</span>
                      <FaPhone className="text-amber-600 group-hover:text-amber-700" size={16} />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start mb-6">
                <FaClock className="text-amber-600 mt-1 mr-4 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Business Hours</h4>
                  <div className="text-amber-700 space-y-1">
                    <p>Monday - Saturday: 8:00 AM - 8:00 PM</p>
                    <p>Sunday: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <FaEnvelope className="text-amber-600 mt-1 mr-4 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Email</h4>
                  <a
                    href="mailto:info@ruby-tea.com"
                    className="text-amber-700 hover:text-amber-800 transition-colors duration-300"
                  >
                    info@ruby-tea.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="bg-amber-900 text-amber-50 rounded-2xl p-8"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <motion.button
                  onClick={() => handleCall('9631321029')}
                  className="flex items-center justify-center px-6 py-3 bg-amber-800 hover:bg-amber-700 rounded-lg transition-colors duration-300 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPhone className="mr-2" size={16} />
                  Call Now
                </motion.button>
                <motion.a
                  href={`https://maps.google.com/maps?q=${encodeURIComponent('Panchatiya Akhara, Gaya Bihar 823001')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-6 py-3 bg-amber-800 hover:bg-amber-700 rounded-lg transition-colors duration-300 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaMapMarkerAlt className="mr-2" size={16} />
                  Get Directions
                </motion.a>
              </div>
            </motion.div>
          </motion.div>

          {/* Google Map Embed */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="p-6 border-b border-amber-200">
              <h3 className="text-2xl font-semibold text-amber-900">Location</h3>
              <p className="text-amber-700 mt-2">Find us in the heart of Gaya</p>
            </div>
            <div className="relative h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3668.123456789012!2d84.987654321!3d24.654321098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDM5JzAzLjUiTiA4NcKwNTknMTUuMyJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ruby Tea Store Location"
                className="rounded-b-2xl"
              />
              {/* Fallback for when embed doesn't load */}
              <div className="absolute inset-0 bg-amber-50 flex items-center justify-center rounded-b-2xl">
                <div className="text-center p-8">
                  <FaMapMarkerAlt className="text-amber-600 mx-auto mb-4" size={48} />
                  <h4 className="text-xl font-semibold text-amber-900 mb-2">Panchatiya Akhara</h4>
                  <p className="text-amber-700 mb-4">Gaya, Bihar 823001</p>
                  <a
                    href={`https://maps.google.com/maps?q=${encodeURIComponent('Panchatiya Akhara, Gaya Bihar 823001')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-300"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
