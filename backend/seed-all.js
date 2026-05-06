require('dotenv').config();
const mongoose = require('mongoose');

const Category = require('./models/Category');
const Product = require('./models/Product');
const Banner = require('./models/Banner');
const Story = require('./models/Story');
const Coupon = require('./models/Coupon');
const User = require('./models/User');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/elevation';

// ==================== CATEGORIES ====================
const categories = [
  {
    name: 'Women',
    slug: 'women',
    description: 'Elegance Redefined',
    banner: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1600&q=80',
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80',
    isActive: true,
    featured: true,
    order: 1,
    productCount: 3
  },
  {
    name: 'Men',
    slug: 'men',
    description: 'Modern Sophistication',
    banner: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    isActive: true,
    featured: true,
    order: 2,
    productCount: 2
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Statement Pieces',
    banner: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1600&q=80',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80',
    isActive: true,
    featured: true,
    order: 3,
    productCount: 2
  },
  {
    name: 'Kids',
    slug: 'kids',
    description: 'Playful Luxury',
    banner: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=1600&q=80',
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80',
    isActive: true,
    featured: false,
    order: 4,
    productCount: 2
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    description: 'Step Into Style',
    banner: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1600&q=80',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
    isActive: true,
    featured: true,
    order: 5,
    productCount: 2
  }
];

