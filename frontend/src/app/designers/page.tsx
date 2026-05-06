'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface Designer {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  category: string;
  productCount: number;
}

const designers: Designer[] = [
  {
    id: 'valentino',
    name: 'Valentino',
    country: 'Italy',
    description: 'Haute couture elegance since 1960. Known for exquisite evening wear and the signature Valentino Red.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    category: 'Women',
    productCount: 156,
  },
  {
    id: 'gucci',
    name: 'Gucci',
    country: 'Italy',
    description: 'Italian luxury fashion house. Bold patterns, maximalist aesthetics, and heritage craftsmanship.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    category: 'Women',
    productCount: 234,
  },
  {
    id: 'prada',
    name: 'Prada',
    country: 'Italy',
    description: 'Minimalist luxury meets innovative materials. Clean lines and intellectual fashion.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    category: 'Women',
    productCount: 189,
  },
  {
    id: 'dior',
    name: 'Dior',
    country: 'France',
    description: 'Timeless French elegance. The New Bar silhouette and couture excellence since 1946.',
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80',
    category: 'Women',
    productCount: 201,
  },
  {
    id: 'balenciaga',
    name: 'Balenciaga',
    country: 'France',
    description: 'Avant-garde streetwear meets high fashion. Redefining modern luxury through disruption.',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80',
    category: 'Men',
    productCount: 145,
  },
  {
    id: 'burberry',
    name: 'Burberry',
    country: 'United Kingdom',
    description: 'British heritage at its finest. Iconic check pattern and the legendary trench coat.',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80',
    category: 'Accessories',
    productCount: 178,
  },
  {
    id: 'hermes',
    name: 'Hermès',
    country: 'France',
    description: 'Artisanal luxury leather goods. The Birkin and Kelly — icons of craftsmanship.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    category: 'Accessories',
    productCount: 98,
  },
  {
    id: 'versace',
    name: 'Versace',
    country: 'Italy',
    description: 'Bold glamour and Medusa motifs. Unapopologetic luxury and Italian opulence.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    category: 'Women',
    productCount: 167,
  },
];

const categories = ['All', 'Women', 'Men', 'Accessories'];

function DesignerCard({ designer }: { designer: Designer }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { damping: 25, stiffness: 200 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), spring);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), spring);
  const scale = useSpring(hovered ? 1.02 : 1, { damping: 20, stiffness: 300 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
    my.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, scale, transformPerspective: 1000 }}
      className="group relative"
    >
      <Link href={`/category/${designer.category.toLowerCase()}`} className="block">
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-charcoal">
          <div className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110" style={{ backgroundImage: `url(${designer.image})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
          <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-gold/25 transition-colors duration-500" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-[9px] tracking-[0.3em] uppercase text-gold/60 font-sans mb-2">{designer.country}</p>
            <h3 className="font-serif text-3xl text-white group-hover:text-gold transition-colors duration-300">{designer.name}</h3>
            <p className="text-xs text-white/50 mt-2 line-clamp-2">{designer.description}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[10px] tracking-wider uppercase text-white/40 font-sans">{designer.productCount} pieces</span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-sans flex items-center gap-1">
                View
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </span>
            </div>
          </div>

          {/* Corner accents */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-transparent group-hover:border-gold/20 transition-colors duration-500" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-transparent group-hover:border-gold/20 transition-colors duration-500" />
        </div>

        {/* Lift shadow */}
        <motion.div
          animate={{ opacity: hovered ? 0.3 : 0, y: hovered ? 12 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute -bottom-3 left-6 right-6 h-8 bg-gold/15 blur-xl rounded-full -z-10"
        />
      </Link>
    </motion.div>
  );
}

export default function DesignersPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? designers
    : designers.filter((d) => d.category === activeCategory);

  return (
    <>
      <Navbar />
      <main className="bg-theme min-h-screen">
        {/* Hero */}
        <div className="relative h-[45vh] overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-theme" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] tracking-[0.5em] uppercase text-gold/60 font-sans mb-4">
              Our Partners
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-serif text-5xl md:text-7xl text-white">
              Designers
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm text-white/60 mt-3 max-w-md font-sans">
              Discover collections from the world&apos;s most prestigious fashion houses
            </motion.p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          {/* Breadcrumb + Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <nav className="flex items-center gap-2 text-xs text-theme-tertiary">
              <Link href="/" className="hover:text-gold transition-colors">Home</Link>
              <span>/</span>
              <span className="text-theme-secondary">Designers</span>
            </nav>

            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-[11px] rounded-full border transition-all ${
                    activeCategory === cat
                      ? 'border-gold/60 text-gold bg-gold/10'
                      : 'border-theme-strong text-theme-tertiary hover:text-theme'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((designer, i) => (
              <motion.div
                key={designer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <DesignerCard designer={designer} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
