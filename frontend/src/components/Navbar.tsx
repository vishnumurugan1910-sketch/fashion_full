'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartProvider';
import { useWishlist } from './WishlistProvider';

/* ─── Mega Menu Data ─── */
interface MegaMenuItem {
  title: string;
  links: { label: string; href: string; tag?: string }[];
  featured?: { label: string; image: string; href: string };
}

const megaMenuData: Record<string, MegaMenuItem> = {
  Collections: {
    title: 'Collections',
    links: [
      { label: 'Autumn/Winter 2026', href: '/category/women', tag: 'New' },
      { label: 'Spring/Summer 2026', href: '/category/women' },
      { label: 'Resort Collection', href: '/category/women' },
      { label: 'Pre-Fall', href: '/category/women' },
      { label: 'Haute Couture', href: '/category/women' },
      { label: 'Capsule Editions', href: '/category/women' },
    ],
    featured: {
      label: 'AW26 — Now Live',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
      href: '/category/women',
    },
  },
  Women: {
    title: 'Women',
    links: [
      { label: 'Dresses', href: '/category/women' },
      { label: 'Tops & Blouses', href: '/category/women' },
      { label: 'Outerwear', href: '/category/women' },
      { label: 'Knitwear', href: '/category/women' },
      { label: 'Skirts & Trousers', href: '/category/women' },
      { label: 'Evening Wear', href: '/category/women', tag: 'Trending' },
    ],
    featured: {
      label: 'The Evening Edit',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80',
      href: '/category/women',
    },
  },
  Men: {
    title: 'Men',
    links: [
      { label: 'Suits & Blazers', href: '/category/men' },
      { label: 'Shirts', href: '/category/men' },
      { label: 'Outerwear', href: '/category/men', tag: 'New' },
      { label: 'Knitwear', href: '/category/men' },
      { label: 'Trousers', href: '/category/men' },
      { label: 'Accessories', href: '/category/accessories' },
    ],
    featured: {
      label: 'Tailored Essentials',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
      href: '/category/men',
    },
  },
  Designers: {
    title: 'Designers',
    links: [
      { label: 'Valentino', href: '/category/women' },
      { label: 'Gucci', href: '/category/women' },
      { label: 'Prada', href: '/category/women' },
      { label: 'Dior', href: '/category/women' },
      { label: 'Balenciaga', href: '/category/men' },
      { label: 'Burberry', href: '/category/accessories' },
    ],
    featured: {
      label: 'Designer Spotlight',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
      href: '/category/women',
    },
  },
};

const navLinks = Object.keys(megaMenuData);

// Map nav link names to their destination pages
const navLinkRoutes: Record<string, string> = {
  Collections: '/search',
  Women: '/category/women',
  Men: '/category/men',
  Designers: '/designers',
};

