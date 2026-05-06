'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StoryItem {
  tag: string;
  title: string;
  titleAccent: string;
  description: string;
  image: string;
  href: string;
}

const stories: StoryItem[] = [
  {
    tag: 'Chapter I',
    title: 'Crafted',
    titleAccent: 'Elegance',
    description:
      'Every stitch tells a story of heritage and precision. Handcrafted by artisans who have mastered their craft across generations.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=85',
    href: '/category/women',
  },
  {
    tag: 'Chapter II',
    title: 'Timeless',
    titleAccent: 'Design',
    description:
      'Silhouettes that transcend seasons. Where classic meets contemporary in a dance of form and function.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&q=85',
    href: '/category/women',
  },
  {
    tag: 'Chapter III',
    title: 'Modern',
    titleAccent: 'Luxury',
    description:
      'Redefining opulence for the new era. Sustainable materials, bold statements, conscious choices.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1920&q=85',
    href: '/category/accessories',
  },
];

export default function StorytellingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const ctx = gsap.context(() => {
      const totalStories = stories.length;
      const scrollDuration = totalStories * 100;

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${scrollDuration}%`,
          pin: container,
          scrub: 1.5,
          onUpdate: (self) => {
            if (counterRef.current) {
              const currentIndex = Math.min(
                Math.floor(self.progress * totalStories),
                totalStories - 1
              );
              counterRef.current.textContent = `0${currentIndex + 1}`;
            }
          },
        },
      });

      // Set initial states
      imageRefs.current.forEach((img, i) => {
        if (!img) return;
        gsap.set(img, {
          opacity: i === 0 ? 1 : 0,
          scale: i === 0 ? 1.1 : 1.25,
        });
      });

      textRefs.current.forEach((txt, i) => {
        if (!txt) return;
        gsap.set(txt, {
          opacity: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 60,
        });
      });

      // Build transitions
      for (let i = 0; i < totalStories; i++) {
        const segStart = i / totalStories;
        const segMid = (i + 0.5) / totalStories;

        const curImg = imageRefs.current[i];
        const curTxt = textRefs.current[i];
        const curOvr = overlayRefs.current[i];
        const curProg = progressRefs.current[i];

        // Text in
        if (curTxt) {
          masterTl.fromTo(
            curTxt,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.15, ease: 'power3.out' },
            segStart
          );
        }

        // Image zoom settle
        if (curImg) {
          masterTl.to(curImg, { scale: 1, duration: 0.3, ease: 'none' }, segStart);
        }

        // Progress bar
        if (curProg) {
          masterTl.fromTo(
            curProg,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.3, ease: 'none' },
            segStart
          );
        }

        // Overlay
        if (curOvr) {
          masterTl.fromTo(
            curOvr,
            { opacity: 0.3 },
            { opacity: 0.6, duration: 0.3, ease: 'none' },
            segStart
          );
        }

        // Exit (not last)
        if (i < totalStories - 1) {
          const nxtImg = imageRefs.current[i + 1];
          const nxtTxt = textRefs.current[i + 1];

          // Text out
          if (curTxt) {
            masterTl.to(
              curTxt,
              { opacity: 0, y: -40, duration: 0.1, ease: 'power2.in' },
              segMid - 0.02
            );
          }

          // Crossfade images
          if (curImg) {
            masterTl.to(
              curImg,
              { opacity: 0, scale: 1.12, duration: 0.12, ease: 'power2.inOut' },
              segMid
            );
          }
          if (nxtImg) {
            masterTl.fromTo(
              nxtImg,
              { opacity: 0, scale: 1.25 },
              { opacity: 1, scale: 1.1, duration: 0.12, ease: 'power2.inOut' },
              segMid
            );
          }

          // Next text in
          if (nxtTxt) {
            masterTl.fromTo(
              nxtTxt,
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 0.12, ease: 'power3.out' },
              segMid + 0.04
            );
          }
        }
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ height: '350vh' }}>
      <div ref={containerRef} className="w-full h-screen overflow-hidden bg-midnight">
        {/* Background Images */}
        {stories.map((story, i) => (
          <div
            key={story.tag}
            ref={(el) => { imageRefs.current[i] = el; }}
            className="absolute inset-0 w-full h-full will-change-transform"
            style={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${story.image})` }}
            />
            <div
              ref={(el) => { overlayRefs.current[i] = el; }}
              className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/30 to-midnight/60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-midnight/70 via-midnight/20 to-transparent" />
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left Column — Text stacks here */}
              <div className="relative min-h-[420px] lg:min-h-[500px] flex items-center">
                {stories.map((story, i) => (
                  <div
                    key={story.tag}
                    ref={(el) => { textRefs.current[i] = el; }}
                    className="w-full will-change-transform"
                    style={{ opacity: 0, position: i === 0 ? 'relative' : 'absolute', top: 0, left: 0 }}
                  >
                    {/* Chapter Tag */}
                    <div className="flex items-center gap-4 mb-6">
                      <span className="w-10 h-px bg-gold/60" />
                      <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-sans">
                        {story.tag}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-pearl leading-[0.92] tracking-tight mb-6">
                      {story.title}
                      <br />
                      <span className="italic text-gold">{story.titleAccent}</span>
                    </h2>

                    {/* Description */}
                    <p className="font-sans text-sm sm:text-base md:text-lg text-champagne/60 leading-relaxed max-w-md mb-8">
                      {story.description}
                    </p>

                    {/* CTA */}
                    <Link
                      href={story.href}
                      className="group inline-flex items-center gap-4 text-xs sm:text-sm tracking-[0.2em] uppercase text-pearl/70 hover:text-gold transition-colors duration-500 font-sans"
                    >
                      <span>Explore Collection</span>
                      <span className="w-6 h-px bg-gold/40 group-hover:w-12 transition-all duration-500" />
                      <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Right Column — Progress Indicator */}
              <div className="hidden lg:flex justify-center items-center">
                <div className="relative">
                  {/* Vertical line */}
                  <div className="relative w-px h-[50vh] bg-gold/10">
                    {stories.map((story, i) => (
                      <div
                        key={`prog-${story.tag}`}
                        className="absolute left-0 w-full overflow-hidden"
                        style={{
                          top: `${(i / stories.length) * 100}%`,
                          height: `${100 / stories.length}%`,
                        }}
                      >
                        <div
                          ref={(el) => { progressRefs.current[i] = el; }}
                          className="w-full h-full bg-gold origin-top"
                          style={{ transform: 'scaleX(0)' }}
                        />
                      </div>
                    ))}

                    {/* Chapter markers */}
                    {stories.map((story, i) => (
                      <div
                        key={`marker-${story.tag}`}
                        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4"
                        style={{ top: `${(i / (stories.length - 1)) * 100}%`, transform: 'translate(-50%, -50%)' }}
                      >
                        <div className="w-3 h-3 rounded-full border border-gold/40 bg-midnight relative">
                          <div className="absolute inset-[3px] rounded-full bg-gold/0 group-data-[active=true]:bg-gold/60" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 lg:px-12 pb-8">
          <div className="max-w-7xl mx-auto flex justify-between items-end">
            {/* Counter */}
            <div className="flex items-baseline gap-2">
              <span ref={counterRef} className="font-serif text-3xl md:text-4xl text-gold">01</span>
              <span className="text-slate/50 text-sm font-sans">/ 0{stories.length}</span>
            </div>

            {/* Scroll hint */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[9px] tracking-[0.4em] uppercase text-slate/40 font-sans">Scroll</span>
              <div className="w-px h-8 bg-gradient-to-b from-gold/40 to-transparent relative overflow-hidden">
                <div className="animate-scroll-dot absolute top-0 left-0 w-full h-2 bg-gold rounded-full" />
              </div>
            </div>

            {/* Label */}
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-[9px] tracking-[0.3em] uppercase text-slate/30 font-sans">AW 2026</span>
              <span className="w-6 h-px bg-gold/15" />
              <span className="text-[9px] tracking-[0.3em] uppercase text-slate/30 font-sans">Stories</span>
            </div>
          </div>
        </div>

        {/* Corner frames */}
        <div className="absolute top-6 left-6 w-10 h-10 border-l border-t border-gold/10 z-20" />
        <div className="absolute top-6 right-6 w-10 h-10 border-r border-t border-gold/10 z-20" />
      </div>
    </section>
  );
}
