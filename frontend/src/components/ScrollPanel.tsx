'use client';

import { motion } from 'framer-motion';

interface ScrollPanelProps {
  children: React.ReactNode;
  className?: string;
  width?: string;
}

export default function ScrollPanel({
  children,
  className = '',
  width = '100vw',
}: ScrollPanelProps) {
  return (
    <div
      className={`flex-shrink-0 h-screen overflow-hidden ${className}`}
      style={{ width }}
    >
      {children}
    </div>
  );
}
