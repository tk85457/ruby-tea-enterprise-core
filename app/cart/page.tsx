import { Metadata } from 'next';
import CartPage from '../components/CartPage';

export const metadata: Metadata = {
  title: 'Shopping Cart | Ruby Tea',
  description: 'Review your Ruby Tea selections, update quantities, and proceed to checkout for secure payment.',
  keywords: 'shopping cart, Ruby Tea, checkout, tea order',
};

export default function Cart() {
  return <CartPage />;
}
