'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useCart } from './CartProvider';
import { useWishlist } from './WishlistProvider';

export interface Product {
  id: string;
  brand: string;
  name?: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  imageFront: string;
  imageBack: string;
  image?: string;
  images360?: string[];
  tag?: string;
}

interface ProductCardProps {
  product: Product;
  index: number;
  onView3D?: (product: Product) => void;
}

export default function ProductCard({ product, index, onView3D }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  // 3D tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { damping: 25, stiffness: 200, mass: 0.6 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), spring);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), spring);
  const scale = useSpring(isHovered ? 1.02 : 1, { damping: 20, stiffness: 300 });

  const glareX = useSpring(useTransform(mx, [-0.5, 0.5], [0, 100]), spring);
  const glareY = useSpring(useTransform(my, [-0.5, 0.5], [0, 100]), spring);

  const formatPrice = (value: number) =>
    value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

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

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.7,
        delay: (index % 4) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
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
      className="group relative"
    >
      {/* Clickable Card Area */}
      <div onClick={() => router.push(`/product/${product.id}`)} className="cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-charcoal mb-4">
          {/* Front Image */}
          <motion.div
            animate={{
              scale: isHovered ? 1.06 : 1,
              opacity: isHovered ? 0 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${product.imageFront})` }} />
          </motion.div>

          {/* Back Image */}
          <motion.div
            animate={{
              scale: isHovered ? 1 : 1.06,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${product.imageBack})` }} />
          </motion.div>
          <motion.div
            style={{
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.12) 0%, transparent 60%)`
              ),
            }}
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[5]"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black transition-all duration-400 z-[5]" style={{ opacity: 0 }} />

          {/* Border on hover */}
          <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-gold/20 transition-colors duration-400 z-[6]" />

          {/* Tag Badge */}
          {product.tag && (
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2.5 py-1 text-[10px] tracking-[0.15em] uppercase font-sans bg-gold/90 text-midnight rounded-sm">
                {product.tag}
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { 
              e.stopPropagation(); 
              if (wishlisted) {
                removeFromWishlist(product.id);
              } else {
                addToWishlist({ id: product.id, brand: product.brand, title: product.title || product.name || '', price: product.price, originalPrice: product.originalPrice || product.price, image: product.image || product.imageFront });
              }
            }}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-colors duration-300 hover:bg-black/60"
          >
            <motion.svg
              animate={{ scale: wishlisted ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill={wishlisted ? '#c9a96e' : 'none'}
              stroke={wishlisted ? '#c9a96e' : 'currentColor'}
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </motion.svg>
          </motion.button>

          {/* Quick View + 3D Buttons */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-4 left-4 right-4 z-10 flex gap-2"
                style={{ transform: 'translateZ(30px)' }}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); router.push(`/product/${product.id}`); }}
                  className="flex-1 py-3 bg-white/95 backdrop-blur-sm text-black text-[10px] sm:text-xs tracking-[0.15em] uppercase font-sans font-medium rounded-md flex items-center justify-center gap-1.5 hover:bg-white transition-colors duration-300"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  Quick View
                </button>

                {/* Add to Cart */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const uniqueId = `${product.id}-M-Default`.toLowerCase();
                    addItem({
                      id: uniqueId,
                      productId: product.id,
                      brand: product.brand,
                      title: product.title,
                      price: product.price,
                      originalPrice: product.originalPrice,
                      size: 'M',
                      color: 'Default',
                      image: product.imageFront,
                    });
                    setAddedToCart(true);
                    setTimeout(() => setAddedToCart(false), 1500);
                  }}
                  className={`flex-1 py-3 backdrop-blur-sm text-[10px] sm:text-xs tracking-[0.15em] uppercase font-sans font-medium rounded-md flex items-center justify-center gap-1.5 transition-all duration-300 ${
                    addedToCart
                      ? 'bg-emerald-500/90 text-white'
                      : 'bg-gold/90 text-black hover:bg-gold'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Added
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
                      </svg>
                      Add to Bag
                    </>
                  )}
                </button>

                {product.images360 && onView3D && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onView3D(product); }}
                    className="flex-1 py-3 bg-black/80 backdrop-blur-sm border border-gold/30 text-white text-[10px] sm:text-xs tracking-[0.15em] uppercase font-sans font-medium rounded-md flex items-center justify-center gap-1.5 hover:bg-gold/20 hover:border-gold/60 transition-all duration-300"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                    </svg>
                    <span className="hidden sm:inline">View in 3D</span>
                    <span className="sm:hidden">3D</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="absolute bottom-3 right-3 z-10">
              <span className="px-2 py-0.5 text-[10px] tracking-wider font-sans text-white bg-black/50 backdrop-blur-sm rounded-sm">
                -{product.discount}%
              </span>
            </div>
          )}

          {/* Corner accents */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-transparent group-hover:border-gold/15 transition-colors duration-500 z-[6]" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-transparent group-hover:border-gold/15 transition-colors duration-500 z-[6]" />
        </div>

        {/* Product Info */}
        <div className="px-1">
          <p className="text-[10px] tracking-[0.25em] uppercase text-gold/80 font-sans mb-1">
            {product.brand}
          </p>
          <h3 className="text-sm text-theme font-sans leading-snug mb-2 line-clamp-2 transition-colors duration-300">
            {product.title}
          </h3>
          <div className="flex items-baseline gap-2.5">
            <span className="text-sm font-sans font-semibold text-theme">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xs text-theme-muted line-through font-sans">{formatPrice(product.originalPrice)}</span>
                <span className="text-[10px] text-gold font-sans tracking-wider">{product.discount}% OFF</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Lift Shadow */}
      <motion.div
        animate={{ opacity: isHovered ? 0.35 : 0, y: isHovered ? 12 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute -bottom-3 left-4 right-4 h-10 bg-gold/15 blur-xl rounded-full -z-10"
      />
    </motion.div>
  );
}