// ==================== PRODUCTS ====================
const products = [
  // Women Products
  {
    name: 'Silk Draped Evening Gown',
    brand: 'Valentino',
    category: 'women',
    price: 42999,
    originalPrice: 64999,
    stock: 15,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80'
    ],
    description: 'An exquisite silk evening gown featuring hand-embellished crystal bodice, flowing draped skirt, and invisible back zipper. Perfect for black-tie events and galas.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Midnight Black', hex: '#0a0a0a' },
      { name: 'Champagne Gold', hex: '#c9a96e' },
      { name: 'Ivory', hex: '#fefcf8' }
    ],
    details: ['100% Mulberry Silk', 'Hand-embellished crystals', 'Made in Italy', 'Dry clean only', 'Model wears size S']
  },
  {
    name: 'Floral Print Midi Dress',
    brand: 'Gucci',
    category: 'women',
    price: 34500,
    originalPrice: 49500,
    stock: 20,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'],
    description: 'Beautiful floral print midi dress perfect for summer occasions.',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Floral Multi', hex: '#FF6B6B' },
      { name: 'Pink', hex: '#FFB6C1' }
    ],
    details: ['100% Cotton', 'Machine wash cold', 'Imported']
  },
  {
    name: 'Embroidered Tulle Cocktail Dress',
    brand: 'Dior',
    category: 'women',
    price: 156000,
    originalPrice: 210000,
    stock: 8,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&q=80'],
    description: 'Stunning embroidered tulle cocktail dress with intricate detailing.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Navy', hex: '#000080' },
      { name: 'Burgundy', hex: '#800020' }
    ],
    details: ['100% Nylon Tulle', 'Hand embroidery', 'Made in France', 'Dry clean only']
  },

  // Men Products
  {
    name: 'Tailored Wool Overcoat',
    brand: 'Zara Studio',
    category: 'men',
    price: 12499,
    originalPrice: 18999,
    stock: 25,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80'
    ],
    description: 'A timeless tailored overcoat in premium wool blend. Features notched lapels, double-breasted front, and a relaxed silhouette.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Camel', hex: '#c19a6b' },
      { name: 'Charcoal', hex: '#36454f' }
    ],
    details: ['80% Wool, 20% Cashmere', 'Fully lined', 'Two front pockets', 'Dry clean recommended']
  },
  {
    name: 'Oversized Structured Blazer',
    brand: 'Balenciaga',
    category: 'men',
    price: 98000,
    originalPrice: 135000,
    stock: 10,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'],
    description: 'Oversized structured blazer with modern silhouette.',
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#000080' }
    ],
    details: ['100% Virgin Wool', 'Structured shoulders', 'Made in Italy', 'Dry clean only']
  },

  // Accessories Products
  {
    name: 'Leather Crossbody Bag',
    brand: 'Hermès',
    category: 'accessories',
    price: 89999,
    originalPrice: 120000,
    stock: 8,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80'
    ],
    description: 'Luxurious leather crossbody bag with signature gold hardware. Adjustable strap, multiple compartments.',
    sizes: ['One Size'],
    colors: [
      { name: 'Noir', hex: '#0a0a0a' },
      { name: 'Rouge', hex: '#8b0000' }
    ],
    details: ['100% Calfskin leather', 'Gold-plated hardware', 'Made in France', 'Includes dust bag']
  },
  {
    name: 'Classic Check Cashmere Scarf',
    brand: 'Burberry',
    category: 'accessories',
    price: 8999,
    originalPrice: 12999,
    stock: 30,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80'],
    description: 'Classic Burberry check pattern cashmere scarf. Ultra soft and warm.',
    sizes: ['One Size'],
    colors: [
      { name: 'Classic Beige', hex: '#C8A882' },
      { name: 'Navy', hex: '#000080' }
    ],
    details: ['100% Cashmere', 'Made in Scotland', 'Dry clean only']
  },

  // Kids Products
  {
    name: 'Girls Party Dress',
    brand: 'Little Marc',
    category: 'kids',
    price: 4999,
    originalPrice: 7999,
    stock: 40,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&q=80'],
    description: 'Adorable party dress for girls with elegant design.',
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    colors: [
      { name: 'Pink', hex: '#FFB6C1' },
      { name: 'Lavender', hex: '#E6E6FA' }
    ],
    details: ['100% Cotton', 'Machine wash', 'Imported']
  },
  {
    name: 'Boys Casual Shirt',
    brand: 'Gini & Jony',
    category: 'kids',
    price: 1299,
    originalPrice: 1999,
    stock: 50,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80'],
    description: 'Comfortable casual shirt for boys. Perfect for everyday wear.',
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Light Blue', hex: '#ADD8E6' }
    ],
    details: ['100% Cotton', 'Machine wash', 'Made in India']
  },

  // Footwear Products
  {
    name: 'Crystal Embellished Heels',
    brand: 'Jimmy Choo',
    category: 'footwear',
    price: 75000,
    originalPrice: 99000,
    stock: 12,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80'],
    description: 'Stunning crystal embellished heels for special occasions.',
    sizes: ['35', '36', '37', '38', '39', '40'],
    colors: [
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Gold', hex: '#FFD700' }
    ],
    details: ['Satin upper', 'Crystal embellishments', '4-inch heel', 'Made in Italy']
  },
  {
    name: 'Air Max Premium Sneakers',
    brand: 'Nike',
    category: 'footwear',
    price: 12999,
    originalPrice: 16999,
    stock: 20,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
    description: 'Premium Air Max sneakers with superior cushioning and style.',
    sizes: ['7', '8', '9', '10', '11'],
    colors: [
      { name: 'White/Black', hex: '#F5F5F5' },
      { name: 'Black', hex: '#000000' }
    ],
    details: ['Synthetic upper', 'Air Max cushioning', 'Rubber sole', 'Imported']
  },

  // Additional Products
  {
    name: 'Re-Nylon Cropped Jacket',
    brand: 'Prada',
    category: 'women',
    price: 67000,
    originalPrice: 89000,
    stock: 15,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80'],
    description: 'Modern Re-Nylon cropped jacket with contemporary design.',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#000080' }
    ],
    details: ['100% Re-Nylon', 'Cropped fit', 'Made in Italy', 'Machine wash cold']
  }
];

