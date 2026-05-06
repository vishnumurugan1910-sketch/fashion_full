'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

/* ─── Types ─── */
interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  isActive: boolean;
  order: number;
}

interface FeaturedCollection {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  productIds: string[];
  isActive: boolean;
}

/* ─── Data ─── */
const initialBanners: HeroBanner[] = [
  {
    id: 'b1',
    title: 'Redefine Your Elegance',
    subtitle: 'Autumn/Winter 2026 Collection',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=60',
    ctaText: 'Shop Now',
    isActive: true,
    order: 1,
  },
  {
    id: 'b2',
    title: 'Modern Luxury',
    subtitle: 'Sustainable fashion for the conscious',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=60',
    ctaText: 'Explore',
    isActive: true,
    order: 2,
  },
  {
    id: 'b3',
    title: 'Crafted Elegance',
    subtitle: 'Hand-finished pieces by master artisans',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=60',
    ctaText: 'Discover',
    isActive: false,
    order: 3,
  },
];

const initialCollections: FeaturedCollection[] = [
  {
    id: 'fc1',
    title: 'The Evening Edit',
    subtitle: 'Gowns & cocktail dresses',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=60',
    productIds: ['P001', 'P007'],
    isActive: true,
  },
  {
    id: 'fc2',
    title: 'Winter Outerwear',
    subtitle: 'Coats, jackets & layers',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=60',
    productIds: ['P002', 'P005'],
    isActive: true,
  },
  {
    id: 'fc3',
    title: 'Designer Bags',
    subtitle: 'Luxury leather goods',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=60',
    productIds: ['P003'],
    isActive: true,
  },
  {
    id: 'fc4',
    title: 'Statement Accessories',
    subtitle: 'Scarves, jewelry & more',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=60',
    productIds: ['P006'],
    isActive: false,
  },
];

