
import { Product } from '../hooks/useCart';

// Mock product data
export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 149.99,
    image: '/placeholder.svg',
    description: 'Premium wireless headphones with noise cancellation and long battery life.',
    category: 'electronics',
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 299.99,
    image: '/placeholder.svg',
    description: 'Track your fitness, receive notifications, and more with this stylish smart watch.',
    category: 'electronics',
  },
  {
    id: '3',
    name: 'Bluetooth Speaker',
    price: 89.99,
    image: '/placeholder.svg',
    description: 'Portable Bluetooth speaker with amazing sound quality and 10-hour battery life.',
    category: 'electronics',
  },
  {
    id: '4',
    name: 'Laptop Backpack',
    price: 59.99,
    image: '/placeholder.svg',
    description: 'Durable and spacious backpack with dedicated laptop compartment and USB charging port.',
    category: 'accessories',
  },
  {
    id: '5',
    name: 'Coffee Mug',
    price: 14.99,
    image: '/placeholder.svg',
    description: 'Ceramic coffee mug with beautiful design, perfect for your morning coffee.',
    category: 'home',
  },
  {
    id: '6',
    name: 'Wireless Charger',
    price: 29.99,
    image: '/placeholder.svg',
    description: 'Fast wireless charger compatible with all Qi-enabled devices.',
    category: 'electronics',
  },
  {
    id: '7',
    name: 'Plant Pot',
    price: 19.99,
    image: '/placeholder.svg',
    description: 'Minimalist ceramic plant pot, perfect for small indoor plants.',
    category: 'home',
  },
  {
    id: '8',
    name: 'Notebook Set',
    price: 12.99,
    image: '/placeholder.svg',
    description: 'Set of 3 premium notebooks with high-quality paper.',
    category: 'stationery',
  },
];

export const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'home', name: 'Home' },
  { id: 'stationery', name: 'Stationery' },
];

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
}