// ==================== BANNERS ====================
const banners = [
  {
    title: 'AW26 Collection',
    subtitle: 'Redefining elegance for the modern era',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80',
    ctaText: 'Explore Now',
    ctaLink: '/category/women',
    position: 'hero',
    active: true,
    order: 1
  },
  {
    title: 'Spring Forward',
    subtitle: 'Fresh styles for the new season',
    image: 'https://images.unsplash.com/photo-1469334031218-382a71b6bd3?w=1200&q=80',
    ctaText: 'Shop Collection',
    ctaLink: '/category/women',
    position: 'promo1',
    active: true,
    order: 2
  },
  {
    title: 'Designer Edit',
    subtitle: 'Exclusive pieces from top designers',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    ctaText: 'View Designers',
    ctaLink: '/designers',
    position: 'promo2',
    active: true,
    order: 3
  }
];

// ==================== STORIES ====================
const stories = [
  {
    title: 'The Art of Slow Fashion',
    excerpt: 'Embracing quality over quantity in a fast-paced world',
    content: 'Full article content here... In the world of fast fashion, slow fashion stands as a beacon of sustainability and quality. This comprehensive guide explores...',
    author: 'Editorial Team',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    category: 'Trends',
    status: 'published',
    publishedAt: new Date('2026-03-28')
  },
  {
    title: 'Behind the Seams: Valentino',
    excerpt: 'A journey through the maison\'s iconic craftsmanship',
    content: 'Full article content here... Valentino\'s commitment to craftsmanship has defined luxury fashion for decades. From the iconic red dresses...',
    author: 'Sarah Chen',
    image: 'https://images.unsplash.com/photo-1445205178533-22422df26b6?w=800&q=80',
    category: 'Designers',
    status: 'published',
    publishedAt: new Date('2026-03-25')
  },
  {
    title: 'Sustainable Luxury: The Future',
    excerpt: 'How luxury brands are embracing eco-conscious practices',
    content: 'Full article content here... As the fashion industry faces increasing scrutiny over its environmental impact...',
    author: 'Marcus Webb',
    image: 'https://images.unsplash.com/photo-1523381217958-4f4c00c1660?w=800&q=80',
    category: 'Sustainability',
    status: 'draft',
    publishedAt: new Date('2026-03-20')
  },
  {
    title: 'Color Trends for Spring 2026',
    excerpt: 'A palette of pastels and bold statement hues',
    content: 'Full article content here... This season brings a vibrant mix of soft pastels and bold statement colors...',
    author: 'Editorial Team',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    category: 'Trends',
    status: 'published',
    publishedAt: new Date('2026-03-15')
  }
];

// ==================== COUPONS ====================
const coupons = [
  {
    code: 'WELCOME20',
    type: 'percentage',
    value: 20,
    minOrder: 5000,
    maxUses: 1000,
    usedCount: 456,
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-12-31'),
    active: true
  },
  {
    code: 'FLAT500',
    type: 'fixed',
    value: 500,
    minOrder: 3000,
    maxUses: 500,
    usedCount: 234,
    startDate: new Date('2026-02-01'),
    endDate: new Date('2026-04-30'),
    active: true
  },
  {
    code: 'LUXURY30',
    type: 'percentage',
    value: 30,
    minOrder: 15000,
    maxUses: 100,
    usedCount: 45,
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-05-31'),
    active: true
  },
  {
    code: 'OLD10',
    type: 'percentage',
    value: 10,
    minOrder: 0,
    maxUses: 0,
    usedCount: 0,
    startDate: new Date('2026-04-01'),
    endDate: new Date('2026-04-15'),
    active: false
  }
];

