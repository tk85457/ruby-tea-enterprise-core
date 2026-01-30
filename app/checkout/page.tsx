import { Metadata } from 'next';
import CheckoutPage from '../components/CheckoutPage';

export const metadata: Metadata = {
  title: 'Checkout | Ruby Tea',
  description: 'Complete your Ruby Tea order with secure payment processing. Fast and secure checkout for premium tea delivery.',
  keywords: 'checkout, Ruby Tea, payment, secure checkout, tea delivery',
};

export default function Checkout() {
  return <CheckoutPage />;
}
