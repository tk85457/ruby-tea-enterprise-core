import './globals.css';
import { ReactNode } from 'react';
import { CartProvider } from '../lib/CartContext';
import { ThemeProvider } from '../lib/ThemeContext';

import JSONLD from '../components/JSONLD';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'RUBY TEA - Premium Indian Tea Brand',
  description: 'Experience the rich taste of authentic Indian tea with RUBY TEA. Premium quality tea leaves sourced directly from the gardens of India.',
  alternates: {
    canonical: 'https://rubytea.in',
  },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'RUBY TEA',
  url: 'https://rubytea.in',
  logo: 'https://rubytea.in/logo.png',
  sameAs: [
    'https://instagram.com/rubytea_official',
    'https://twitter.com/rubytea_in'
  ],
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JSONLD data={orgSchema} />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <CartProvider>
            {children}
            <Toaster position="bottom-right" toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '12px',
              },
            }} />
            <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
