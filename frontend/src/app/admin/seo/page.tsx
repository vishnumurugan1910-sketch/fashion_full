'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SeoSettings {
  _id?: string;
  page: string;
  metaTitle: string;
  metaDescription: string;
  urlSlug: string;
  keywords: string[];
  jsonLd: { type: string; data: Record<string, unknown> };
  isActive: boolean;
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  image: string;
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

const pages = [
  { value: 'home', label: 'Homepage' },
  { value: 'shop', label: 'Shop/Products' },
  { value: 'about', label: 'About Us' },
  { value: 'contact', label: 'Contact' },
  { value: 'blog', label: 'Blog' },
  { value: 'cart', label: 'Cart' },
  { value: 'checkout', label: 'Checkout' },
];

export default function SeoPage() {
  const [activeTab, setActiveTab] = useState<'settings' | 'blog'>('settings');
  const [seoSettings, setSeoSettings] = useState<SeoSettings[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPage, setSelectedPage] = useState('home');
  const [editingSeo, setEditingSeo] = useState<SeoSettings>({
    page: 'home',
    metaTitle: '',
    metaDescription: '',
    urlSlug: '',
    keywords: [],
    jsonLd: { type: 'Product', data: {} },
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const existing = seoSettings.find(s => s.page === selectedPage);
    if (existing) {
      setEditingSeo(existing);
    } else {
      setEditingSeo({
        page: selectedPage,
        metaTitle: '',
        metaDescription: '',
        urlSlug: '',
        keywords: [],
jsonLd: { type: 'Product', data: {} },
        isActive: true,
      });
    }
  }, [selectedPage, seoSettings]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      let seoRes: SeoSettings[] = [];
      let blogRes: Blog[] = [];
      
      try {
        const seoFetch = await fetch(`${baseUrl}/api/seo`);
        if (seoFetch.ok) seoRes = await seoFetch.json();
      } catch {}
      
      try {
        const blogFetch = await fetch(`${baseUrl}/api/blog`);
        if (blogFetch.ok) blogRes = await blogFetch.json();
      } catch {}
      
      setSeoSettings(seoRes || []);
      setBlogs(blogRes || []);
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveSeo = async () => {
    setSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/seo/${editingSeo.page}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSeo),
      });
      const saved = await res.json();
      setSeoSettings(prev => {
        const exists = prev.find(s => s.page === editingSeo.page);
        if (exists) {
          return prev.map(s => s.page === editingSeo.page ? saved : s);
        }
        return [...prev, saved];
      });
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(false);
    }
  };

  const saveBlog = async (blog: Partial<Blog>) => {
    setSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const method = blog._id ? 'PUT' : 'POST';
      const url = blog._id ? `${baseUrl}/api/blog/${blog._id}` : `${baseUrl}/api/blog`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog),
      });
      const saved = await res.json();
      setBlogs(prev => {
        if (blog._id) {
          return prev.map(b => b._id === blog._id ? saved : b);
        }
        return [saved, ...prev];
      });
    } catch (err) {
      console.error('Failed to save blog:', err);
    } finally {
      setSaving(false);
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/blog/${id}`, { method: 'DELETE' });
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
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
          <h1 className="text-2xl font-semibold text-white">SEO Management</h1>
          <p className="text-sm text-white/40 mt-1">Meta tags, schemas, and blog content</p>
        </div>
      </div>

      <div className="flex gap-1 bg-white/5 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-sm rounded-md transition-all ${
            activeTab === 'settings' ? 'bg-[#c9a96e] text-black' : 'text-white/40 hover:text-white'
          }`}
        >
          SEO Settings
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          className={`px-4 py-2 text-sm rounded-md transition-all ${
            activeTab === 'blog' ? 'bg-[#c9a96e] text-black' : 'text-white/40 hover:text-white'
          }`}
        >
          Blog Posts
        </button>
      </div>

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-2">
            <label className="text-xs text-white/40 uppercase">Select Page</label>
            <div className="space-y-1">
              {pages.map(page => (
                <button
                  key={page.value}
                  onClick={() => setSelectedPage(page.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${
                    selectedPage === page.value
                      ? 'bg-[#c9a96e]/20 text-[#c9a96e] border border-[#c9a96e]/50'
                      : 'bg-white/5 text-white/60 border border-transparent hover:bg-white/10'
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-medium text-white capitalize">{pages.find(p => p.value === selectedPage)?.label}</h3>
              
              <div>
                <label className="text-xs text-white/40 uppercase">Meta Title</label>
                <input
                  type="text"
                  value={editingSeo.metaTitle}
                  onChange={e => setEditingSeo({ ...editingSeo, metaTitle: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#c9a96e] focus:outline-none"
                  placeholder="Enter meta title"
                />
              </div>

              <div>
                <label className="text-xs text-white/40 uppercase">Meta Description</label>
                <textarea
                  value={editingSeo.metaDescription}
                  onChange={e => setEditingSeo({ ...editingSeo, metaDescription: e.target.value })}
                  rows={3}
                  className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#c9a96e] focus:outline-none resize-none"
                  placeholder="Enter meta description"
                />
              </div>

              <div>
                <label className="text-xs text-white/40 uppercase">URL Slug</label>
                <input
                  type="text"
                  value={editingSeo.urlSlug}
                  onChange={e => setEditingSeo({ ...editingSeo, urlSlug: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#c9a96e] focus:outline-none"
                  placeholder="/example-page"
                />
              </div>

              <div>
                <label className="text-xs text-white/40 uppercase">Keywords (comma separated)</label>
                <input
                  type="text"
                  value={editingSeo.keywords.join(', ')}
                  onChange={e => setEditingSeo({ ...editingSeo, keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) })}
                  className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#c9a96e] focus:outline-none"
                  placeholder="fashion, clothing, elevation"
                />
              </div>

              <div>
                <label className="text-xs text-white/40 uppercase">Schema Type</label>
                <select
                  value={editingSeo.jsonLd.type}
                  onChange={e => setEditingSeo({ ...editingSeo, jsonLd: { ...editingSeo.jsonLd, type: e.target.value } })}
                  className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#c9a96e] focus:outline-none"
                >
                  <option value="Product">Product</option>
                  <option value="Organization">Organization</option>
                  <option value="Website">Website</option>
                  <option value="Article">Article</option>
                  <option value="BlogPosting">BlogPosting</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSeo.isActive}
                    onChange={e => setEditingSeo({ ...editingSeo, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#c9a96e] focus:ring-[#c9a96e]"
                  />
                  <span className="text-sm text-white/60">Active</span>
                </label>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={saveSeo}
                  disabled={saving}
                  className="px-4 py-2 bg-[#c9a96e] text-black text-sm font-medium rounded-lg hover:bg-[#b8944f] disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'blog' && (
        <div className="space-y-6">
          <BlogList blogs={blogs} onSave={saveBlog} onDelete={deleteBlog} saving={saving} />
        </div>
      )}
    </div>
  );
}

function BlogList({ blogs, onSave, onDelete, saving }: {
  blogs: Blog[];
  onSave: (blog: Partial<Blog>) => void;
  onDelete: (id: string) => void;
  saving: boolean;
}) {
  const [editing, setEditing] = useState<Partial<Blog> | null>(null);
  const [showForm, setShowForm] = useState(false);

  const defaultBlog: Partial<Blog> = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Fashion',
    tags: [],
    image: '',
    isFeatured: false,
    isPublished: false,
    seo: { metaTitle: '', metaDescription: '', keywords: [] },
  };

  const openEdit = (blog?: Blog) => {
    setEditing(blog ? { ...blog } : defaultBlog);
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => openEdit()}
        className="px-4 py-2 bg-[#c9a96e] text-black text-sm font-medium rounded-lg hover:bg-[#b8944f]"
      >
        Add New Post
      </motion.button>

      {showForm && editing && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 uppercase">Title</label>
              <input
                type="text"
                value={editing.title || ''}
                onChange={e => setEditing({ ...editing, title: e.target.value, slug: editing.slug || e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#c9a96e] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase">Slug</label>
              <input
                type="text"
                value={editing.slug || ''}
                onChange={e => setEditing({ ...editing, slug: e.target.value })}
                className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#c9a96e] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/40 uppercase">Excerpt</label>
            <textarea
              value={editing.excerpt || ''}
              onChange={e => setEditing({ ...editing, excerpt: e.target.value })}
              rows={2}
              className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#c9a96e] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="text-xs text-white/40 uppercase">Content</label>
            <textarea
              value={editing.content || ''}
              onChange={e => setEditing({ ...editing, content: e.target.value })}
              rows={6}
              className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#c9a96e] focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 uppercase">Category</label>
              <input
                type="text"
                value={editing.category || ''}
                onChange={e => setEditing({ ...editing, category: e.target.value })}
                className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#c9a96e] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase">Image URL</label>
              <input
                type="text"
                value={editing.image || ''}
                onChange={e => setEditing({ ...editing, image: e.target.value })}
                className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#c9a96e] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.isFeatured || false}
                onChange={e => setEditing({ ...editing, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#c9a96e] focus:ring-[#c9a96e]"
              />
              <span className="text-sm text-white/60">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.isPublished || false}
                onChange={e => setEditing({ 
                  ...editing, 
                  isPublished: e.target.checked,
                  publishedAt: e.target.checked ? new Date().toISOString() : undefined 
                })}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#c9a96e] focus:ring-[#c9a96e]"
              />
              <span className="text-sm text-white/60">Published</span>
            </label>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onSave(editing)}
              disabled={saving}
              className="px-4 py-2 bg-[#c9a96e] text-black text-sm font-medium rounded-lg hover:bg-[#b8944f] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Post'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { setShowForm(false); setEditing(null); }}
              className="px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {blogs.map(blog => (
          <div key={blog._id} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
              {blog.image ? (
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white/25 text-xs">No img</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate">{blog.title}</h4>
              <p className="text-xs text-white/40 truncate">{blog.excerpt}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-[10px] px-2 py-0.5 bg-white/10 rounded text-white/60">{blog.category}</span>
                {blog.isPublished && <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">Published</span>}
                {blog.isFeatured && <span className="text-[10px] px-2 py-0.5 bg-gold/20 text-gold rounded">Featured</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(blog)} className="p-2 text-white/40 hover:text-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button onClick={() => onDelete(blog._id)} className="p-2 text-white/40 hover:text-red-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
        {blogs.length === 0 && (
          <div className="text-center py-12 text-white/25">No blog posts yet</div>
        )}
      </div>
    </div>
  );
}