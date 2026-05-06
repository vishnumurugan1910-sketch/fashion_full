'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Card3D from './Card3D';
import { useCategories, Category } from '@/lib/useCategories';
import { useFeaturedProducts } from '@/lib/useProducts';

gsap.registerPlugin(ScrollTrigger);

/* ─── Static Stories Data ─── */
const stories = [
  {
    tag: 'Chapter I',
    title: 'Crafted',
    accent: 'Elegance',
    desc: 'Every stitch tells a story of heritage and precision. Handcrafted by artisans across generations.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80',
  },
  {
    tag: 'Chapter II',
    title: 'Timeless',
    accent: 'Design',
    desc: 'Silhouettes that transcend seasons. Where classic meets contemporary in a dance of form.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80',
  },
  {
    tag: 'Chapter III',
    title: 'Modern',
    accent: 'Luxury',
    desc: 'Redefining opulence for the new era. Sustainable materials, bold statements, conscious choices.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=80',
  },
];

/* ─── Fallback Data (used when API is unavailable) ─── */
const fallbackCategories = [
  { id: 'women', _id: 'women', slug: 'women', title: 'Women', subtitle: 'Elegance Redefined', count: '2,400+ Styles', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80', name: 'Women', isActive: true },
  { id: 'men', _id: 'men', slug: 'men', title: 'Men', subtitle: 'Modern Sophistication', count: '1,800+ Styles', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', name: 'Men', isActive: true },
  { id: 'accessories', _id: 'accessories', slug: 'accessories', title: 'Accessories', subtitle: 'Statement Pieces', count: '3,200+ Items', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80', name: 'Accessories', isActive: true },
  { id: 'footwear', _id: 'footwear', slug: 'footwear', title: 'Footwear', subtitle: 'Step Into Style', count: '1,100+ Pairs', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80', name: 'Footwear', isActive: true },
];

const fallbackProducts = [
  { _id: 'p1', id: 'p1', brand: 'Valentino', name: 'Silk Draped Evening Gown', price: 42999, originalPrice: 64999, discount: 34, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80', title: 'Silk Draped Evening Gown' },
  { _id: 'p3', id: 'p3', brand: 'Hermès', name: 'Leather Crossbody Bag', price: 89999, originalPrice: 120000, discount: 25, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', title: 'Leather Crossbody Bag' },
  { _id: 'p7', id: 'p7', brand: 'Dior', name: 'Embroidered Tulle Dress', price: 156000, originalPrice: 210000, discount: 26, image: 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80', title: 'Embroidered Tulle Dress' },
  { _id: 'p5', id: 'p5', brand: 'Prada', name: 'Re-Nylon Cropped Jacket', price: 67000, originalPrice: 89000, discount: 25, image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80', title: 'Re-Nylon Cropped Jacket' },
];

export default function HorizontalScrollExperience() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Fetch categories and products from API
  const { categories, loading: categoriesLoading } = useCategories();
  const { products: apiProducts, loading: productsLoading } = useFeaturedProducts(8);

  // Use API data or fallback to static data
  const displayCategories = categories.length > 0 ? categories : fallbackCategories;
  const displayProducts = apiProducts.length > 0 ? apiProducts : fallbackProducts;

// Transform API products to display format
  const transformedProducts = displayProducts.map((p: { _id?: string | { toString(): string }; id?: string; brand: string; name: string; title?: string; price: number; originalPrice?: number; image?: string | object }) => {
    // Safely get id as string
    let idStr = '';
    try {
      if (p._id) {
        if (typeof p._id === 'string') {
          idStr = p._id;
        } else if (typeof p._id === 'object') {
          const obj = p._id as { toString(): string };
          if (typeof obj.toString === 'function') {
            idStr = obj.toString();
          }
        }
      }
      if (!idStr) idStr = (p.id as string) || '';
    } catch {
      idStr = String(p.id || '');
    }
    
    // Safely get image URL
    let imageUrl = '';
    try {
      if (typeof p.image === 'string') {
        imageUrl = p.image;
      } else if (p.image && typeof p.image === 'object') {
        const imgObj = p.image as Record<string, unknown>;
        if (typeof imgObj.image === 'string') {
          imageUrl = imgObj.image;
        } else if (typeof imgObj.toString === 'function') {
          imageUrl = (imgObj as { toString(): string }).toString();
        }
      }
    } catch {
      imageUrl = '';
    }
    
    return {
      id: idStr,
      brand: String(p.brand || ''),
      title: String(p.title || p.name || ''),
      priceDisplay: `₹${Number(p.price).toLocaleString('en-IN')}`,
      originalPriceDisplay: p.originalPrice ? `₹${Number(p.originalPrice).toLocaleString('en-IN')}` : `₹${Number(p.price).toLocaleString('en-IN')}`,
      discount: p.originalPrice ? Math.round(((Number(p.originalPrice) - Number(p.price)) / Number(p.originalPrice)) * 100) : 0,
      image: imageUrl,
    };
  });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const ctx = gsap.context(() => {
      const totalWidth = track.scrollWidth - window.innerWidth;

      // Main horizontal scroll
      const scrollTween = gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${track.scrollWidth}`,
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Animate each panel as it enters from the right
      const panels = gsap.utils.toArray<HTMLElement>('.h-panel');
      panels.forEach((panel, i) => {
        if (i === 0) return;

        const content = panel.querySelectorAll('.h-reveal');
        if (content.length) {
          gsap.fromTo(
            content,
            { opacity: 0, x: 60, y: 20 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.7,
              stagger: 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: 'left 80%',
                end: 'left 30%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });

      // Parallax images inside panels
      const images = gsap.utils.toArray<HTMLElement>('.h-parallax');
      images.forEach((img) => {
        gsap.fromTo(
          img,
          { x: 40 },
          {
            x: -40,
            ease: 'none',
            scrollTrigger: {
              trigger: img,
              containerAnimation: scrollTween,
              start: 'left right',
              end: 'right left',
              scrub: 1,
            },
          }
        );
      });

    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative overflow-hidden bg-midnight">
      <div
        ref={trackRef}
        className="flex items-stretch"
        style={{ width: 'max-content' }}
      >
        {/* ═══════ PANEL 1: Storytelling ═══════ */}
        <Panel className="h-panel">
          <div className="h-full flex items-center px-8 lg:px-16">
            <div className="max-w-md">
              <div className="h-reveal flex items-center gap-3 mb-6">
                <span className="w-10 h-px bg-gold/60" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-sans">{stories[0].tag}</span>
              </div>
              <h2 className="h-reveal font-serif text-5xl sm:text-6xl lg:text-7xl text-pearl leading-[0.92] tracking-tight mb-4">
                {stories[0].title}<br /><span className="italic text-gold">{stories[0].accent}</span>
              </h2>
              <p className="h-reveal text-sm text-champagne/60 leading-relaxed mb-8 max-w-sm">{stories[0].desc}</p>
              <Link href="/category/women" className="h-reveal inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-pearl/70 hover:text-gold transition-colors font-sans">
                Explore Collection
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
              </Link>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
            <div className="h-parallax w-[120%] h-full bg-cover bg-center" style={{ backgroundImage: `url(${stories[0].image})` }} />
            <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/40 to-transparent" />
          </div>
        </Panel>

        {/* ═══════ PANEL 2: Story ═══════ */}
        <Panel className="h-panel">
          <div className="h-full flex items-center px-8 lg:px-16">
            <div className="max-w-md">
              <div className="h-reveal flex items-center gap-3 mb-6">
                <span className="w-10 h-px bg-gold/60" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-sans">{stories[1].tag}</span>
              </div>
              <h2 className="h-reveal font-serif text-5xl sm:text-6xl lg:text-7xl text-pearl leading-[0.92] tracking-tight mb-4">
                {stories[1].title}<br /><span className="italic text-gold">{stories[1].accent}</span>
              </h2>
              <p className="h-reveal text-sm text-champagne/60 leading-relaxed mb-8 max-w-sm">{stories[1].desc}</p>
              <Link href="/category/women" className="h-reveal inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-pearl/70 hover:text-gold transition-colors font-sans">
                Discover More
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
              </Link>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
            <div className="h-parallax w-[120%] h-full bg-cover bg-center" style={{ backgroundImage: `url(${stories[1].image})` }} />
            <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/40 to-transparent" />
          </div>
        </Panel>

        {/* ═══════ PANEL 3: Story ═══════ */}
        <Panel className="h-panel">
          <div className="h-full flex items-center px-8 lg:px-16">
            <div className="max-w-md">
              <div className="h-reveal flex items-center gap-3 mb-6">
                <span className="w-10 h-px bg-gold/60" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-sans">{stories[2].tag}</span>
              </div>
              <h2 className="h-reveal font-serif text-5xl sm:text-6xl lg:text-7xl text-pearl leading-[0.92] tracking-tight mb-4">
                {stories[2].title}<br /><span className="italic text-gold">{stories[2].accent}</span>
              </h2>
              <p className="h-reveal text-sm text-champagne/60 leading-relaxed mb-8 max-w-sm">{stories[2].desc}</p>
              <Link href="/category/accessories" className="h-reveal inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-pearl/70 hover:text-gold transition-colors font-sans">
                See the Collection
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
              </Link>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
            <div className="h-parallax w-[120%] h-full bg-cover bg-center" style={{ backgroundImage: `url(${stories[2].image})` }} />
            <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/40 to-transparent" />
          </div>
        </Panel>

        {/* ═══════ PANEL 4: Categories ═══════ */}
        <Panel className="h-panel" width="160vw">
          <div className="h-full flex flex-col justify-center px-8 lg:px-16">
            <div className="h-reveal mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-px bg-gold/50" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-sans">Curated For You</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl text-theme tracking-tight">
                Shop by <span className="italic text-gold">Category</span>
              </h2>
            </div>

<div className="flex gap-7 overflow-visible snap-x snap-mandatory" style={{ scrollBehavior: 'smooth' }}>
              {displayCategories.map((cat: { _id?: string; id?: string; slug?: string; title?: string; name?: string; subtitle?: string; count?: string; image?: string; banner?: string; productCount?: number }, i: number) => (
                <Card3D
                  key={String(cat._id || cat.id || i)}
                  title={String(cat.title || cat.name || 'Category')}
                  subtitle={String(cat.subtitle || `${(cat as { productCount?: number }).productCount || 0}+ Styles`)}
                  count={String(cat.count || '')}
                  image={String(cat.image || cat.banner || '')}
                  href={`/category/${String(cat.slug || cat.id || cat._id || '')}`}
                  className="h-reveal flex-shrink-0 w-[26vw] min-w-[280px] max-w-[380px] h-[65vh] snap-center"
                />
              ))}
            </div>
          </div>
        </Panel>

        {/* ═══════ PANEL 5: Products ═══════ */}
        <Panel className="h-panel" width="150vw">
          <div className="h-full flex flex-col justify-center px-8 lg:px-16">
            <div className="h-reveal mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-px bg-gold/50" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-sans">The Edit</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl text-theme tracking-tight">
                Trending <span className="italic text-gold">Now</span>
              </h2>
            </div>

            <div className="flex gap-6 overflow-visible snap-x snap-mandatory" style={{ scrollBehavior: 'smooth' }}>
              {transformedProducts.map((prod, i) => (
                <ProductCard3D
                  key={prod.id || i}
                  product={prod}
                  index={i}
                  isLast={i === transformedProducts.length - 1}
                />
              ))}
            </div>
          </div>
        </Panel>

        {/* ═══════ PANEL 6: Parallax Showcase ═══════ */}
        <Panel className="h-panel">
          <div className="relative w-full h-full">
            <div className="h-parallax absolute inset-0 w-[120%] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80)' }} />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/40" />
            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
              <div>
                <div className="h-reveal flex items-center justify-center gap-3 mb-6">
                  <span className="w-8 h-px bg-gold/50" />
                  <span className="w-1.5 h-1.5 bg-gold/60 rotate-45" />
                  <span className="text-[10px] tracking-[0.5em] uppercase text-gold font-sans">The Atelier</span>
                  <span className="w-1.5 h-1.5 bg-gold/60 rotate-45" />
                  <span className="w-8 h-px bg-gold/50" />
                </div>
                <h2 className="h-reveal font-serif text-5xl sm:text-6xl lg:text-8xl text-white leading-[0.9] tracking-tight mb-6" style={{ textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}>
                  Where Craft<br /><span className="italic text-gold">Meets Vision</span>
                </h2>
                <p className="h-reveal max-w-lg mx-auto text-sm text-white/70 leading-relaxed mb-10" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
                  Every garment is a dialogue between tradition and innovation — hand-finished details meet modern silhouettes.
                </p>
                <Link href="/search" className="h-reveal inline-flex items-center gap-3 px-10 py-4 bg-gold/15 border border-gold/50 text-white text-xs tracking-[0.2em] uppercase font-sans hover:bg-gold/25 hover:border-gold transition-all duration-500 rounded-sm">
                  Explore the Collection
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </Panel>

        {/* ═══════ Last Panel End ═══════ */}
      </div>

      {/* Fixed bottom scroll indicator — hidden when horizontal scroll ends */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[9px] tracking-[0.4em] uppercase text-slate/40 font-sans">Scroll to explore</span>
        <div className="w-12 h-px bg-gold/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-6 bg-gold animate-slide-right" />
        </div>
      </div>
    </div>
  );
}

/* ─── Panel Component ─── */
function Panel({
  children,
  className = '',
  width = '100vw',
}: {
  children: React.ReactNode;
  className?: string;
  width?: string;
}) {
  return (
    <div
      className={`relative flex-shrink-0 h-screen overflow-hidden bg-midnight ${className}`}
      style={{ width }}
    >
      {children}
    </div>
  );
}

/* ─── 3D Product Card ─── */
interface TransformedProduct {
  id: string;
  brand: string;
  title: string;
  priceDisplay: string;
  originalPriceDisplay: string;
  discount: number;
  image: string;
}

function ProductCard3D({ product, index, isLast }: { product: TransformedProduct; index: number; isLast: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { damping: 25, stiffness: 200, mass: 0.6 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), spring);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), spring);
  const scale = useSpring(hovered ? 1.03 : 1, { damping: 20, stiffness: 300 });

  const glareX = useSpring(useTransform(mx, [-0.5, 0.5], [0, 100]), spring);
  const glareY = useSpring(useTransform(my, [-0.5, 0.5], [0, 100]), spring);

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
      style={{
        rotateX,
        rotateY,
        scale,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className="h-reveal group relative flex-shrink-0 w-[22vw] min-w-[240px] max-w-[300px] snap-center"
    >
      {/* View All — positioned above last card */}
      {isLast && (
        <div className="absolute -top-10 right-0 z-20">
          <Link href="/search" className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-theme-tertiary hover:text-gold transition-colors font-sans">
            View All
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
          </Link>
        </div>
      )}
      <Link href={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-charcoal mb-4 relative">
          <div className="w-full h-full bg-cover bg-center transition-transform duration-600 ease-out group-hover:scale-110" style={{ backgroundImage: `url(${product.image})` }} />

          {/* 3D Glare */}
          <motion.div
            style={{
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.12) 0%, transparent 55%)`
              ),
            }}
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[5]"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-400 z-[5]" />

          {/* Border on hover */}
          <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-gold/20 transition-colors duration-400 z-[6]" />

          {/* Discount badge */}
          <div className="absolute top-3 right-3 px-2.5 py-1 text-[10px] tracking-wider font-sans text-white bg-black/50 backdrop-blur-sm rounded-sm z-10">
            -{product.discount}%
          </div>

          {/* Quick view button — appears on hover */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 z-10" style={{ transform: 'translateZ(25px)' }}>
            <div className="py-3 bg-white/95 backdrop-blur-sm text-black text-[10px] tracking-[0.2em] uppercase font-sans text-center rounded-md font-medium">
              Quick View
            </div>
          </div>

          {/* Corner accents */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-transparent group-hover:border-gold/15 transition-colors duration-500 z-[6]" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-transparent group-hover:border-gold/15 transition-colors duration-500 z-[6]" />
        </div>

        {/* Product Info */}
        <p className="text-[9px] tracking-[0.25em] uppercase text-gold/70 font-sans mb-1">{product.brand}</p>
        <p className="text-sm text-theme group-hover:text-theme transition-colors line-clamp-1 font-medium">{product.title}</p>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-sm text-theme font-semibold">{product.priceDisplay}</span>
          <span className="text-[10px] text-theme-muted line-through">{product.originalPriceDisplay}</span>
        </div>
      </Link>

      {/* Lift shadow */}
      <motion.div
        animate={{ opacity: hovered ? 0.35 : 0, y: hovered ? 12 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute -bottom-3 left-4 right-4 h-10 bg-gold/15 blur-xl rounded-full -z-10"
      />
    </motion.div>
  );
}