export default function SectionsPage() {
  const [activeTab, setActiveTab] = useState<'hero' | 'collections'>('hero');
  const [banners, setBanners] = useState<HeroBanner[]>(initialBanners);
  const [collections, setCollections] = useState<FeaturedCollection[]>(initialCollections);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [editingCollection, setEditingCollection] = useState<FeaturedCollection | null>(null);

  const toggleBanner = (id: string) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b)));
  };

  const toggleCollection = (id: string) => {
    setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

  const saveBanner = (banner: HeroBanner) => {
    if (editingBanner) {
      setBanners((prev) => prev.map((b) => (b.id === banner.id ? banner : b)));
    } else {
      setBanners((prev) => [...prev, { ...banner, id: `b${prev.length + 1}`, order: prev.length + 1 }]);
    }
    setModalOpen(false);
    setEditingBanner(null);
  };

  const saveCollection = (col: FeaturedCollection) => {
    if (editingCollection) {
      setCollections((prev) => prev.map((c) => (c.id === col.id ? col : c)));
    } else {
      setCollections((prev) => [...prev, { ...col, id: `fc${prev.length + 1}` }]);
    }
    setModalOpen(false);
    setEditingCollection(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Homepage Sections</h1>
        <p className="text-sm text-white/40 mt-1">Control hero banners and featured collections</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-5 py-2 text-xs rounded-md transition-all ${
            activeTab === 'hero' ? 'bg-[#c9a96e]/20 text-[#c9a96e]' : 'text-white/40 hover:text-white/60'
          }`}
        >
          Hero Banners ({banners.length})
        </button>
        <button
          onClick={() => setActiveTab('collections')}
          className={`px-5 py-2 text-xs rounded-md transition-all ${
            activeTab === 'collections' ? 'bg-[#c9a96e]/20 text-[#c9a96e]' : 'text-white/40 hover:text-white/60'
          }`}
        >
          Featured Collections ({collections.length})
        </button>
      </div>

      {/* Hero Banners Tab */}
      {activeTab === 'hero' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => { setEditingBanner(null); setActiveTab('hero'); setModalOpen(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c9a96e] text-black text-xs font-semibold tracking-wider uppercase rounded-lg hover:bg-[#dfc08a] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Banner
            </button>
          </div>

          <Reorder.Group
            axis="y"
            values={banners}
            onReorder={setBanners}
            className="space-y-3"
          >
            {banners.map((banner) => (
              <Reorder.Item
                key={banner.id}
                value={banner}
                className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden group hover:border-white/10 transition-colors cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Drag handle */}
                  <div className="text-white/15 group-hover:text-white/30 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" />
                      <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                      <circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" />
                    </svg>
                  </div>

                  {/* Image */}
                  <div className="w-24 h-16 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${banner.image})` }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm text-white/80 truncate">{banner.title}</h3>
                      <span className="text-[9px] text-white/20">#{banner.order}</span>
                    </div>
                    <p className="text-xs text-white/30 truncate">{banner.subtitle}</p>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => toggleBanner(banner.id)}
                    className={`w-10 h-5 rounded-full transition-all flex-shrink-0 ${
                      banner.isActive ? 'bg-[#c9a96e]' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      animate={{ x: banner.isActive ? 20 : 2 }}
                      className="w-4 h-4 bg-white rounded-full shadow"
                    />
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditingBanner(banner); setModalOpen(true); }}
                      className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteBanner(banner.id)}
                      className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/40 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}

      {/* Featured Collections Tab */}
      {activeTab === 'collections' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => { setEditingCollection(null); setModalOpen(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c9a96e] text-black text-xs font-semibold tracking-wider uppercase rounded-lg hover:bg-[#dfc08a] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Collection
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {collections.map((col, i) => (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden group hover:border-white/10 transition-colors"
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${col.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />

                    {/* Toggle */}
                    <button
                      onClick={() => toggleCollection(col.id)}
                      className={`absolute top-3 right-3 w-10 h-5 rounded-full transition-all ${
                        col.isActive ? 'bg-[#c9a96e]' : 'bg-white/20'
                      }`}
                    >
                      <motion.div
                        animate={{ x: col.isActive ? 20 : 2 }}
                        className="w-4 h-4 bg-white rounded-full shadow"
                      />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-white">{col.title}</h3>
                    <p className="text-xs text-white/30 mt-0.5">{col.subtitle}</p>
                    <p className="text-[10px] text-white/20 mt-2">{col.productIds.length} products linked</p>

                    <div className="flex items-center gap-2 mt-4">
                      <button
                        onClick={() => { setEditingCollection(col); setModalOpen(true); }}
                        className="flex-1 py-2 text-[10px] tracking-wider uppercase text-white/40 hover:text-white/70 border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCollection(col.id)}
                        className="w-9 h-9 border border-white/10 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:border-red-500/30 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <SectionModal
            type={activeTab}
            editingBanner={editingBanner}
            editingCollection={editingCollection}
            onClose={() => { setModalOpen(false); setEditingBanner(null); setEditingCollection(null); }}
            onSaveBanner={saveBanner}
            onSaveCollection={saveCollection}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Section Modal ─── */
function SectionModal({
  type,
  editingBanner,
  editingCollection,
  onClose,
  onSaveBanner,
  onSaveCollection,
}: {
  type: 'hero' | 'collections';
  editingBanner: HeroBanner | null;
  editingCollection: FeaturedCollection | null;
  onClose: () => void;
  onSaveBanner: (b: HeroBanner) => void;
  onSaveCollection: (c: FeaturedCollection) => void;
}) {
  const [bannerForm, setBannerForm] = useState<HeroBanner>(
    editingBanner || { id: '', title: '', subtitle: '', image: '', ctaText: 'Shop Now', isActive: true, order: 0 }
  );
  const [collectionForm, setCollectionForm] = useState<FeaturedCollection>(
    editingCollection || { id: '', title: '', subtitle: '', image: '', productIds: [], isActive: true }
  );
  const [imagePreview, setImagePreview] = useState(
    type === 'hero' ? bannerForm.image : collectionForm.image
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      if (type === 'hero') {
        setBannerForm((prev) => ({ ...prev, image: url }));
      } else {
        setCollectionForm((prev) => ({ ...prev, image: url }));
      }
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
        exit={{ scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-medium text-white">
            {type === 'hero'
              ? editingBanner ? 'Edit Banner' : 'Add Banner'
              : editingCollection ? 'Edit Collection' : 'Add Collection'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Image Upload */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Image</label>
            <div className="flex items-center gap-4">
              <div className="w-full h-32 rounded-lg bg-white/5 border border-dashed border-white/15 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagePreview})` }} />
                ) : (
                  <svg className="w-8 h-8 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                )}
              </div>
            </div>
            <label className="inline-block mt-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white/50 hover:text-white/80 hover:bg-white/8 transition-all cursor-pointer">
              Upload Image
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Title</label>
            <input
              type="text"
              value={type === 'hero' ? bannerForm.title : collectionForm.title}
              onChange={(e) =>
                type === 'hero'
                  ? setBannerForm((prev) => ({ ...prev, title: e.target.value }))
                  : setCollectionForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-[#c9a96e]/40 transition-colors"
              placeholder="Section title"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Subtitle</label>
            <input
              type="text"
              value={type === 'hero' ? bannerForm.subtitle : collectionForm.subtitle}
              onChange={(e) =>
                type === 'hero'
                  ? setBannerForm((prev) => ({ ...prev, subtitle: e.target.value }))
                  : setCollectionForm((prev) => ({ ...prev, subtitle: e.target.value }))
              }
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-[#c9a96e]/40 transition-colors"
              placeholder="Section subtitle"
            />
          </div>

          {/* CTA Text (hero only) */}
          {type === 'hero' && (
            <div>
              <label className="text-xs text-white/40 mb-2 block">CTA Button Text</label>
              <input
                type="text"
                value={bannerForm.ctaText}
                onChange={(e) => setBannerForm((prev) => ({ ...prev, ctaText: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-[#c9a96e]/40 transition-colors"
                placeholder="e.g. Shop Now"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="px-5 py-2.5 text-xs text-white/40 hover:text-white/70 transition-colors">Cancel</button>
          <button
            onClick={() => type === 'hero' ? onSaveBanner(bannerForm) : onSaveCollection(collectionForm)}
            className="px-6 py-2.5 bg-[#c9a96e] text-black text-xs font-semibold tracking-wider uppercase rounded-lg hover:bg-[#dfc08a] transition-colors"
          >
            {type === 'hero'
              ? editingBanner ? 'Save' : 'Create Banner'
              : editingCollection ? 'Save' : 'Create Collection'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
