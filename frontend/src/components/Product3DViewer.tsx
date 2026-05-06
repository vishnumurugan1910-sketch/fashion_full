'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from './ProductCard';

interface Product3DViewerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function Product3DViewer({ product, isOpen, onClose }: Product3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [autoSpin, setAutoSpin] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [dragStartX, setDragStartX] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const autoSpinRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const images = product?.images360 || [];
  const totalFrames = images.length;

  // Reset state when product changes
  useEffect(() => {
    if (product && isOpen) {
      setCurrentIndex(0);
      setZoom(1);
      setAutoSpin(true);
      setLoadedImages(new Set());
    }
  }, [product, isOpen]);

  // Preload images
  useEffect(() => {
    if (!images.length) return;
    images.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setLoadedImages((prev) => new Set(prev).add(i));
      };
    });
  }, [images]);

  // Auto-spin
  useEffect(() => {
    if (autoSpin && !isDragging && isOpen) {
      autoSpinRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalFrames);
      }, 120);
    }
    return () => {
      if (autoSpinRef.current) clearInterval(autoSpinRef.current);
    };
  }, [autoSpin, isDragging, isOpen, totalFrames]);

  // Drag handlers
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      setDragStartX(e.clientX);
      setAutoSpin(false);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const diff = e.clientX - dragStartX;
      const sensitivity = 8;
      if (Math.abs(diff) > sensitivity) {
        const direction = diff > 0 ? 1 : -1;
        setCurrentIndex((prev) => {
          const next = prev + direction;
          return ((next % totalFrames) + totalFrames) % totalFrames;
        });
        setDragStartX(e.clientX);
      }
    },
    [isDragging, dragStartX, totalFrames]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        setAutoSpin(false);
        setCurrentIndex((prev) => ((prev - 1) + totalFrames) % totalFrames);
      }
      if (e.key === 'ArrowRight') {
        setAutoSpin(false);
        setCurrentIndex((prev) => (prev + 1) % totalFrames);
      }
      if (e.key === ' ') {
        e.preventDefault();
        setAutoSpin((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, totalFrames]);

  // Zoom handlers
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));

  if (!product) return null;

  const loadedCount = loadedImages.size;
  const loadProgress = totalFrames > 0 ? (loadedCount / totalFrames) * 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-midnight/95 backdrop-blur-2xl"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-[92vw] max-w-5xl h-[85vh] max-h-[700px] bg-charcoal/50 border border-gold/10 rounded-sm overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gold/10">
              <div className="flex items-center gap-4">
                <span className="text-[10px] tracking-[0.3em] uppercase text-gold/70 font-sans">
                  360° View
                </span>
                <span className="w-px h-4 bg-gold/20" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-slate font-sans">
                  {product.brand}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Auto-spin toggle */}
                <button
                  onClick={() => setAutoSpin(!autoSpin)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-sans rounded-sm border transition-all duration-300 ${
                    autoSpin
                      ? 'border-gold/40 text-gold bg-gold/10'
                      : 'border-graphite/50 text-slate hover:text-pearl'
                  }`}
                >
                  <svg
                    className={`w-3 h-3 ${autoSpin ? 'animate-spin' : ''}`}
                    style={{ animationDuration: '3s' }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                  </svg>
                  {autoSpin ? 'Spinning' : 'Auto Spin'}
                </button>

                {/* Close */}
                <button
                  onClick={onClose}
                  className="w-9 h-9 border border-graphite/50 rounded-sm flex items-center justify-center text-slate hover:text-pearl hover:border-slate/60 transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Viewer Area */}
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="relative flex-1 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
            >
              {/* Loading State */}
              {loadProgress < 100 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <div className="w-48 h-0.5 bg-graphite/50 rounded-full overflow-hidden mb-3">
                    <motion.div
                      className="h-full bg-gold"
                      initial={{ width: 0 }}
                      animate={{ width: `${loadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-slate font-sans">
                    Loading 360° frames...
                  </span>
                </div>
              )}

              {/* Image Display */}
              {images.length > 0 && (
                <motion.div
                  animate={{ scale: zoom }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <div
                    className="w-full h-full bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${images[currentIndex]})`,
                    }}
                  />
                </motion.div>
              )}

              {/* No 360 images fallback */}
              {images.length === 0 && (
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="w-64 h-80 bg-cover bg-center rounded-sm"
                    style={{ backgroundImage: `url(${product.imageFront})` }}
                  />
                  <p className="text-sm text-slate font-sans">
                    360° view not available for this product
                  </p>
                </div>
              )}

              {/* Drag Hint */}
              {images.length > 0 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none">
                  <motion.div
                    animate={isDragging ? { opacity: 0 } : { opacity: 1 }}
                    className="flex items-center gap-2 px-4 py-2 bg-midnight/80 backdrop-blur-sm border border-gold/10 rounded-full"
                  >
                    <svg className="w-4 h-4 text-gold/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-slate/70 font-sans">
                      Drag to rotate
                    </span>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gold/10">
              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-pearl font-sans truncate">{product.title}</p>
                <p className="text-[10px] tracking-[0.15em] uppercase text-gold/60 font-sans mt-0.5">
                  Frame {currentIndex + 1} / {totalFrames}
                </p>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  className="w-9 h-9 border border-graphite/40 rounded-sm flex items-center justify-center text-slate hover:text-pearl hover:border-slate/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                  </svg>
                </button>

                <span className="w-12 text-center text-[10px] tracking-wider text-slate font-sans">
                  {Math.round(zoom * 100)}%
                </span>

                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 2.5}
                  className="w-9 h-9 border border-graphite/40 rounded-sm flex items-center justify-center text-slate hover:text-pearl hover:border-slate/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>

                {/* Reset Zoom */}
                <button
                  onClick={() => setZoom(1)}
                  className="w-9 h-9 border border-graphite/40 rounded-sm flex items-center justify-center text-slate hover:text-pearl hover:border-slate/50 transition-all ml-1"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                  </svg>
                </button>
              </div>

              {/* Frame Progress Bar */}
              <div className="hidden md:flex items-center gap-3 ml-6 flex-1 max-w-xs">
                <div className="flex-1 h-0.5 bg-graphite/40 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gold/60"
                    animate={{ width: `${((currentIndex + 1) / totalFrames) * 100}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
