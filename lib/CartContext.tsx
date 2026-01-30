'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem, CartState, Product, CartContextType } from './types';

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const CartContext = createContext<CartContextType | undefined>(undefined);

const getProductId = (product: Product): string => {
  return product._id || product.id;
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload;
      const prodId = getProductId(product);
      const existingItem = state.items.find(item => getProductId(item.product) === prodId);

      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          getProductId(item.product) === prodId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, {
          product,
          quantity,
          addedAt: new Date().toISOString()
        }];
      }

      const total = calculateTotal(newItems);
      const itemCount = calculateItemCount(newItems);

      return { items: newItems, total, itemCount };
    }

    case 'REMOVE_ITEM': {
      const productId = action.payload;
      const newItems = state.items.filter(item => getProductId(item.product) !== productId);
      const total = calculateTotal(newItems);
      const itemCount = calculateItemCount(newItems);

      return { items: newItems, total, itemCount };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: productId });
      }

      const newItems = state.items.map(item =>
        getProductId(item.product) === productId
          ? { ...item, quantity }
          : item
      );
      const total = calculateTotal(newItems);
      const itemCount = calculateItemCount(newItems);

      return { items: newItems, total, itemCount };
    }

    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ruby-tea-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ruby-tea-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const isInCart = (productId: string): boolean => {
    return cart.items.some(item => getProductId(item.product) === productId);
  };

  const getCartItem = (productId: string): CartItem | undefined => {
    return cart.items.find(item => getProductId(item.product) === productId);
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItem
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
