'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glowColor?: string;
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  glowColor = 'rgba(201, 169, 110, 0.4)',
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 250, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: smoothX, y: smoothY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={`relative overflow-hidden transition-shadow duration-500 ${className}`}
      data-cursor="link"
    >
      {/* Glow layer */}
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0,
          boxShadow: isHovered
            ? `0 0 30px ${glowColor}, 0 0 60px ${glowColor}`
            : `0 0 0px transparent`,
        }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
      />
      {children}
    </motion.button>
  );
}
