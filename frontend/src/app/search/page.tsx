'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import SimpleCard3D from '@/components/SimpleCard3D';
import { useProducts } from '@/lib/useProducts';
import { fixImageUrl } from '@/lib/api';

const trendingSearches = ['Evening Gown', 'Leather Bag', 'Designer Jacket', 'Cashmere Scarf', 'Premium Sneakers'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { products, loading } = useProducts();

  const categoriesSet = new Set(products.map((p) => p.category));
  const categories = ['All', ...Array.from(categoriesSet)];

  const results = products.filter((p) => {
    const matchQuery = !query || 
      p.name?.toLowerCase().includes(query.toLowerCase()) || 
      p.brand?.toLowerCase().includes(query.toLowerCase());
    const matchCategory = activeCategory === 'All' || 
      p.category?.toLowerCase() === activeCategory.toLowerCase();
    return matchQuery && matchCategory;
  });

  const formatPrice = (v: number) => v.toLocaleString('en-IN', { 
    style: 'currency', 
    currency: 'INR', 
    maximumFractionDigits: 0 
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-28 pb-20 bg-theme min-h-screen">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map((i) => (
                <div key={i} className="aspect-[3/4] bg-theme-input animate-pulse rounded-lg" />
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
      <main className="pt-28 pb-20 bg-theme min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Hero Search Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h1 className="font-serif text-4xl md:text-5xl text-theme mb-3">
                Discover Your Style
              </h1>
              <p className="text-theme-muted">
                Search from our curated collection of premium fashion
              </p>
            </div>

            {/* Search Input */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="relative flex items-center">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-theme-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search brands, products, categories..."
                  className="w-full pl-14 pr-14 py-4 bg-[#1a1a1a] border border-white/10 rounded-full text-theme placeholder:text-theme-muted outline-none focus:border-theme-gold focus:ring-1 focus:ring-theme-gold/30 transition-all text-lg"
                />
                {query && (
                  <button 
                    onClick={() => setQuery('')} 
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Trending Pills */}
            {!query && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <span className="text-xs text-theme-muted mr-2 self-center">Trending:</span>
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-theme-muted hover:text-theme hover:border-theme-gold/50 transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-theme-gold text-theme-dark font-semibold'
                    : 'bg-white/5 border border-white/10 text-theme-muted hover:text-theme hover:border-theme-gold/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-theme-muted">
              {results.length} {results.length === 1 ? 'item' : 'items'} found
              {query && <span className="text-theme-gold"> for "{query}"</span>}
            </p>
          </div>

          {/* Results Grid */}
          {results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <SimpleCard3D
                    id={product.id || ''}
                    brand={product.brand || ''}
                    title={product.name || ''}
                    price={formatPrice(product.price || 0)}
                    image={fixImageUrl(product.image)}
                    href={`/product/${product.id}`}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-10 h-10 text-theme-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <p className="text-xl text-theme font-serif mb-2">No results found</p>
              <p className="text-sm text-theme-muted">Try different keywords or browse categories</p>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}