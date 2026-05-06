'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const heading = headingRef.current;
    const sub = subRef.current;
    const cta = ctaRef.current;
    const divider = dividerRef.current;
    const stats = statsRef.current;

    if (!section || !bg) return;

    const ctx = gsap.context(() => {
      // Background parallax — moves slower than scroll
      gsap.to(bg, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      // Content elements — slide in on scroll
      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'top 20%',
          scrub: 1,
        },
      });

      if (heading) {
        contentTl.fromTo(
          heading,
          { y: 80, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, ease: 'power3.out' },
          0
        );
      }

      if (divider) {
        contentTl.fromTo(
          divider,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, ease: 'power2.out' },
          0.2
        );
      }

      if (sub) {
        contentTl.fromTo(
          sub,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power3.out' },
          0.3
        );
      }

      if (cta) {
        contentTl.fromTo(
          cta,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power3.out' },
          0.45
        );
      }

      if (stats) {
        contentTl.fromTo(
          stats,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power3.out' },
          0.55
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const statItems = [
    { value: '250+', label: 'Global Designers' },
    { value: '12K', label: 'Curated Pieces' },
    { value: '98%', label: 'Client Satisfaction' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[120vh] flex items-center justify-center overflow-hidden"
    >
      {/* Fixed Parallax Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-[140%] -top-[20%] will-change-transform"
      >
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=85)',
          }}
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-midnight/75 z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-transparent to-midnight z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-midnight/60 via-transparent to-midnight/40 z-10" />

      {/* Grain Texture */}
      <div
        className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-20 max-w-4xl mx-auto px-6 text-center"
      >
        {/* Top Accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <span className="w-8 h-px bg-gold/40" />
          <span className="w-1.5 h-1.5 bg-gold/60 rotate-45" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-gold/80 font-sans">
            The Atelier
          </span>
          <span className="w-1.5 h-1.5 bg-gold/60 rotate-45" />
          <span className="w-8 h-px bg-gold/40" />
        </motion.div>

        {/* Heading */}
        <h2
          ref={headingRef}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-pearl leading-[0.9] tracking-tight mb-6 opacity-0"
        >
          Where Craft
          <br />
          Meets <span className="italic text-gold">Vision</span>
        </h2>

        {/* Decorative Divider */}
        <div
          ref={dividerRef}
          className="w-16 h-px bg-gold/50 mx-auto mb-8 origin-center opacity-0"
        />

        {/* Subtext */}
        <p
          ref={subRef}
          className="font-sans text-base sm:text-lg md:text-xl text-champagne/70 max-w-2xl mx-auto leading-relaxed mb-10 opacity-0"
        >
          Every garment in our collection is a dialogue between tradition and
          innovation — hand-finished details meet modern silhouettes, creating
          pieces that stand apart from the ephemeral.
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="opacity-0">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-4 px-12 py-5 bg-gold/10 border border-gold/40 text-pearl overflow-hidden transition-all duration-600 hover:border-gold hover:bg-gold/15"
          >
            {/* Shimmer */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </span>

            <span className="relative z-10 text-xs tracking-[0.25em] uppercase font-sans">
              Explore the Collection
            </span>
            <svg
              className="relative z-10 w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-500"
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
          </motion.button>
        </div>

        {/* Stats Row */}
        <div
          ref={statsRef}
          className="mt-16 pt-10 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 opacity-0"
        >
          {statItems.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 + i * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <span className="block font-serif text-3xl md:text-4xl text-gold mb-1">
                {stat.value}
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-slate font-sans">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-8 left-8 z-20">
        <div className="w-16 h-16 border-l border-t border-gold/15" />
      </div>
      <div className="absolute top-8 right-8 z-20">
        <div className="w-16 h-16 border-r border-t border-gold/15" />
      </div>
      <div className="absolute bottom-8 left-8 z-20">
        <div className="w-16 h-16 border-l border-b border-gold/15" />
      </div>
      <div className="absolute bottom-8 right-8 z-20">
        <div className="w-16 h-16 border-r border-b border-gold/15" />
      </div>

      {/* Side Vertical Text */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
        <span className="text-[9px] tracking-[0.5em] uppercase text-slate/30 font-sans [writing-mode:vertical-rl]">
          Established MMXXIV
        </span>
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
        <span className="text-[9px] tracking-[0.5em] uppercase text-slate/30 font-sans [writing-mode:vertical-lr]">
          Crafted With Purpose
        </span>
      </div>
    </section>
  );
}
