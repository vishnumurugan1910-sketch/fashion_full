'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SimpleCard3D from '@/components/SimpleCard3D';
import { useProducts } from '@/lib/useProducts';
import { useCategories } from '@/lib/useCategories';

interface CategoryProduct {
  id: string;
  brand: string;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
}

const defaultCategory = {
  _id: '',
  name: 'Collection',
  title: 'Collection',
  slug: '',
  subtitle: 'Explore Our World',
  banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
  image: '',
  isActive: true,
};

export default function CategoryPage() {
  const params = useParams();
  const name = (params?.name as string) || '';
  const [sortBy, setSortBy] = useState('featured');
  
  const { categories, loading: categoriesLoading } = useCategories();
  const { products, loading: productsLoading } = useProducts({ category: name });

  const category = categories.find(c => c.slug === name) || defaultCategory;
  
  // Ensure banner and image are strings
  const banner = String(category.banner || category.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80');
  const title = String(category.name || category.title || name);

  const categoryProducts: CategoryProduct[] = products.map((p: { _id?: string | { toString(): string }; id?: string; name: string; brand: string; price: number; originalPrice?: number; image?: string }) => {
    // Safely convert _id to string
    let idStr = '';
    try {
      if (p._id) {
        if (typeof p._id === 'string') {
          idStr = p._id;
        } else if (typeof p._id === 'object' && typeof (p._id as { toString(): string }).toString === 'function') {
          idStr = (p._id as { toString(): string }).toString();
        }
      }
      if (!idStr) idStr = (p.id as string) || '';
    } catch {
      idStr = (p.id as string) || '';
    }
    
    return {
      id: idStr,
      brand: String(p.brand || ''),
      title: String(p.name || ''),
      price: Number(p.price) || 0,
      originalPrice: p.originalPrice ? Number(p.originalPrice) : 0,
      image: p.image ? String(p.image) : '',
    };
  });

  const formatPrice = (v: number) =>
    v.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  const discount = (price: number, original: number) =>
    Math.round(((original - price) / original) * 100);

  const sorted = [...categoryProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  if (categoriesLoading || productsLoading) {
    return (
      <>
        <Navbar />
        <main className="bg-theme min-h-screen">
          <div className="relative h-[50vh] overflow-hidden bg-charcoal animate-pulse" />
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i: number) => (
                <div key={i} className="aspect-[3/4] bg-charcoal rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-theme min-h-screen">
        {/* Banner */}
        <div className="relative h-[50vh] overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${banner})` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-theme" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] tracking-[0.5em] uppercase text-gold/60 font-sans mb-4">
              Collection
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-serif text-5xl md:text-7xl text-white">
              {title}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm text-white/60 mt-3 font-sans">
              {title} Collection
            </motion.p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <nav className="flex items-center gap-2 text-xs text-theme-tertiary">
              <Link href="/" className="hover:text-gold transition-colors">Home</Link>
              <span>/</span>
              <span className="text-theme-secondary">{title}</span>
            </nav>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-theme-input border border-theme-strong rounded-lg text-xs text-theme outline-none appearance-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {sorted.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sorted.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <SimpleCard3D
                    id={product.id}
                    brand={product.brand}
                    title={product.title}
                    price={formatPrice(product.price)}
                    originalPrice={formatPrice(product.originalPrice)}
                    discount={discount(product.price, product.originalPrice)}
                    image={product.image}
                    href={`/product/${product.id}`}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-theme-muted font-serif">Coming Soon</p>
              <p className="text-sm text-theme-muted mt-2">Products for this category are being curated</p>
              <Link href="/" className="inline-block mt-6 px-8 py-3 bg-theme-button border border-theme-gold text-theme text-xs tracking-[0.2em] uppercase hover:bg-theme-button hover:border-gold transition-all rounded-lg">
                Explore Other Collections
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
