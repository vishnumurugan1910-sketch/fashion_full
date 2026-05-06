'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';

type CursorVariant = 'default' | 'text' | 'link' | 'view' | 'drag';

export default function CustomCursor() {
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [label, setLabel] = useState('');
  const isMobile = useRef(false);
  const { theme } = useTheme();

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  useEffect(() => {
    isMobile.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isMobile.current) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const handleEnter = () => setIsVisible(true);
    const handleLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleEnter);
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleEnter);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [cursorX, cursorY, dotX, dotY]);

  useEffect(() => {
    if (isMobile.current) return;

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest('[data-cursor="view"]') || target.closest('.cursor-view')) {
        setVariant('view');
        setLabel('View');
        return;
      }

      if (target.closest('[data-cursor="drag"]') || target.closest('.cursor-drag')) {
        setVariant('drag');
        setLabel('Drag');
        return;
      }

      if (target.closest('a') || target.closest('button') || target.closest('[data-cursor="link"]')) {
        setVariant('link');
        setLabel('');
        return;
      }

      if (target.closest('p') || target.closest('h1') || target.closest('h2') || target.closest('h3') || target.closest('span')) {
        setVariant('text');
        setLabel('');
        return;
      }

      setVariant('default');
      setLabel('');
    };

    window.addEventListener('mouseover', handleOver);
    return () => window.removeEventListener('mouseover', handleOver);
  }, []);

  if (isMobile.current) return null;

  // Theme-aware colors
  const isDark = theme === 'dark';
  const defaultBorderColor = isDark ? 'rgba(248, 246, 243, 0.4)' : 'rgba(26, 26, 26, 0.5)';
  const linkBgColor = 'rgba(201, 169, 110, 0.15)';
  const linkBorderColor = 'rgba(201, 169, 110, 0.6)';
  const dotColor = isDark ? '#f8f6f3' : '#1a1a1a';

  const cursorSizes: Record<CursorVariant, number> = {
    default: 32,
    text: 12,
    link: 56,
    view: 72,
    drag: 64,
  };

  const dotSizes: Record<CursorVariant, number> = {
    default: 4,
    text: 4,
    link: 0,
    view: 0,
    drag: 0,
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      {/* Outer ring */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: cursorSizes[variant],
          height: cursorSizes[variant],
          opacity: isVisible ? 1 : 0,
          backgroundColor:
            variant === 'link' || variant === 'view'
              ? linkBgColor
              : 'transparent',
          borderColor:
            variant === 'link' || variant === 'view'
              ? linkBorderColor
              : defaultBorderColor,
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="absolute rounded-full border flex items-center justify-center"
      >
        <AnimatePresence>
          {label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="text-[8px] tracking-[0.2em] uppercase text-gold font-sans whitespace-nowrap"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Center dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: dotColor,
        }}
        animate={{
          width: dotSizes[variant],
          height: dotSizes[variant],
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
        className="absolute rounded-full"
      />
    </div>
  );
}