/* ─── Navbar ─── */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const lastScroll = useRef(0);
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      if (y > 300) {
        setHidden(y > lastScroll.current && y - lastScroll.current > 10);
      } else {
        setHidden(false);
      }
      lastScroll.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMegaEnter = (label: string) => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setActiveMega(label);
  };

  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setActiveMega(null), 200);
  };

  useEffect(() => {
    document.body.style.overflow = searchOpen || menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [searchOpen, menuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-theme/95 backdrop-blur-2xl border-b border-theme-gold'
            : 'bg-gradient-to-b from-black/50 to-transparent'
        }`}
      >
        {/* Announcement bar */}
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="hidden md:block overflow-hidden border-b border-gold/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-1.5 flex items-center justify-center gap-3">
            <span className="w-6 h-px bg-gold/30" />
            <span className="text-[8px] tracking-[0.4em] uppercase text-gold/60 font-sans">Complimentary shipping on orders above ₹15,000</span>
            <span className="w-6 h-px bg-gold/30" />
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-[56px]">
            {/* Logo */}
            <Link href="/" className={`font-serif text-lg md:text-xl tracking-[0.15em] relative transition-colors duration-300 ${scrolled ? 'text-theme' : 'text-white'}`} data-cursor="link">
              ÉLÉVATION
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link, i) => (
                <div key={link} className="relative" onMouseEnter={() => handleMegaEnter(link)} onMouseLeave={handleMegaLeave}>
                  <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * i + 0.3 }}
                  >
                    <Link
                      href={navLinkRoutes[link] || '/search'}
                      className={`relative px-4 py-5 text-[10px] tracking-[0.2em] uppercase font-sans transition-colors duration-300 block ${
                        activeMega === link ? 'text-gold' : scrolled ? 'text-theme-secondary hover:text-theme' : 'text-white/70 hover:text-white'
                      }`}
                      data-cursor="link"
                    >
                      {link}
                      <motion.span animate={{ scaleX: activeMega === link ? 1 : 0, opacity: activeMega === link ? 1 : 0 }} className="absolute bottom-3 left-1/2 -translate-x-1/2 w-4 h-px bg-gold origin-center" transition={{ duration: 0.3 }} />
                    </Link>
                  </motion.div>
                </div>
              ))}
              <Link href="/stories" className={`relative px-4 py-5 text-[10px] tracking-[0.2em] uppercase font-sans transition-colors duration-300 group ${scrolled ? 'text-theme-secondary hover:text-theme' : 'text-white/70 hover:text-white'}`} data-cursor="link">
                Stories
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 w-0 group-hover:w-4 h-px bg-gold transition-all duration-300" />
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-0.5 md:gap-1">
              <Link href="/search" className={`relative w-9 h-9 flex items-center justify-center transition-colors ${scrolled ? 'text-theme-secondary hover:text-theme' : 'text-white/70 hover:text-white'}`} aria-label="Search" data-cursor="link">
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </Link>

              <Link href="/wishlist" className={`relative w-9 h-9 flex items-center justify-center transition-colors ${scrolled ? 'text-theme-secondary hover:text-theme' : 'text-white/70 hover:text-white'}`} aria-label="Wishlist" data-cursor="link">
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                <motion.span initial={{ scale: 0 }} animate={{ scale: wishlistCount > 0 ? 1 : 0 }} className="absolute top-1 right-1 w-[14px] h-[14px] bg-gold text-midnight text-[8px] font-semibold rounded-full flex items-center justify-center">{wishlistCount}</motion.span>
              </Link>

              <Link href="/cart" className={`relative w-9 h-9 flex items-center justify-center transition-colors ${scrolled ? 'text-theme-secondary hover:text-theme' : 'text-white/70 hover:text-white'}`} aria-label="Cart" data-cursor="link">
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <motion.span initial={{ scale: 0 }} animate={{ scale: itemCount > 0 ? 1 : 0 }} className="absolute top-1 right-1 w-[14px] h-[14px] bg-gold text-midnight text-[8px] font-semibold rounded-full flex items-center justify-center">{itemCount}</motion.span>
              </Link>

              <Link href="/profile" className={`relative w-9 h-9 hidden md:flex items-center justify-center transition-colors ${scrolled ? 'text-theme-secondary hover:text-theme' : 'text-white/70 hover:text-white'}`} aria-label="Account" data-cursor="link">
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </Link>



              {/* Mobile toggle */}
              <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden flex flex-col gap-[5px] p-2 -mr-2" data-cursor="link">
                <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }} className="block h-px w-5 bg-pearl origin-center" transition={{ duration: 0.3 }} />
                <motion.span animate={{ opacity: menuOpen ? 0 : 1, width: menuOpen ? '100%' : '75%' }} className="block h-px bg-pearl" transition={{ duration: 0.3 }} />
                <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }} className="block h-px w-5 bg-pearl origin-center" transition={{ duration: 0.3 }} />
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu */}
        <AnimatePresence mode="wait">
          {activeMega && megaMenuData[activeMega] && (
            <motion.div key={activeMega} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} onMouseEnter={() => handleMegaEnter(activeMega)} onMouseLeave={handleMegaLeave} className="absolute top-full left-0 right-0 bg-theme/95 backdrop-blur-2xl border-b border-theme-gold overflow-hidden">
              <MegaMenuContent data={megaMenuData[activeMega]} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mega overlay */}
      <AnimatePresence>
        {activeMega && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-40 bg-theme-overlay backdrop-blur-sm hidden lg:block" onMouseEnter={() => setActiveMega(null)} />
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-theme/98 backdrop-blur-2xl lg:hidden">
            <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6 w-10 h-10 border border-gold/15 rounded-full flex items-center justify-center text-slate hover:text-pearl transition-all" data-cursor="link">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex flex-col items-center justify-center h-full gap-6">
              {navLinks.map((link, i) => (
                <motion.div key={link} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i + 0.1 }}>
                  <Link
                    href={navLinkRoutes[link] || '/search'}
                    onClick={() => setMenuOpen(false)}
                    className="font-serif text-3xl text-pearl hover:text-gold transition-colors"
                    data-cursor="link"
                  >
                    {link}
                  </Link>
                </motion.div>
              ))}
              <Link href="/stories" onClick={() => setMenuOpen(false)} className="font-serif text-3xl text-pearl hover:text-gold transition-colors" data-cursor="link">Stories</Link>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-6 mt-8 pt-8 border-t border-gold/10">
                <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="text-xs tracking-[0.2em] uppercase text-slate font-sans hover:text-gold transition-colors" data-cursor="link">Wishlist</Link>
                <span className="w-px h-4 bg-gold/15" />
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="text-xs tracking-[0.2em] uppercase text-slate font-sans hover:text-gold transition-colors" data-cursor="link">Account</Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Mega Menu Content ─── */
function MegaMenuContent({ data }: { data: MegaMenuItem }) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-4">
          <p className="text-[9px] tracking-[0.4em] uppercase text-gold/50 font-sans mb-5">{data.title}</p>
          <div className="grid grid-cols-1 gap-1">
            {data.links.map((link, i) => (
              <motion.div key={link.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04, duration: 0.3 }}>
                <Link href={link.href} className="group flex items-center gap-3 py-2.5 text-sm text-champagne/60 hover:text-pearl transition-colors duration-300 font-sans" data-cursor="link">
                  <span className="w-0 group-hover:w-3 h-px bg-gold transition-all duration-300" />
                  <span>{link.label}</span>
                  {link.tag && <span className="text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full border border-gold/30 text-gold/70">{link.tag}</span>}
                </Link>
              </motion.div>
            ))}
          </div>
          <Link href={data.featured?.href || '/search'} className="inline-flex items-center gap-2 mt-6 text-[10px] tracking-[0.25em] uppercase text-gold/70 hover:text-gold transition-colors font-sans" data-cursor="link">
            View All
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
          </Link>
        </div>
        {data.featured && (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.5 }} className="col-span-12 md:col-span-5 relative aspect-[4/3] md:aspect-auto md:h-[320px] overflow-hidden rounded-sm group">
            <Link href={data.featured.href}>
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${data.featured.image})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-midnight/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[9px] tracking-[0.3em] uppercase text-gold/60 font-sans mb-1">Featured</p>
                <p className="font-serif text-xl text-pearl">{data.featured.label}</p>
              </div>
            </Link>
          </motion.div>
        )}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-6">
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-gold/50 font-sans mb-3">Trending Now</p>
            <div className="space-y-3">
              {['Silk Dresses', 'Cashmere Knits', 'Leather Goods'].map((item) => (
                <Link key={item} href="/search" className="block text-sm text-champagne/50 hover:text-pearl transition-colors font-sans" data-cursor="link">{item}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Search Overlay ─── */
function SearchOverlay({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 300); }, []);
  const trendingSearches = ['Silk Evening Gown', 'Cashmere Overcoat', 'Designer Handbags', 'AW26 Collection'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-midnight/98 backdrop-blur-2xl flex items-start justify-center pt-[15vh]">
      <div className="w-full max-w-2xl px-6">
        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 border border-gold/15 rounded-full flex items-center justify-center text-slate hover:text-pearl hover:border-gold/40 transition-all" data-cursor="link">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="relative mb-10">
          <div className="flex items-center border-b border-gold/20 pb-4">
            <svg className="w-5 h-5 text-gold/40 mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            <input ref={inputRef} type="text" placeholder="Search collections, designers, styles..." className="flex-1 bg-transparent text-2xl md:text-3xl font-serif text-pearl placeholder:text-slate/30 outline-none" />
          </div>
        </div>
        <div>
          <p className="text-[9px] tracking-[0.4em] uppercase text-gold/50 font-sans mb-4">Trending Searches</p>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((term, i) => (
              <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} onClick={onClose} className="px-4 py-2.5 border border-gold/15 text-sm text-champagne/60 hover:text-pearl hover:border-gold/30 rounded-sm transition-all font-sans" data-cursor="link">
                {term}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
