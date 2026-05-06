'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface Story {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  image: string;
  category: string;
  status: string;
  publishedAt: string;
  createdAt: string;
}

const fallbackImage = 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=85';

function StoryCard({ story, index }: { story: Story; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const date = story.publishedAt || story.createdAt;
  const dateStr = date ? new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Coming Soon';
  const readTime = story.content ? `${Math.max(1, Math.ceil(story.content.split(' ').length / 200))} min read` : '5 min read';
  const cardImage = story.image || 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80';

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link href="#" className="block">
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-charcoal mb-5">
          <div className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" style={{ backgroundImage: `url(${cardImage})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-gold/20 transition-colors duration-500" />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase font-sans bg-black/50 backdrop-blur-sm text-gold rounded-full">
              {story.category || 'Story'}
            </span>
          </div>
          <div className="absolute bottom-4 right-4">
            <span className="text-[9px] tracking-wider uppercase text-white/60 font-sans">
              {readTime}
            </span>
          </div>
        </div>
        <div className="px-1">
          <p className="text-[9px] tracking-[0.3em] uppercase text-gold/50 font-sans mb-2">{dateStr}</p>
          <h3 className="font-serif text-xl sm:text-2xl text-theme leading-tight group-hover:text-gold transition-colors duration-300 mb-3">
            {story.title}
          </h3>
          <p className="text-sm text-theme-tertiary leading-relaxed line-clamp-2">
            {story.excerpt}
          </p>
          <div className="flex items-center gap-2 mt-4 text-[10px] tracking-[0.2em] uppercase text-theme-muted group-hover:text-gold transition-colors duration-300 font-sans">
            <span>Read Story</span>
            <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/stories?status=published`);
        const data = await res.json();
        setStories(data.stories || []);
      } catch (err) {
        console.error('Failed to fetch stories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const publishedStories = stories.filter(s => s.status === 'published');
  const featured = publishedStories[0] || { _id: '', title: '', excerpt: '', image: fallbackImage, category: '', content: '', publishedAt: '', createdAt: '' };
  const rest = publishedStories.slice(1);

  const featuredDate = featured.publishedAt || featured.createdAt;
  const featuredDateStr = featuredDate ? new Date(featuredDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Coming Soon';
  const featuredReadTime = featured.content ? `${Math.max(1, Math.ceil(featured.content.split(' ').length / 200))} min read` : '5 min read';

  if (loading) {
    return (
      <main className="bg-theme min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-theme min-h-screen">
        <div className="relative h-[45vh] overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${featured.image || fallbackImage})` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-theme" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] tracking-[0.5em] uppercase text-gold/60 font-sans mb-4">
              Journal
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-serif text-5xl md:text-7xl text-white">
              Stories
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm text-white/60 mt-3 max-w-md font-sans">
              Fashion, craft, and culture — told through the lens of luxury
            </motion.p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <nav className="flex items-center gap-2 text-xs text-theme-tertiary mb-10">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-theme-secondary">Stories</span>
          </nav>

          {publishedStories.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <Link href="#" className="group block">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-charcoal">
                    <div className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" style={{ backgroundImage: `url(${featured.image || fallbackImage})` }} />
                    <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-gold/20 transition-colors duration-500" />
                    <span className="absolute top-4 left-4 px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase font-sans bg-black/50 backdrop-blur-sm text-gold rounded-full">
                      Featured
                    </span>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.3em] uppercase text-gold/50 font-sans mb-3">{featuredDateStr} · {featuredReadTime}</p>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-gold/70 font-sans mb-3 block">{featured.category || 'Story'}</span>
                    <h2 className="font-serif text-3xl md:text-4xl text-theme leading-tight group-hover:text-gold transition-colors duration-300 mb-4">
                      {featured.title}
                    </h2>
                    <p className="text-theme-tertiary leading-relaxed mb-6">{featured.excerpt}</p>
                    <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-theme-muted group-hover:text-gold transition-colors duration-300 font-sans">
                      Read Full Story
                      <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ) : (
            <div className="mb-16 text-center py-12">
              <h2 className="font-serif text-3xl md:text-4xl text-theme mb-4">Coming Soon</h2>
              <p className="text-theme-tertiary">New stories are on their way. Check back soon!</p>
            </div>
          )}

          <div className="flex items-center gap-4 mb-12">
            <span className="w-10 h-px bg-gold/50" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-sans">Latest Stories</span>
            <span className="flex-1 h-px bg-gold/10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((story, i) => (
              <StoryCard key={story._id} story={story} index={i} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}