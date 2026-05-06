'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useWishlist } from './WishlistProvider';

interface SimpleCard3DProps {
  id: string;
  brand: string;
  title: string;
  price: string;
  originalPrice?: string;
  discount?: number;
  image: string;
  href?: string;
  className?: string;
}

export default function SimpleCard3D({
  id,
  brand,
  title,
  price,
  originalPrice,
  discount,
  image,
  href = '/',
  className = '',
}: SimpleCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(id);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { damping: 25, stiffness: 200, mass: 0.6 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), spring);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), spring);
  const scale = useSpring(isHovered ? 1.02 : 1, { damping: 20, stiffness: 300 });

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
    setIsHovered(false);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Heart clicked! id:', id, 'isWishlisted:', wishlisted);
    if (wishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist({ id, brand, title, price: parseInt(price.replace(/[^0-9]/g, '')) || 0, originalPrice: parseInt((originalPrice || '').replace(/[^0-9]/g, '')) || 0, image });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className={`group relative ${className}`}
    >
      <Link href={href} className="block">
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-charcoal mb-4">
          <div className="w-full h-full bg-cover bg-center transition-transform duration-600 ease-out group-hover:scale-110" style={{ backgroundImage: `url(${image})` }} />
          
          <motion.div
            style={{
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.12) 0%, transparent 55%)`
              ),
            }}
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[5]"
          />
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-400 z-[5]" />
          <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-gold/20 transition-colors duration-400 z-[6]" />
          
          {discount && discount > 0 && (
            <div className="absolute top-3 right-3 px-2.5 py-1 text-[10px] tracking-wider font-sans text-white bg-black/50 backdrop-blur-sm rounded-sm z-10">
              -{discount}%
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 z-10" style={{ transform: 'translateZ(25px)' }}>
            <div className="py-3 bg-white/95 backdrop-blur-sm text-black text-[10px] tracking-[0.2em] uppercase font-sans text-center rounded-md font-medium">
              Quick View
            </div>
          </div>

          <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-transparent group-hover:border-gold/15 transition-colors duration-500 z-[6]" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-transparent group-hover:border-gold/15 transition-colors duration-500 z-[6]" />
        </div>

        <p className="text-[9px] tracking-[0.25em] uppercase text-gold/70 font-sans mb-1">{brand}</p>
        <p className="text-sm text-theme font-sans leading-snug line-clamp-1">{title}</p>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-sm text-theme font-semibold">{price}</span>
          {originalPrice && (
            <span className="text-[10px] text-theme-muted line-through">{originalPrice}</span>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={handleWishlistClick}
        className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-colors hover:bg-black/60"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <svg className="w-4 h-4" fill={wishlisted ? '#c9a96e' : 'none'} viewBox="0 0 24 24" stroke={wishlisted ? '#c9a96e' : 'currentColor'} strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </button>

      <motion.div
        animate={{ opacity: isHovered ? 0.3 : 0, y: isHovered ? 10 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute -bottom-3 left-4 right-4 h-8 bg-gold/15 blur-xl rounded-full -z-10"
      />
    </motion.div>
  );
}