// ==================== USERS ====================
const users = [
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=60',
    password: 'password123',
    role: 'user',
    status: 'active',
    orders: 12,
    spent: 245600,
    joined: new Date('2025-06-15'),
    addresses: [
      {
        name: 'Home',
        street: '123 MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '+91 98765 43210',
        isDefault: true
      }
    ]
  },
  {
    name: 'Arjun Mehta',
    email: 'arjun.mehta@email.com',
    phone: '+91 87654 32109',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=60',
    password: 'password123',
    role: 'user',
    status: 'active',
    orders: 8,
    spent: 89200,
    joined: new Date('2025-08-22'),
    addresses: [
      {
        name: 'Office',
        street: '456 Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        phone: '+91 87654 32109',
        isDefault: true
      }
    ]
  },
  {
    name: 'Ananya Singh',
    email: 'ananya.singh@email.com',
    phone: '+91 76543 21098',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=60',
    password: 'password123',
    role: 'user',
    status: 'active',
    orders: 15,
    spent: 456000,
    joined: new Date('2025-04-10')
  },
  {
    name: 'Rohan Kapoor',
    email: 'rohan.kapoor@email.com',
    phone: '+91 65432 10987',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=60',
    password: 'password123',
    role: 'user',
    status: 'active',
    orders: 3,
    spent: 34500,
    joined: new Date('2025-11-05')
  },
  {
    name: 'Meera Joshi',
    email: 'meera.joshi@email.com',
    phone: '+91 54321 09876',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=60',
    password: 'password123',
    role: 'user',
    status: 'active',
    orders: 22,
    spent: 890000,
    joined: new Date('2025-02-28')
  },
  {
    name: 'Vikram Reddy',
    email: 'vikram.reddy@email.com',
    phone: '+91 43210 98765',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=60',
    password: 'password123',
    role: 'user',
    status: 'inactive',
    orders: 1,
    spent: 12999,
    joined: new Date('2026-01-10')
  }
];

// ==================== ORDERS ====================
const orders = [
  {
    orderId: 'ORD-7821',
    customer: 'Priya Sharma',
    email: 'priya@example.com',
    product: 'Silk Evening Gown',
    items: [
      {
        name: 'Silk Draped Evening Gown',
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80',
        price: 42999,
        quantity: 1,
        size: 'M',
        color: 'Midnight Black'
      }
    ],
    subtotal: 42999,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 42999,
    amount: '₹42,999',
    status: 'Delivered',
    date: '2026-03-25',
    paymentMethod: 'Razorpay',
    paymentStatus: 'paid',
    payment: 'Paid'
  },
  {
    orderId: 'ORD-7820',
    customer: 'Arjun Mehta',
    email: 'arjun@example.com',
    product: 'Wool Overcoat',
    items: [
      {
        name: 'Tailored Wool Overcoat',
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80',
        price: 12499,
        quantity: 1,
        size: 'L',
        color: 'Camel'
      }
    ],
    subtotal: 12499,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 12499,
    amount: '₹12,499',
    status: 'Shipped',
    date: '2026-03-24',
    paymentMethod: 'Razorpay',
    paymentStatus: 'paid',
    payment: 'Paid'
  },
  {
    orderId: 'ORD-7819',
    customer: 'Ananya Singh',
    email: 'ananya@example.com',
    product: 'Leather Crossbody',
    items: [
      {
        name: 'Leather Crossbody Bag',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
        price: 89999,
        quantity: 1,
        size: 'One Size',
        color: 'Noir'
      }
    ],
    subtotal: 89999,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 89999,
    amount: '₹89,999',
    status: 'Processing',
    date: '2026-03-24',
    paymentMethod: 'Razorpay',
    paymentStatus: 'paid',
    payment: 'Paid'
  },
  {
    orderId: 'ORD-7818',
    customer: 'Rohan Kapoor',
    email: 'rohan@example.com',
    product: 'Cashmere Scarf',
    items: [
      {
        name: 'Classic Check Cashmere Scarf',
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80',
        price: 8999,
        quantity: 1,
        size: 'One Size',
        color: 'Classic Beige'
      }
    ],
    subtotal: 8999,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 8999,
    amount: '₹8,999',
    status: 'Delivered',
    date: '2026-03-23',
    paymentMethod: 'Razorpay',
    paymentStatus: 'paid',
    payment: 'Paid'
  },
  {
    orderId: 'ORD-7817',
    customer: 'Meera Joshi',
    email: 'meera@example.com',
    product: 'Tulle Cocktail Dress',
    items: [
      {
        name: 'Embroidered Tulle Cocktail Dress',
        image: 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80',
        price: 156000,
        quantity: 1,
        size: 'S',
        color: 'Navy'
      }
    ],
    subtotal: 156000,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 156000,
    amount: '₹1,56,000',
    status: 'Pending',
    date: '2026-03-23',
    paymentMethod: 'COD',
    paymentStatus: 'pending',
    payment: 'COD'
  },
  {
    orderId: 'ORD-7816',
    customer: 'Vikram Patel',
    email: 'vikram@example.com',
    product: 'Oversized Blazer',
    items: [
      {
        name: 'Oversized Structured Blazer',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
        price: 98000,
        quantity: 1,
        size: 'M',
        color: 'Black'
      }
    ],
    subtotal: 98000,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 98000,
    amount: '₹98,000',
    status: 'Cancelled',
    date: '2026-03-22',
    paymentMethod: 'Razorpay',
    paymentStatus: 'refunded',
    payment: 'Refunded'
  },
  {
    orderId: 'ORD-7815',
    customer: 'Sanya Reddy',
    email: 'sanya@example.com',
    product: 'Floral Midi Dress',
    items: [
      {
        name: 'Floral Print Midi Dress',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
        price: 34500,
        quantity: 1,
        size: 'M',
        color: 'Floral Multi'
      }
    ],
    subtotal: 34500,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 34500,
    amount: '₹34,500',
    status: 'Delivered',
    date: '2026-03-21',
    paymentMethod: 'Razorpay',
    paymentStatus: 'paid',
    payment: 'Paid'
  },
  {
    orderId: 'ORD-7814',
    customer: 'Karan Malhotra',
    email: 'karan@example.com',
    product: 'Re-Nylon Jacket',
    items: [
      {
        name: 'Re-Nylon Cropped Jacket',
        image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80',
        price: 67000,
        quantity: 1,
        size: 'L',
        color: 'Black'
      }
    ],
    subtotal: 67000,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 67000,
    amount: '₹67,000',
    status: 'Shipped',
    date: '2026-03-21',
    paymentMethod: 'Razorpay',
    paymentStatus: 'paid',
    payment: 'Paid'
  }
];

