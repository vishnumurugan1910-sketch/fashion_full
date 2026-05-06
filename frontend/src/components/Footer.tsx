'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

const footerLinks = {
  Shop: [
    { label: 'New Arrivals', href: '/search' },
    { label: 'Women', href: '/category/women' },
    { label: 'Men', href: '/category/men' },
    { label: 'Accessories', href: '/category/accessories' },
    { label: 'Footwear', href: '/category/footwear' },
    { label: 'Sale', href: '/search?sale=true' },
  ],
  About: [
    { label: 'Our Story', href: '/our-story' },
    { label: 'Craftsmanship', href: '/stories' },
    { label: 'Sustainability', href: '/our-story' },
    { label: 'Careers', href: '/our-story' },
    { label: 'Press', href: '/stories' },
  ],
  Help: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Track Order', href: '/track-order' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Settings', href: '/privacy' },
  ],
};

const socialLinks = [
  { label: 'Instagram', href: '#' },
  { label: 'Pinterest', href: '#' },
  { label: 'Twitter', href: '#' },
  { label: 'Facebook', href: '#' },
];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <footer ref={ref} className="relative bg-theme-secondary border-t border-theme">
      {/* CTA Band */}
      <div className="border-b border-theme">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
          >
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-theme tracking-tight">
                Stay <span className="italic text-gold">Inspired</span>
              </h2>
              <p className="text-sm text-theme-tertiary mt-2 max-w-sm">
                Subscribe for exclusive early access to new collections, private events, and curated stories.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full sm:w-72 px-5 py-3.5 bg-theme-input border border-theme-gold text-theme text-sm font-sans placeholder:text-theme-muted rounded-sm focus:outline-none focus:border-gold/40 transition-colors"
              />
              <button className="px-8 py-3.5 bg-theme-button border border-theme-gold text-theme text-xs tracking-[0.2em] uppercase font-sans hover:bg-theme-button hover:border-gold/60 transition-all rounded-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="col-span-2 md:col-span-2"
          >
            <Link href="/" className="font-serif text-2xl tracking-[0.15em] text-theme inline-block mb-5">
              ÉLÉVATION
            </Link>
            <p className="text-sm text-theme-tertiary leading-relaxed max-w-xs mb-6">
              Redefining luxury fashion through craftsmanship, sustainability, and timeless design.
            </p>
            {/* Social */}
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-[10px] tracking-[0.2em] uppercase text-theme-tertiary hover:text-gold transition-colors duration-300 font-sans"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links], colIdx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + colIdx * 0.08, duration: 0.6 }}
            >
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold/50 font-sans mb-5">{title}</p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-theme-tertiary hover:text-theme transition-colors duration-300 font-sans"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-theme">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase text-theme-muted font-sans">
              © 2026 ÉLÉVATION. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {[
                { label: 'Privacy Policy', href: '/privacy' }, 
                { label: 'Terms of Service', href: '/terms' }, 
                { label: 'Cookie Settings', href: '/privacy' }
              ].map((link) => (
                <a key={link.label} href={link.href} className="text-[10px] tracking-wider uppercase text-theme-muted hover:text-theme-tertiary transition-colors font-sans">
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
