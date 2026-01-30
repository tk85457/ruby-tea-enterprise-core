'use client';

import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import ContactForm from '../components/ContactForm';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-body)] transition-colors duration-500 selection:bg-[var(--accent)] selection:text-[var(--bg-primary)]">
      <Header />

      {/* Hero */}
      <section className="relative py-40 border-b border-[var(--border-color)]">
        <div className="container mx-auto px-4 text-center">
           <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[var(--accent-hover)] uppercase tracking-[0.5em] font-bold text-xs mb-8 block"
          >
            The Dialogue
          </motion.span>
          <motion.h1
            className="text-6xl md:text-9xl font-bold font-serif mb-12 text-[var(--text-heading)]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Connect
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl max-w-2xl mx-auto text-[var(--text-body)]/40 font-serif italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            "Inquire about our ancestral collections or discuss a custom partnership."
          </motion.p>
        </div>
      </section>

      {/* Info Grid */}
      <section className="py-32 bg-[var(--bg-primary)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mb-40">
            {[
              { icon: FaPhone, title: 'Inquiry', content: '9111782923', sub: 'Royal Hours: 9 AM - 9 PM' },
              { icon: FaEnvelope, title: 'Archive', content: 'TK8545725@GMAIL.COM', sub: 'Professional Inquiries' },
              { icon: FaMapMarkerAlt, title: 'Domain', content: 'Panchatiya Akhara, Gaya', sub: 'Bihar - 823001' }
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center group"
              >
                <item.icon className="text-3xl text-[var(--accent-hover)] mx-auto mb-10 opacity-60 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-hover)] mb-4">{item.title}</h3>
                <p className="text-2xl font-serif text-[var(--text-heading)] mb-2">{item.content}</p>
                <p className="text-[var(--text-body)]/20 text-[10px] uppercase tracking-widest font-bold">{item.sub}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="bg-[var(--bg-card)] p-16 rounded-[4rem] border border-[var(--border-color)]"
            >
              <h2 className="text-4xl font-bold font-serif text-[var(--text-heading)] mb-12">The Invitation</h2>
              <ContactForm />
            </motion.div>

            {/* Narrative */}
            <div className="space-y-20">
               <div>
                  <h2 className="text-5xl font-bold font-serif text-[var(--text-heading)] mb-12">The Seat</h2>
                  <div className="aspect-video bg-[var(--bg-card)] rounded-[3rem] border border-[var(--border-color)] flex items-center justify-center relative overflow-hidden group">
                     <FaMapMarkerAlt className="text-6xl text-[var(--accent-hover)] opacity-20 group-hover:scale-110 transition-transform duration-1000" />
                     <div className="absolute bottom-10 text-center w-full">
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-hover)]">Panchatiya Akhara, Gaya</p>
                     </div>
                  </div>
               </div>

               <div>
                 <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-hover)] mb-12">Dialogue Channels</h3>
                 <div className="flex gap-12">
                   {[FaInstagram, FaFacebook, FaWhatsapp].map((Icon, i) => (
                     <a key={i} href="#" className="w-16 h-16 rounded-full border border-[var(--border-color)] flex items-center justify-center text-[var(--text-body)]/30 hover:text-[var(--accent-hover)] hover:border-[var(--accent-hover)] transition-all">
                       <Icon size={24} />
                     </a>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
