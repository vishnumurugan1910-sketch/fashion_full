'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Category {
  id: string;
  title: string;
  subtitle: string;
  count: string;
  image: string;
  accent: string;
}

const categories: Category[] = [
  {
    id: 'women',
    title: 'Women',
    subtitle: 'Elegance Redefined',
    count: '2,400+ Styles',
    image:
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1200&q=85',
    accent: '#c9a96e',
  },
  {
    id: 'men',
    title: 'Men',
    subtitle: 'Modern Sophistication',
    count: '1,800+ Styles',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85',
    accent: '#8a8a8a',
  },
  {
    id: 'kids',
    title: 'Kids',
    subtitle: 'Playful Luxury',
    count: '950+ Styles',
    image:
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=1200&q=85',
    accent: '#dfc08a',
  },
  {
    id: 'accessories',
    title: 'Accessories',
    subtitle: 'Statement Pieces',
    count: '3,200+ Items',
    image:
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1200&q=85',
    accent: '#c9a96e',
  },
  {
    id: 'footwear',
    title: 'Footwear',
    subtitle: 'Step Into Style',
    count: '1,100+ Pairs',
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1200&q=85',
    accent: '#e8dfd5',
  },
];

function CategoryCard({ category, index }: { category: Category; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-150, 150], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="group relative flex-shrink-0 w-[75vw] sm:w-[55vw] md:w-[42vw] lg:w-[32vw] xl:w-[28vw] h-[70vh] md:h-[75vh] cursor-pointer snap-center"
    >
      <Link href={`/category/${category.id}`} className="block w-full h-full">
      {/* Card Container */}
      <div className="relative w-full h-full overflow-hidden rounded-sm bg-charcoal">
        {/* Image */}
        <motion.div
          animate={{
            scale: isHovered ? 1.08 : 1,
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700"
            style={{ backgroundImage: `url(${category.image})` }}
          />
        </motion.div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/20 to-transparent opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight/50 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-700" />

        {/* Border on hover */}
        <div className="absolute inset-0 border border-transparent group-hover:border-gold/20 transition-colors duration-700 rounded-sm" />

        {/* Content - Always visible base */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          {/* Category Number */}
          <span className="absolute top-6 left-6 md:top-8 md:left-8 text-[10px] tracking-[0.3em] text-slate/50 font-sans">
            0{index + 1}
          </span>

          {/* Bottom Content */}
          <div className="relative z-10">
            {/* Accent Line */}
            <motion.div
              animate={{ width: isHovered ? 48 : 24 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-px mb-4"
              style={{ backgroundColor: category.accent }}
            />

            {/* Title */}
            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl text-pearl mb-1 tracking-tight">
              {category.title}
            </h3>

            {/* Subtitle - appears on hover */}
            <motion.p
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 10,
              }}
              transition={{ duration: 0.4, delay: isHovered ? 0.1 : 0 }}
              className="text-sm tracking-[0.15em] uppercase font-sans mb-3"
              style={{ color: category.accent }}
            >
              {category.subtitle}
            </motion.p>

            {/* Count + Arrow */}
            <div className="flex items-center justify-between">
              <motion.span
                animate={{
                  opacity: isHovered ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
                className="text-xs text-slate font-sans tracking-wider"
              >
                {category.count}
              </motion.span>

              {/* Arrow */}
              <motion.div
                animate={{
                  opacity: isHovered ? 1 : 0,
                  x: isHovered ? 0 : -10,
                }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="flex items-center gap-2"
              >
                <span
                  className="text-xs tracking-[0.2em] uppercase font-sans"
                  style={{ color: category.accent }}
                >
                  Explore
                </span>
                <svg
                  className="w-4 h-4"
                  style={{ color: category.accent }}
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
              </motion.div>
            </div>
          </div>

          {/* Decorative Corner (hover) */}
          <motion.div
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.5,
            }}
            transition={{ duration: 0.5 }}
            className="absolute top-6 right-6 md:top-8 md:right-8"
          >
            <div className="w-8 h-8 border-t border-r" style={{ borderColor: `${category.accent}40` }} />
          </motion.div>
        </div>
      </div>

      {/* Lift shadow on hover */}
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 12 : 0,
        }}
        transition={{ duration: 0.5 }}
        className="absolute -bottom-3 left-4 right-4 h-12 bg-gold/5 blur-xl rounded-full -z-10"
      />
      </Link>
    </motion.div>
  );
}

export default function HorizontalScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Drag-to-scroll state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const checkScrollability = () => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollLeft(track.scrollLeft > 10);
    setCanScrollRight(track.scrollLeft < track.scrollWidth - track.clientWidth - 10);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener('scroll', checkScrollability);
    checkScrollability();
    return () => track.removeEventListener('scroll', checkScrollability);
  }, []);

  // Mouse drag scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = true;
    startX.current = e.pageX - track.offsetLeft;
    scrollLeft.current = track.scrollLeft;
    track.style.cursor = 'grabbing';
    track.style.scrollSnapType = 'none';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const track = trackRef.current;
    if (!track) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    track.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = false;
    track.style.cursor = 'grab';
    track.style.scrollSnapType = 'x mandatory';
  };

  // Scroll buttons
  const scrollBy = (direction: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.querySelector('div')?.clientWidth || 400;
    const scrollAmount = cardWidth * 0.8;
    track.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-midnight overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-12 md:mb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          {/* Left: Title Block */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="w-12 h-px bg-gold/50" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-sans">
                Curated For You
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-pearl tracking-tight leading-[1.05]">
              Shop by<br />
              <span className="italic text-gold">Category</span>
            </h2>
          </div>

          {/* Right: Nav Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollBy('left')}
              disabled={!canScrollLeft}
              className="w-12 h-12 border border-gold/20 rounded-full flex items-center justify-center text-pearl/60 hover:text-gold hover:border-gold/50 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
              </svg>
            </button>
            <button
              onClick={() => scrollBy('right')}
              disabled={!canScrollRight}
              className="w-12 h-12 border border-gold/20 rounded-full flex items-center justify-center text-pearl/60 hover:text-gold hover:border-gold/50 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div className="relative">
        {/* Edge Fade Left */}
        <div className={`pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-midnight to-transparent z-10 transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />

        {/* Scrollable Container */}
        <div
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="flex gap-5 md:gap-6 overflow-x-auto px-6 lg:px-12 pb-6 snap-x snap-mandatory cursor-grab select-none scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Leading spacer */}
          <div className="flex-shrink-0 w-[2vw]" />

          {categories.map((category, i) => (
            <CategoryCard key={category.id} category={category} index={i} />
          ))}

          {/* Trailing spacer */}
          <div className="flex-shrink-0 w-[4vw]" />
        </div>

        {/* Edge Fade Right */}
        <div className={`pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-midnight to-transparent z-10 transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Scroll Progress Indicator */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-8">
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-[0.3em] uppercase text-slate/40 font-sans">
            Drag to explore
          </span>
          <div className="flex-1 h-px bg-graphite/50 relative">
            <motion.div
              className="h-full bg-gold/40"
              style={{ width: canScrollRight ? '30%' : '100%' }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-slate/40 font-sans">
            {categories.length} Categories
          </span>
        </div>
      </div>
    </section>
  );
}