// ==================== REVIEWS ====================
const reviews = [
  {
    product: null, // Will be updated after products are inserted
    productName: 'Silk Draped Evening Gown',
    productImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80',
    userName: 'Priya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=60',
    rating: 5,
    comment: 'Absolutely stunning! The quality is exceptional and fits perfectly. Worth every penny.',
    status: 'approved',
    date: '2026-04-05'
  },
  {
    product: null,
    productName: 'Leather Crossbody Bag',
    productImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    userName: 'Ananya Singh',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=60',
    rating: 4,
    comment: 'Beautiful leather and excellent craftsmanship. The size is perfect for daily use.',
    status: 'approved',
    date: '2026-04-03'
  },
  {
    product: null,
    productName: 'Tailored Wool Overcoat',
    productImage: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80',
    userName: 'Arjun Mehta',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=60',
    rating: 5,
    comment: 'Superb quality and warm enough for winter. Classic style that never goes out of fashion.',
    status: 'approved',
    date: '2026-04-01'
  },
  {
    product: null,
    productName: 'Cashmere Scarf',
    productImage: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80',
    userName: 'Meera Joshi',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=60',
    rating: 3,
    comment: 'Soft and cozy but expected better quality for this price point.',
    status: 'pending',
    date: '2026-03-28'
  },
  {
    product: null,
    productName: 'Re-Nylon Cropped Jacket',
    productImage: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80',
    userName: 'Rohan Kapoor',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=60',
    rating: 4,
    comment: 'Great fit and stylish. Slightly tight around shoulders but overall satisfied.',
    status: 'approved',
    date: '2026-03-25'
  },
  {
    product: null,
    productName: 'Floral Print Midi Dress',
    productImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
    userName: 'Vikram Reddy',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=60',
    rating: 2,
    comment: 'Color was different from the website. Fabric also felt cheaper than expected.',
    status: 'rejected',
    date: '2026-03-20'
  }
];

