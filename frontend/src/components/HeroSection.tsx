'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  type: string;
  active: boolean;
  order: number;
}

const defaultBanner = {
  title: 'Redefine Your\nElegance',
  subtitle: 'Discover curated collections that embody timeless sophistication\nand modern luxury craftsmanship.',
  ctaText: 'Shop Now',
  ctaLink: '/search',
  tag: 'Autumn/Winter 2026',
  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&q=80',
};

export default function HeroSection() {
  const [banner, setBanner] = useState<typeof defaultBanner>(defaultBanner);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/banners?type=hero&active=true`);
        const data = await res.json();
        const banners: Banner[] = data.banners || [];
        
        if (banners.length > 0) {
          const activeBanner = banners.sort((a, b) => a.order - b.order)[0];
          setBanner({
            title: activeBanner.title || defaultBanner.title,
            subtitle: activeBanner.subtitle || defaultBanner.subtitle,
            ctaText: activeBanner.ctaText || defaultBanner.ctaText,
            ctaLink: activeBanner.ctaLink || defaultBanner.ctaLink,
            tag: activeBanner.type ? activeBanner.type.toUpperCase() : defaultBanner.tag,
            image: activeBanner.image || defaultBanner.image,
          });
        }
      } catch (err) {
        console.error('Failed to fetch banners:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        headingRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, delay: 0.5 }
      )
        .fromTo(
          subheadingRef.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          '-=0.8'
        )
        .fromTo(
          ctaRef.current,
          { y: 40, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8 },
          '-=0.6'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = 'translate(0, 0) scale(1)';
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-midnight"
    >
      {/* Parallax Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        {/* Fallback Image (base background) */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${banner.image})`,
          }}
        />

        {/* Video Background (overlay on top of image) */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video/video.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Gradient Overlays — always dark for text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/60 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30 z-10" />

      {/* Fade-in bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />

      {/* Content */}
      <motion.div
        style={{ opacity: textOpacity, scale: textScale }}
        className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center"
      >
        {/* Luxury Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-1.5 text-xs tracking-[0.3em] uppercase text-gold border border-gold/30 rounded-full font-sans">
            {banner.tag}
          </span>
        </motion.div>

        {/* Main Heading */}
        <h1
          ref={headingRef}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-medium text-white leading-[0.9] tracking-tight mb-6 opacity-0"
          style={{ textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}
        >
          {banner.title.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < banner.title.split('\n').length - 1 && <br />}
            </span>
          ))}
        </h1>

        {/* Subheading */}
        <p
          ref={subheadingRef}
          className="font-sans text-base sm:text-lg md:text-xl text-white/80 max-w-xl mb-10 tracking-wide opacity-0"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
        >
          {banner.subtitle}
        </p>

        {/* CTA Button */}
        <Link
          href={banner.ctaLink}
          ref={ctaRef as any}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative px-10 py-4 bg-transparent border border-gold/60 text-white font-sans text-sm tracking-[0.25em] uppercase overflow-hidden transition-all duration-500 hover:border-gold opacity-0"
        >
          {/* Button Background Fill */}
          <span className="absolute inset-0 bg-gold/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-luxury" />
          
          {/* Shimmer Effect */}
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </span>

          {/* Button Text */}
          <span className="relative z-10 flex items-center gap-3">
            {banner.ctaText}
            <svg
              className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-500"
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
        </Link>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
      >
        <span className="text-xs tracking-[0.3em] uppercase text-white/60 font-sans">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent relative overflow-hidden">
          <motion.div
            animate={{ y: [0, 48, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-0 left-0 w-full h-3 bg-gold rounded-full"
          />
        </div>
      </motion.div>

      {/* Decorative Corner Elements */}
      <div className="absolute top-8 left-8 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="w-16 h-16 border-l border-t border-gold/20"
        />
      </div>
      <div className="absolute top-8 right-8 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="w-16 h-16 border-r border-t border-gold/20"
        />
      </div>
      <div className="absolute bottom-24 left-8 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="w-16 h-16 border-l border-b border-gold/20"
        />
      </div>
      <div className="absolute bottom-24 right-8 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="w-16 h-16 border-r border-b border-gold/20"
        />
      </div>
    </section>
  );
}
