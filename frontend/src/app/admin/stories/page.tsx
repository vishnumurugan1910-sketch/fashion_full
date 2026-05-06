'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storiesApi, Story } from '@/lib/api';

type StoryStatus = Story['status'];

const categories = ['Trends', 'Designers', 'Sustainability', 'Culture', 'Style Guide'];

const statusStyles: Record<string, string> = {
  published: 'bg-emerald-500/15 text-emerald-400',
  draft: 'bg-amber-500/15 text-amber-400',
};

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);

  const fetchStories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await storiesApi.getAll();
      setStories(data.stories || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stories');
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const filtered = stories.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.author.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });

  const handleEdit = (story: Story) => {
    setEditingStory(story);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;
    try {
      await storiesApi.delete(id);
      setStories((prev) => prev.filter((s) => (s._id || s.id) !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete story');
    }
  };

  const handleAdd = () => {
    setEditingStory(null);
    setModalOpen(true);
  };

  const handleSave = async (story: Story) => {
    try {
      const storyData = { title: story.title, excerpt: story.excerpt, content: story.content, author: story.author, image: story.image, category: story.category, status: story.status };
      if (editingStory?._id) {
        await storiesApi.update(editingStory._id, storyData);
      } else {
        await storiesApi.create(storyData);
      }
      await fetchStories();
      setModalOpen(false);
      setEditingStory(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save story');
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
        <button onClick={fetchStories} className="mt-4 px-4 py-2 bg-[#c9a96e] text-black rounded-lg text-sm">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Stories & Blog</h1>
          <p className="text-sm text-white/40 mt-1">{stories.length} total articles</p>
        </div>
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c9a96e] text-black text-xs font-semibold tracking-wider uppercase rounded-lg hover:bg-[#dfc08a] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          New Story
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          <input type="text" placeholder="Search stories..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/25 outline-none focus:border-[#c9a96e]/40" />
        </div>
        <div className="flex gap-1.5">
          {['all', 'published', 'draft'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-[11px] rounded-md capitalize transition-all ${filter === f ? 'bg-[#c9a96e]/20 text-[#c9a96e]' : 'text-white/35 hover:text-white/60 hover:bg-white/5'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((story, i) => (
          <motion.div key={story._id || story.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="group bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
            <div className="aspect-[16/10] bg-white/5 relative">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${story.image})` }} />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] px-2 py-1 rounded-full bg-black/60 text-white/80">{story.category}</span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-white/30">{story.publishedAt}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusStyles[story.status]}`}>{story.status}</span>
              </div>
              <h3 className="text-base font-medium text-white line-clamp-2">{story.title}</h3>
              <p className="text-sm text-white/40 mt-2 line-clamp-2">{story.excerpt}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <span className="text-[10px] text-white/30">by {story.author}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(story)} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(story._id || story.id || '')} className="w-7 h-7 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/40 hover:text-red-400">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <StoryModal story={editingStory} onClose={() => { setModalOpen(false); setEditingStory(null); }} onSave={(story) => { handleSave(story); setModalOpen(false); }} />
        )}
      </AnimatePresence>
    </div>
  );
}

function StoryModal({ story, onClose, onSave }: { story: Story | null; onClose: () => void; onSave: (s: Story) => void }) {
  const [form, setForm] = useState<Story>(
    story || { id: '', title: '', excerpt: '', content: '', author: 'Editorial Team', image: '', category: 'Trends', publishedAt: '', status: 'draft' }
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-medium text-white">{story ? 'Edit Story' : 'New Story'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div><label className="text-xs text-white/40 mb-2 block">Image URL</label><input type="text" value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white" placeholder="https://..." /></div>
          <div><label className="text-xs text-white/40 mb-2 block">Title</label><input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white" /></div>
          <div><label className="text-xs text-white/40 mb-2 block">Excerpt</label><textarea value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white resize-none h-20" /></div>
          <div><label className="text-xs text-white/40 mb-2 block">Content</label><textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white resize-none h-32" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-white/40 mb-2 block">Author</label><input type="text" value={form.author} onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white" /></div>
            <div><label className="text-xs text-white/40 mb-2 block">Category</label><select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white">{categories.map((c) => <option key={c} value={c} className="bg-[#111]">{c}</option>)}</select></div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="storyStatus" checked={form.status === 'published'} onChange={(e) => setForm((p) => ({ ...p, status: e.target.checked ? 'published' : 'draft' }))} className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#c9a96e]" />
            <label htmlFor="storyStatus" className="text-sm text-white/70">Publish immediately</label>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="px-5 py-2.5 text-xs text-white/40 hover:text-white/70">Cancel</button>
          <button onClick={() => onSave(form)} className="px-6 py-2.5 bg-[#c9a96e] text-black text-xs font-semibold uppercase rounded-lg hover:bg-[#dfc08a]">{story ? 'Save Changes' : 'Publish'}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}