import { Product } from '../lib/types';

export const products: Product[] = [
  {
    id: '1',
    _id: '1',
    name: 'Classic Ruby Tea',
    slug: 'classic-ruby-tea',
    description: 'Our signature blend of premium Assam tea leaves, carefully selected from the finest gardens of Bihar. This classic Ruby Tea offers a rich, malty flavor with hints of caramel and a bright coppery liquor that defines the authentic Indian tea experience.',
    shortDescription: 'Signature Assam blend with rich, malty flavor and authentic Indian character.',
    price: 450,
    originalPrice: 500,
    image: '/products/classic-ruby-tea.webp',
    images: [
      '/products/classic-ruby-tea.webp',
      '/products/classic-ruby-tea-2.webp',
      '/products/classic-ruby-tea-3.webp'
    ],
    category: 'Black Tea',
    tags: ['assam', 'classic', 'premium', 'traditional'],
    stock: 100,
    inStock: true,
    weight: '250g',
    brewingInstructions: 'Use 1 tsp per cup, steep in 95°C water for 3-5 minutes.',
    ingredients: ['Premium Assam Tea Leaves', 'Natural Flavors'],
    benefits: ['Rich in antioxidants', 'Boosts metabolism', 'Traditional taste'],
    rating: 4.8,
    reviewCount: 156,
    featured: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    _id: '2',
    name: 'Elaichi Ruby Tea',
    slug: 'elaichi-ruby-tea',
    description: 'A harmonious blend of our premium Assam tea enhanced with aromatic cardamom pods. The warm, spicy notes of elaichi complement the robust tea base, creating a soothing and invigorating experience perfect for any time of day.',
    shortDescription: 'Assam tea infused with aromatic cardamom for a warm, spicy experience.',
    price: 480,
    image: '/products/elaichi-ruby-tea.webp',
    images: [
      '/products/elaichi-ruby-tea.webp',
      '/products/elaichi-ruby-tea-2.webp'
    ],
    category: 'Flavored Tea',
    tags: ['cardamom', 'spiced', 'aromatic', 'soothing'],
    stock: 85,
    inStock: true,
    weight: '250g',
    brewingInstructions: 'Use 1 tsp per cup, steep in 95°C water for 4-5 minutes.',
    ingredients: ['Premium Assam Tea Leaves', 'Green Cardamom Pods', 'Natural Flavors'],
    benefits: ['Aromatic and soothing', 'Aids digestion', 'Natural sweetness'],
    rating: 4.7,
    reviewCount: 89,
    featured: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    _id: '3',
    name: 'Masala Ruby Tea',
    slug: 'masala-ruby-tea',
    description: 'Our most popular blend featuring Assam tea with a traditional Indian spice mix of cardamom, cinnamon, ginger, and cloves. This robust masala chai delivers complex flavors and aromas that warm both body and soul.',
    shortDescription: 'Traditional Indian masala chai with Assam tea and aromatic spices.',
    price: 520,
    originalPrice: 600,
    image: '/products/masala-ruby-tea.webp',
    images: [
      '/products/masala-ruby-tea.webp',
      '/products/masala-ruby-tea-2.webp',
      '/products/masala-ruby-tea-3.webp'
    ],
    category: 'Masala Tea',
    tags: ['masala', 'spiced', 'traditional', 'warming'],
    stock: 120,
    inStock: true,
    weight: '250g',
    brewingInstructions: 'Use 1 tsp per cup, steep in 95°C water for 4-6 minutes. Add milk for authentic experience.',
    ingredients: ['Premium Assam Tea Leaves', 'Cardamom', 'Cinnamon', 'Ginger', 'Cloves', 'Natural Flavors'],
    benefits: ['Warming and comforting', 'Boosts immunity', 'Rich in spices'],
    rating: 4.9,
    reviewCount: 234,
    featured: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    _id: '4',
    name: 'Green Ruby Tea',
    slug: 'green-ruby-tea',
    description: 'Premium green tea from the misty hills of Darjeeling, hand-picked and minimally processed to preserve its delicate flavor and health benefits. Light, refreshing, and packed with antioxidants.',
    shortDescription: 'Premium Darjeeling green tea, light and refreshing with maximum health benefits.',
    price: 550,
    image: '/products/green-ruby-tea.webp',
    images: [
      '/products/green-ruby-tea.webp',
      '/products/green-ruby-tea-2.webp'
    ],
    category: 'Green Tea',
    tags: ['green', 'darjeeling', 'health', 'antioxidants'],
    stock: 50,
    inStock: true,
    weight: '200g',
    brewingInstructions: 'Use 1 tsp per cup, steep in 80°C water for 2-3 minutes.',
    ingredients: ['Premium Darjeeling Green Tea Leaves'],
    benefits: ['High in antioxidants', 'Supports metabolism', 'Light and refreshing'],
    rating: 4.6,
    reviewCount: 67,
    featured: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    _id: '5',
    name: 'Herbal Ruby Infusion',
    slug: 'herbal-ruby-infusion',
    description: 'A caffeine-free blend of premium herbs and flowers including chamomile, peppermint, and hibiscus. Perfect for evening relaxation or as a healthy alternative to traditional tea.',
    shortDescription: 'Caffeine-free herbal infusion with chamomile, peppermint, and hibiscus.',
    price: 420,
    image: '/products/herbal-ruby-infusion.webp',
    images: [
      '/products/herbal-ruby-infusion.webp'
    ],
    category: 'Herbal Tea',
    tags: ['herbal', 'caffeine-free', 'relaxing', 'health'],
    stock: 45,
    inStock: true,
    weight: '200g',
    brewingInstructions: 'Use 1 tsp per cup, steep in 95°C water for 5-7 minutes.',
    ingredients: ['Chamomile Flowers', 'Peppermint Leaves', 'Hibiscus Flowers', 'Natural Flavors'],
    benefits: ['Caffeine-free', 'Promotes relaxation', 'Digestive health'],
    rating: 4.5,
    reviewCount: 43,
    featured: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    _id: '6',
    name: 'Premium Ruby Gift Set',
    slug: 'premium-ruby-gift-set',
    description: 'Our most luxurious offering - a curated selection of our finest teas in an elegant gift box. Includes Classic Ruby Tea, Elaichi Ruby Tea, and Masala Ruby Tea, perfect for tea enthusiasts or as a thoughtful gift.',
    shortDescription: 'Luxurious gift set with our three signature blends in an elegant presentation box.',
    price: 1350,
    originalPrice: 1500,
    image: '/products/premium-ruby-gift-set.webp',
    images: [
      '/products/premium-ruby-gift-set.webp',
      '/products/premium-ruby-gift-set-2.webp'
    ],
    category: 'Gift Sets',
    tags: ['gift', 'premium', 'collection', 'luxury'],
    stock: 30,
    inStock: true,
    weight: '750g (3 x 250g)',
    brewingInstructions: 'See individual product instructions.',
    ingredients: ['Premium Assam Tea Leaves', 'Aromatic Spices', 'Natural Flavors'],
    benefits: ['Complete tea experience', 'Perfect gift', 'Variety pack'],
    rating: 4.9,
    reviewCount: 78,
    featured: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug || product.id === slug);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
