'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';

interface Card3DProps {
  title?: unknown;  // Changed to unknown to accept any type
  subtitle?: unknown;
  count?: unknown;
  image?: unknown;
  href?: string;
  className?: string;
}

function safeString(val: unknown): string {
  if (typeof val === 'string') return val;
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') {
    // Handle objects like {_id, name, image}
    const obj = val as Record<string, unknown>;
    // Try to get a meaningful string
    if (obj.name) return String(obj.name);
    if (obj._id) return String(obj._id);
    return JSON.stringify(val);
  }
  return String(val);
}

export default function Card3D({
  title,
  subtitle,
  count,
  image,
  href = '',
  className = '',
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.8 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), springConfig);

  const glareX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), springConfig);

  const scale = useSpring(isHovered ? 1.03 : 1, { damping: 20, stiffness: 300 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);

    x.set(percentX);
    y.set(percentY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  // Safely convert all props to strings
  const titleStr = safeString(title);
  const subtitleStr = safeString(subtitle);
  const countStr = safeString(count);
  const imageStr = safeString(image);

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
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
      }}
      className={`group relative cursor-pointer ${className}`}
    >
      <Link href={String(href)} className="block w-full h-full">
        {/* Card Container */}
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-charcoal">
          {/* Background Image with Zoom */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
            style={{ backgroundImage: `url(${imageStr})`, transformStyle: 'preserve-3d' }}
          />

          {/* 3D Glare Effect */}
          <motion.div
            style={{
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
              ),
            }}
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          />

          {/* Base Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 z-10" />

          {/* Border on Hover */}
          <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-gold/30 transition-colors duration-500 z-20" />

          {/* Bottom Content — always visible */}
          <div className="absolute bottom-0 left-0 right-0 p-7 z-20" style={{ transform: 'translateZ(40px)' }}>
            <div className="w-8 h-px bg-gold/60 mb-4 group-hover:w-14 transition-all duration-500" />
            <h3 className="font-serif text-3xl sm:text-4xl text-white mb-1 group-hover:text-gold transition-colors duration-300">
              {titleStr}
            </h3>
            <p className="text-xs text-white/60 tracking-[0.15em] uppercase font-sans group-hover:text-gold/80 transition-colors duration-300">
              {subtitleStr}
            </p>
          </div>

          {/* Center Overlay — appears on hover */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0" style={{ transform: 'translateZ(60px)' }}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-sans mb-3">
              {countStr}
            </p>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
              <span className="text-sm tracking-[0.2em] uppercase text-white font-sans">Explore</span>
              <svg className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </div>
          </div>

          {/* Corner Accents */}
          <div className="absolute top-5 left-5 w-8 h-8 border-t border-l border-transparent group-hover:border-gold/20 transition-colors duration-500 z-20" />
          <div className="absolute top-5 right-5 w-8 h-8 border-t border-r border-transparent group-hover:border-gold/20 transition-colors duration-500 z-20" />
          <div className="absolute bottom-5 left-5 w-8 h-8 border-b border-l border-transparent group-hover:border-gold/20 transition-colors duration-500 z-20" />
          <div className="absolute bottom-5 right-5 w-8 h-8 border-b border-r border-transparent group-hover:border-gold/20 transition-colors duration-500 z-20" />
        </div>

        {/* Lift Shadow */}
        <motion.div
          animate={{
            opacity: isHovered ? 0.4 : 0,
            y: isHovered ? 15 : 0,
          }}
          transition={{ duration: 0.4 }}
          className="absolute -bottom-4 left-6 right-6 h-12 bg-gold/20 blur-2xl rounded-full -z-10"
        />
      </Link>
    </motion.div>
  );
}
