'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Banner {
  _id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  images?: string[];
  ctaText?: string;
  ctaLink?: string;
  secondCtaText?: string;
  secondCtaLink?: string;
  type?: string;
  position?: number;
  category?: string;
  active?: boolean;
  startDate?: string;
  endDate?: string;
  backgroundColor?: string;
  textColor?: string;
  layout?: string;
  order?: number;
}

const typeOptions = [
  { value: 'hero', label: 'Hero Banner' },
  { value: 'promo', label: 'Promo Banner' },
  { value: 'section', label: 'Homepage Section' },
  { value: 'collection', label: 'Featured Collection' },
  { value: 'campaign', label: 'Campaign Page' },
  { value: 'trending', label: 'Trending Products' },
  { value: 'featured', label: 'Featured Products' },
];

const layoutOptions = [
  { value: 'full', label: 'Full Width' },
  { value: 'left', label: 'Image Left' },
  { value: 'right', label: 'Image Right' },
  { value: 'center', label: 'Center Aligned' },
  { value: 'split', label: 'Split Layout' },
];

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/banners`);
      const data = await res.json();
      setBanners(data.banners || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const filtered = banners.filter((b) => {
    if (filter === 'all') return true;
    return b.type === filter;
  });

  const stats = {
    total: banners.length,
    active: banners.filter(b => b.active).length,
    hero: banners.filter(b => b.type === 'hero').length,
    campaigns: banners.filter(b => b.type === 'campaign').length,
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !current }),
      });
      await fetchBanners();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update banner');
    }
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/banners/${id}`, { method: 'DELETE' });
      await fetchBanners();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete banner');
    }
  };

  const handleSave = async (banner: Banner) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const method = banner._id ? 'PUT' : 'POST';
      const endpoint = banner._id ? `${baseUrl}/api/banners/${banner._id}` : `${baseUrl}/api/banners`;
      
      await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner),
      });
      
      await fetchBanners();
      setModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save banner');
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Banners & Homepage</h1>
          <p className="text-sm text-white/40 mt-1">Manage hero banners, sections & campaigns</p>
        </div>
        <button
          onClick={() => { setSelectedBanner(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c9a96e] text-black text-xs font-semibold tracking-wider uppercase rounded-lg hover:bg-[#dfc08a]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Banner
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-semibold text-white">{stats.total}</p>
          <p className="text-xs text-white/40">Total Banners</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-semibold text-emerald-400">{stats.active}</p>
          <p className="text-xs text-white/40">Active</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-semibold text-[#c9a96e]">{stats.hero}</p>
          <p className="text-xs text-white/40">Hero Banners</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-semibold text-purple-400">{stats.campaigns}</p>
          <p className="text-xs text-white/40">Campaigns</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs rounded-md transition-all ${
            filter === 'all' ? 'bg-[#c9a96e]/20 text-[#c9a96e]' : 'text-white/35 hover:text-white/60 hover:bg-white/5'
          }`}
        >
          All
        </button>
        {typeOptions.map((t) => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={`px-3 py-1.5 text-xs rounded-md transition-all ${
              filter === t.value ? 'bg-[#c9a96e]/20 text-[#c9a96e]' : 'text-white/35 hover:text-white/60 hover:bg-white/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((banner, i) => (
            <motion.div
              key={banner._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden ${!banner.active ? 'opacity-60' : ''}`}
            >
              <div className="relative h-40 bg-white/5">
                {banner.image ? (
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${banner.image})` }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => toggleActive(banner._id || '', banner.active || false)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      banner.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className={`px-2 py-1 text-[10px] rounded-full ${
                    banner.type === 'hero' ? 'bg-purple-500/20 text-purple-400' :
                    banner.type === 'campaign' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-white/10 text-white/60'
                  }`}>
                    {typeOptions.find(t => t.value === banner.type)?.label || banner.type}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm text-white font-medium truncate">{banner.title}</h3>
                <p className="text-xs text-white/40 mt-1 truncate">{banner.subtitle}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="flex-1 py-2 text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id || '')}
                    className="px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-white/25">No banners found</p>
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <BannerModal
            banner={selectedBanner}
            onClose={() => { setModalOpen(false); setSelectedBanner(null); }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function BannerModal({
  banner,
  onClose,
  onSave,
}: {
  banner: Banner | null;
  onClose: () => void;
  onSave: (b: Banner) => void;
}) {
  const [form, setForm] = useState<Banner>(banner || {
    title: '',
    subtitle: '',
    description: '',
    image: '',
    ctaText: 'Shop Now',
    ctaLink: '/',
    type: 'hero',
    layout: 'full',
    active: true,
    position: 0,
    order: 0,
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/upload/image`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setForm({ ...form, image: data.url });
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-2xl max-h-[85vh] bg-[#111] border border-white/10 rounded-2xl overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-medium text-white">{banner ? 'Edit Banner' : 'Add New Banner'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Type */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Banner Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
            >
              {typeOptions.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Image */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Background Image</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg bg-white/5 border border-dashed border-white/15 flex items-center justify-center overflow-hidden">
                {form.image ? (
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${form.image})` }} />
                ) : (
                  <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                  </svg>
                )}
              </div>
              <label className={`px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white/50 hover:text-white/80 cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 mb-2 block">Title</label>
              <input
                type="text"
                value={form.title || ''}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                placeholder="Banner title"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-2 block">Subtitle</label>
              <input
                type="text"
                value={form.subtitle || ''}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                placeholder="Subtitle text"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Description</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white resize-none"
              placeholder="Banner description..."
            />
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 mb-2 block">Button Text</label>
              <input
                type="text"
                value={form.ctaText || ''}
                onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                placeholder="Shop Now"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-2 block">Button Link</label>
              <input
                type="text"
                value={form.ctaLink || ''}
                onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                placeholder="/category/women"
              />
            </div>
          </div>

          {/* Layout */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Layout</label>
            <select
              value={form.layout}
              onChange={(e) => setForm({ ...form, layout: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
            >
              {layoutOptions.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 mb-2 block">Display Order</label>
              <input
                type="number"
                value={form.order || 0}
                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-2 block">Active</label>
              <button
                type="button"
                onClick={() => setForm({ ...form, active: !form.active })}
                className={`w-full py-2.5 rounded-lg text-sm ${form.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40'}`}
              >
                {form.active ? 'Active' : 'Inactive'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="px-5 py-2.5 text-xs text-white/40 hover:text-white/70">Cancel</button>
          <button
            onClick={() => onSave(form)}
            className="px-6 py-2.5 bg-[#c9a96e] text-black text-xs font-semibold uppercase rounded-lg"
          >
            {banner ? 'Save Changes' : 'Add Banner'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}