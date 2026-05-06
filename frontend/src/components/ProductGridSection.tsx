'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard, { Product } from './ProductCard';
import Product3DViewer from './Product3DViewer';

const products: Product[] = [
  {
    id: 'p1',
    brand: 'Valentino',
    title: 'Silk Draped Evening Gown with Embellished Bodice',
    price: 42999,
    originalPrice: 64999,
    discount: 34,
    imageFront: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
    imageBack: 'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=800&q=80',
    tag: 'Bestseller',
    images360: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=900&q=85',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=85',
      'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=900&q=85',
      'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=900&q=85',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=85',
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=900&q=85',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85',
    ],
  },
  {
    id: 'p2',
    brand: 'Zara Studio',
    title: 'Tailored Wool Blend Overcoat in Camel',
    price: 12499,
    originalPrice: 18999,
    discount: 34,
    imageFront: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
    imageBack: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
  },
  {
    id: 'p3',
    brand: 'Hermès',
    title: 'Leather Crossbody Bag with Gold Hardware',
    price: 89999,
    originalPrice: 120000,
    discount: 25,
    imageFront: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    imageBack: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80',
    tag: 'New Arrival',
    images360: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=85',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=85',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=900&q=85',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=900&q=85',
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=900&q=85',
      'https://images.unsplash.com/photo-1614179689702-355944cd0918?w=900&q=85',
      'https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=900&q=85',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=85',
    ],
  },
  {
    id: 'p4',
    brand: 'Gucci',
    title: 'Floral Print Midi Dress with Belted Waist',
    price: 34500,
    originalPrice: 49500,
    discount: 30,
    imageFront: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    imageBack: 'https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=800&q=80',
  },
  {
    id: 'p5',
    brand: 'Prada',
    title: 'Re-Nylon Cropped Jacket with Zip Detail',
    price: 67000,
    originalPrice: 89000,
    discount: 25,
    imageFront: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80',
    imageBack: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    tag: 'Limited',
    images360: [
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=900&q=85',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=85',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=85',
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=900&q=85',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=85',
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=900&q=85',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=900&q=85',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=85',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=85',
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=900&q=85',
    ],
  },
  {
    id: 'p6',
    brand: 'Burberry',
    title: 'Classic Check Cashmere Scarf',
    price: 8999,
    originalPrice: 12999,
    discount: 31,
    imageFront: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80',
    imageBack: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80',
  },
  {
    id: 'p7',
    brand: 'Dior',
    title: 'Embroidered Tulle Cocktail Dress',
    price: 156000,
    originalPrice: 210000,
    discount: 26,
    imageFront: 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&q=80',
    imageBack: 'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=800&q=80',
    tag: 'Bestseller',
    images360: [
      'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=900&q=85',
      'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=900&q=85',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=85',
      'https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=900&q=85',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=85',
      'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=900&q=85',
      'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=900&q=85',
      'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=900&q=85',
    ],
  },
  {
    id: 'p8',
    brand: 'Balenciaga',
    title: 'Oversized Structured Blazer in Black',
    price: 98000,
    originalPrice: 135000,
    discount: 27,
    imageFront: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    imageBack: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
  },
];

const filterTags = ['All', 'New Arrival', 'Bestseller', 'Limited', 'Under ₹50K'];

export default function ProductGridSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewerProduct, setViewerProduct] = useState<Product | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const filteredProducts =
    activeFilter === 'All'
      ? products
      : activeFilter === 'Under ₹50K'
      ? products.filter((p) => p.price < 50000)
      : products.filter((p) => p.tag === activeFilter);

  const handleView3D = (product: Product) => {
    setViewerProduct(product);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setTimeout(() => setViewerProduct(null), 400);
  };

  return (
    <>
      <section className="relative py-20 md:py-32 bg-midnight">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            {/* Title */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="w-12 h-px bg-gold/50" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-sans">
                  The Edit
                </span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-pearl tracking-tight leading-[1.05]">
                Trending<br />
                <span className="italic text-gold">Now</span>
              </h2>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2">
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`relative px-4 py-2 text-[11px] tracking-[0.15em] uppercase font-sans rounded-full border transition-all duration-400 ${
                    activeFilter === tag
                      ? 'border-gold/60 text-gold bg-gold/10'
                      : 'border-graphite/50 text-slate hover:text-pearl hover:border-slate/60'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10 md:gap-y-14"
          >
            {filteredProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onView3D={handleView3D}
              />
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate font-sans text-sm tracking-wider">
                No products match this filter.
              </p>
            </div>
          )}

          {/* Load More */}
          <div className="flex justify-center mt-16 md:mt-20">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative px-12 py-4 border border-gold/40 text-pearl text-xs tracking-[0.25em] uppercase font-sans overflow-hidden transition-all duration-500 hover:border-gold"
            >
              <span className="absolute inset-0 bg-gold/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-luxury" />
              <span className="relative z-10 flex items-center gap-3">
                View All Products
                <svg
                  className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* 3D Viewer Modal */}
      <Product3DViewer
        product={viewerProduct}
        isOpen={isViewerOpen}
        onClose={handleCloseViewer}
      />
    </>
  );
}
