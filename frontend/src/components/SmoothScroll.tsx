'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, {
    damping: 50,
    stiffness: 300,
    mass: 0.8,
  });

  const y = useTransform(smoothScrollY, (value) => -value);

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current && containerRef.current) {
        containerRef.current.style.height = `${contentRef.current.scrollHeight}px`;
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    // Re-calculate after images/fonts load
    const timer = setTimeout(updateHeight, 1000);

    return () => {
      window.removeEventListener('resize', updateHeight);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <motion.div
        ref={contentRef}
        style={{ y }}
        className="fixed top-0 left-0 w-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
