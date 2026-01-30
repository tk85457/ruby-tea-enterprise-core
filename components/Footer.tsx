import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-color)] text-[var(--text-body)] py-32 mt-0 relative overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-4xl font-bold font-serif mb-8 text-[var(--text-heading)] tracking-widest">RUBY TEA</h3>
            <p className="text-[var(--text-body)]/40 leading-relaxed font-medium text-sm italic">
              "Crafting the legacy of authentic heritage. A rhythmic journey in every sip."
            </p>
          </div>

          <div>
            <h4 className="text-xl font-serif font-bold mb-6 text-[var(--text-heading)]">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-[var(--text-body)]/60 hover:text-[var(--text-heading)] transition-all duration-300">Home</Link></li>
              <li><Link href="/products" className="text-[var(--text-body)]/60 hover:text-[var(--text-heading)] transition-all duration-300">Products</Link></li>
              <li><Link href="/about" className="text-[var(--text-body)]/60 hover:text-[var(--text-heading)] transition-all duration-300">About</Link></li>
              <li><Link href="/contact" className="text-[var(--text-body)]/60 hover:text-[var(--text-heading)] transition-all duration-300">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-serif font-bold mb-6 text-[var(--text-heading)]">Contact</h4>
            <ul className="space-y-3">
              <li className="text-[var(--text-body)]/40 text-sm italic">Panchatiya Akhara,</li>
              <li className="text-[var(--text-body)]/40 text-sm italic">Gaya, Bihar - 823001</li>
              <li className="text-[var(--accent)] mt-6 font-bold text-xl">
                <a href="tel:9111782923" className="hover:text-[var(--text-heading)] transition-colors">9111782923</a>
              </li>
              <li className="text-[var(--text-body)]/60 text-sm mt-1">
                <a href="mailto:TK8545725@GMAIL.COM" className="hover:text-[var(--text-heading)] break-all transition-colors font-semibold">TK8545725@GMAIL.COM</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.3em] mb-8 text-[var(--text-heading)]">Commitment</h4>
            <p className="text-[var(--text-body)]/40 text-sm leading-relaxed">Dedicated to the preservation of traditional Indian tea culture through meticulous small-batch harvesting.</p>
          </div>
        </div>

        <div className="border-t border-[var(--border-color)]/30 mt-16 pt-8 text-center text-[var(--text-body)]/30 text-sm tracking-widest uppercase font-bold">
          <p>&copy; {new Date().getFullYear()} RUBY TEA. Reclaiming Authenticity.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
