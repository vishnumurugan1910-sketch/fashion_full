'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollWrapperProps {
  children: React.ReactNode;
}

export default function HorizontalScrollWrapper({ children }: HorizontalScrollWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const ctx = gsap.context(() => {
      const panels = Array.from(track.children) as HTMLElement[];
      const totalWidth = track.scrollWidth;

      // Set initial state — panels start off-screen to the right
      gsap.set(panels, { opacity: 0, x: 100 });

      // Staggered entrance animation on first load
      gsap.to(panels, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3,
      });

      // Horizontal scroll — converts vertical scroll to horizontal movement
      const scrollTween = gsap.to(track, {
        x: () => -(totalWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Per-panel reveal animations as they enter viewport
      panels.forEach((panel, i) => {
        if (i === 0) return; // First panel already animated

        gsap.fromTo(
          panel,
          { opacity: 0, x: 80, scale: 0.97 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollTween,
              start: 'left 85%',
              end: 'left 50%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative overflow-hidden">
      <div
        ref={trackRef}
        className="flex items-stretch"
        style={{ width: 'max-content' }}
      >
        {children}
      </div>
    </div>
  );
}
