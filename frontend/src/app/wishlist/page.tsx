'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useWishlist, WishlistItem } from '@/components/WishlistProvider';
import { fixImageUrl } from '@/lib/api';

function WishlistCard({ item, onRemove }: { item: WishlistItem; onRemove: (id: string) => void }) {
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

  const formatPrice = (v: number) => v.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{ rotateX, rotateY, scale, transformOrigin: 'center center' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setHovered(false); mx.set(0); my.set(0); }}
      onMouseEnter={() => setHovered(true)}
      className="group relative"
    >
      <Link href={`/product/${item.id}`} className="block p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all">
        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-white/5 mb-4">
          <img src={fixImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(item.id); }}
            className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-500/20 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] tracking-wider text-white/40 uppercase mb-1">{item.brand}</p>
        <p className="text-sm text-white font-serif mb-2 line-clamp-2">{item.title || item.name}</p>
        <p className="text-sm text-[#c9a96e]">{formatPrice(item.price)}</p>
      </Link>
    </motion.div>
  );
}

export default function WishlistPage() {
  const { items, removeItem, itemCount } = useWishlist();

  if (itemCount === 0) {
    return (
      <>
        <Navbar />
        <main className="pt-28 pb-20 bg-midnight min-h-screen">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.11-4.314 2.714-.052.14-.15.224-.294.224h-.4c-.248 0-.409-.06-.523-.139-.15-.102-.263-.308-.39-.535-.127-.227-.24-.53-.38-.838-.14-.308-.293-.575-.459-.87A2.501 2.501 0 0112 4.5c-2.499 0-4.5 2.001-4.5 4.5 0 2.56 2.088 4.638 4.688 4.638 1.29 0 2.49-.522 3.325-1.366.19-.192.42-.304.69-.304h.4c.27 0 .5.09.69.268.19.18.338.392.507.667.17.274.34.545.529.812.19.268.41.493.672.673A4.526 4.526 0 0014.25 12c0 1.052-.36 2.026-.967 2.75-.607.724-1.46 1.247-2.448 1.247-.988 0-1.84-.523-2.448-1.247-.607-.724-.967-1.698-.967-2.75 0-2.485 2.099-4.5 4.688-4.5h.175c.425 0 .834-.064 1.217-.184.38-.12.734-.307 1.054-.55.32-.244.61-.538.867-.883.256-.345.522-.686.801-1.02z" />
                </svg>
              </div>
              <h2 className="text-xl text-pearl font-serif mb-2">Your wishlist is empty</h2>
              <p className="text-sm text-slate/40 mb-6">Save items you love by clicking the heart icon</p>
              <Link href="/" className="text-[#c9a96e] text-sm hover:underline">Continue Shopping</Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 bg-midnight min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-3xl font-serif text-pearl mb-2">Wishlist</h1>
            <p className="text-sm text-slate/40">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
          </motion.div>
          
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <WishlistCard key={item.id} item={item} onRemove={removeItem} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}