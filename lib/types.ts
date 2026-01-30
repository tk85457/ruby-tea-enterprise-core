export interface Product {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  inStock: boolean;
  weight: string;
  brewingInstructions: string;
  ingredients: string[];
  benefits: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

export interface Order {
  id: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartContextType {
  cart: CartState;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getCartItem: (productId: string) => CartItem | undefined;
}