// ==================== MAIN SEED FUNCTION ====================
async function seedAll() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Banner.deleteMany({});
    await Story.deleteMany({});
    await Coupon.deleteMany({});
    await User.deleteMany({});
    await mongoose.model('Order', require('./models/Order').schema).deleteMany({});
    await mongoose.model('Review', require('./models/Review').schema).deleteMany({});
    console.log('✅ Data cleared\n');

    // Seed Categories
    console.log('📂  Seeding categories...');
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ Inserted ${insertedCategories.length} categories\n`);

    // Seed Products
    console.log('🛍️  Seeding products...');
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Inserted ${insertedProducts.length} products\n`);

    // Seed Banners
    console.log('🖼️  Seeding banners...');
    const insertedBanners = await Banner.insertMany(banners);
    console.log(`✅ Inserted ${insertedBanners.length} banners\n`);

    // Seed Stories
    console.log('📰  Seeding stories...');
    const insertedStories = await Story.insertMany(stories);
    console.log(`✅ Inserted ${insertedStories.length} stories\n`);

    // Seed Coupons
    console.log('🎟️  Seeding coupons...');
    const insertedCoupons = await Coupon.insertMany(coupons);
    console.log(`✅ Inserted ${insertedCoupons.length} coupons\n`);

    // Seed Users
    console.log('👥  Seeding users...');
    const insertedUsers = await User.insertMany(users);
    console.log(`✅ Inserted ${insertedUsers.length} users\n`);

    // Seed Orders
    console.log('📦  Seeding orders...');
    const Order = mongoose.model('Order', require('./models/Order').schema);
    const insertedOrders = await Order.insertMany(orders);
    console.log(`✅ Inserted ${insertedOrders.length} orders\n`);

    // Seed Reviews (link to products)
    console.log('⭐  Seeding reviews...');
    const Review = mongoose.model('Review', require('./models/Review').schema);
    
    // Map product names to IDs
    const productMap = {};
    insertedProducts.forEach(p => {
      productMap[p.name] = p._id;
    });

    // Update reviews with product IDs
    const reviewsWithProducts = reviews.map(r => ({
      ...r,
      product: productMap[r.productName] || null
    }));

    const insertedReviews = await Review.insertMany(reviewsWithProducts);
    console.log(`✅ Inserted ${insertedReviews.length} reviews\n`);

    // Print Summary
    console.log('========================================');
    console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
    console.log('========================================\n');
    
    console.log('📊 SUMMARY:');
    console.log(`   Categories: ${insertedCategories.length}`);
    console.log(`   Products: ${insertedProducts.length}`);
    console.log(`   Banners: ${insertedBanners.length}`);
    console.log(`   Stories: ${insertedStories.length}`);
    console.log(`   Coupons: ${insertedCoupons.length}`);
    console.log(`   Users: ${insertedUsers.length}`);
    console.log(`   Orders: ${insertedOrders.length}`);
    console.log(`   Reviews: ${insertedReviews.length}\n`);

    console.log('🔗 CATEGORIES:');
    insertedCategories.forEach(c => console.log(`   - /${c.slug} (${c.name})`));
    
    console.log('\n🛍️  PRODUCTS:');
    insertedProducts.forEach(p => console.log(`   - ${p.name} (${p.brand}) - ₹${p.price.toLocaleString('en-IN')}`));

    console.log('\n📦  ORDERS:');
    insertedOrders.forEach(o => console.log(`   - ${o.orderId}: ${o.customer} - ${o.status}`));

    console.log('\n👥  USERS:');
    insertedUsers.forEach(u => console.log(`   - ${u.name} (${u.email}) - ${u.status}`));

    console.log('\n✨ You can now:');
    console.log('   1. Visit http://localhost:3000 - Frontend');
    console.log('   2. Visit http://localhost:3000/admin - Admin Panel');
    console.log('   3. Login: admin@elevation.com / admin123\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    console.error(err);
    process.exit(1);
  }
}

seedAll();
