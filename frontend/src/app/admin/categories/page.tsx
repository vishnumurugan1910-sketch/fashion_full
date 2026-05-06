'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categoriesApi, Category } from '@/lib/api';

type CategoryStatus = Category;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoriesApi.getAll();
      setCategories(data.categories || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const toggleActive = async (id: string) => {
    const category = categories.find((c) => (c._id || c.id) === id);
    if (!category) return;
    try {
      await categoriesApi.update(id, { isActive: !category.isActive });
      setCategories((prev) =>
        prev.map((c) => ((c._id || c.id) === id ? { ...c, isActive: !c.isActive } : c))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoriesApi.delete(id);
      setCategories((prev) => prev.filter((c) => (c._id || c.id) !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  const handleSave = async (cat: Category) => {
    try {
      const catData = { name: cat.name, slug: cat.slug, image: cat.image, banner: cat.banner, isActive: cat.isActive };
      if (editing?._id) {
        await categoriesApi.update(editing._id, catData);
      } else {
        await categoriesApi.create(catData);
      }
      await fetchCategories();
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save category');
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          {error}
        </div>
        <button onClick={fetchCategories} className="mt-4 px-4 py-2 bg-[#c9a96e] text-black rounded-lg text-sm">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Categories</h1>
          <p className="text-sm text-white/40 mt-1">{categories.length} categories</p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c9a96e] text-black text-xs font-semibold tracking-wider uppercase rounded-lg hover:bg-[#dfc08a] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {categories.map((cat, i) => (
            <motion.div
              key={cat._id || cat.id}
              layout
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
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />

                {/* Toggle */}
                <button
                  onClick={() => toggleActive(cat._id || cat.id || '')}
                  className={`absolute top-3 right-3 w-10 h-5 rounded-full transition-all ${
                    cat.isActive ? 'bg-[#c9a96e]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    animate={{ x: cat.isActive ? 20 : 2 }}
                    className="w-4 h-4 bg-white rounded-full shadow"
                  />
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-white">{cat.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    cat.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-white/30'
                  }`}>
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-white/30 mb-3">/{cat.slug} · {(cat.productCount || 0).toLocaleString()} products</p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setEditing(cat); setModalOpen(true); }}
                    className="flex-1 py-2 text-[10px] tracking-wider uppercase text-white/40 hover:text-white/70 border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id || cat.id || '')}
                    className="w-9 h-9 border border-white/10 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all"
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

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <CategoryModal
            category={editing}
            onClose={() => { setModalOpen(false); setEditing(null); }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Category Modal ─── */
function CategoryModal({
  category,
  onClose,
  onSave,
}: {
  category: Category | null;
  onClose: () => void;
  onSave: (cat: Category) => void;
}) {
  const [form, setForm] = useState<Category>(
    category || {
      id: '',
      name: '',
      slug: '',
      productCount: 0,
      image: '',
      banner: '',
      isActive: true,
    }
  );
  const [imagePreview, setImagePreview] = useState(form.image);
  const [bannerPreview, setBannerPreview] = useState(form.banner);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const { uploadApi } = await import('@/lib/api');
        const result = await uploadApi.category(file);
        const imageUrl = result.url;
        setImagePreview(imageUrl);
        setForm((prev) => ({ ...prev, image: imageUrl }));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const { uploadApi } = await import('@/lib/api');
        const result = await uploadApi.category(file);
        const bannerUrl = result.url;
        setBannerPreview(bannerUrl);
        setForm((prev) => ({ ...prev, banner: bannerUrl }));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    }));
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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-medium text-white">
            {category ? 'Edit Category' : 'Add Category'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Image */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Category Image (Thumbnail)</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg bg-white/5 border border-dashed border-white/15 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagePreview})` }} />
                ) : (
                  <svg className="w-5 h-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                )}
              </div>
              <label className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white/50 hover:text-white/80 hover:bg-white/8 transition-all cursor-pointer">
                Upload
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Banner Image */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Banner Image (Hero)</label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-20 rounded-lg bg-white/5 border border-dashed border-white/15 flex items-center justify-center overflow-hidden">
                {bannerPreview ? (
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${bannerPreview})` }} />
                ) : (
                  <svg className="w-5 h-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                )}
              </div>
              <label className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white/50 hover:text-white/80 hover:bg-white/8 transition-all cursor-pointer">
                Upload Banner
                <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
              </label>
              <span className="text-xs text-white/30">Recommended: 1600×800px</span>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 outline-none focus:border-[#c9a96e]/40 transition-colors"
              placeholder="e.g. Accessories"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Slug</label>
            <div className="flex items-center">
              <span className="px-4 py-2.5 bg-white/[0.03] border border-white/10 border-r-0 rounded-l-lg text-xs text-white/30">
                /collections/
              </span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-r-lg text-sm text-white outline-none focus:border-[#c9a96e]/40 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="px-5 py-2.5 text-xs text-white/40 hover:text-white/70 transition-colors">Cancel</button>
          <button
            onClick={() => onSave(form)}
            className="px-6 py-2.5 bg-[#c9a96e] text-black text-xs font-semibold tracking-wider uppercase rounded-lg hover:bg-[#dfc08a] transition-colors"
          >
            {category ? 'Save' : 'Create'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
