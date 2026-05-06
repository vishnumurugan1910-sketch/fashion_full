'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reviewsApi, Review } from '@/lib/api';

type ReviewStatus = Review['status'];

const statusStyles: Record<string, string> = {
  approved: 'bg-emerald-500/15 text-emerald-400',
  pending: 'bg-amber-500/15 text-amber-400',
  rejected: 'bg-red-500/15 text-red-400',
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected' | 'spam' | 'featured'>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [search, setSearch] = useState('');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reviewsApi.getAll();
      setReviews(data.reviews || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const filtered = reviews.filter((r) => {
    const matchesSearch = !search || 
      (r.userName || r.user || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.productName || r.product || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.comment || '').toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'spam') return matchesSearch && r.isSpam;
    if (filter === 'featured') return matchesSearch && r.isFeatured;
    return matchesSearch && r.status === filter;
  });

  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.status === 'approved').length,
    pending: reviews.filter(r => r.status === 'pending').length,
    spam: reviews.filter(r => r.isSpam).length,
    featured: reviews.filter(r => r.isFeatured).length,
  };

  const handleApprove = async (id: string) => {
    try {
      await reviewsApi.update(id, { status: 'approved' });
      setReviews((prev) => prev.map((r) => ((r._id || r.id) === id ? { ...r, status: 'approved' as const } : r)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve review');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await reviewsApi.update(id, { status: 'rejected' });
      setReviews((prev) => prev.map((r) => ((r._id || r.id) === id ? { ...r, status: 'rejected' as const } : r)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject review');
    }
  };

  const handleToggleSpam = async (id: string, current: boolean) => {
    try {
      await reviewsApi.update(id, { isSpam: !current });
      setReviews((prev) => prev.map((r) => ((r._id || r.id) === id ? { ...r, isSpam: !current } : r)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update spam status');
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await reviewsApi.update(id, { isFeatured: !current });
      setReviews((prev) => prev.map((r) => ((r._id || r.id) === id ? { ...r, isFeatured: !current } : r)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update featured status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewsApi.delete(id);
      setReviews((prev) => prev.filter((r) => (r._id || r.id) !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete review');
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
        <button onClick={fetchReviews} className="mt-4 px-4 py-2 bg-[#c9a96e] text-black rounded-lg text-sm">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Reviews & Ratings</h1>
          <p className="text-sm text-white/40 mt-1">{stats.total} total reviews</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 text-xs bg-emerald-500/15 text-emerald-400 rounded-full">{stats.approved} Approved</span>
          <span className="px-3 py-1.5 text-xs bg-amber-500/15 text-amber-400 rounded-full">{stats.pending} Pending</span>
          <span className="px-3 py-1.5 text-xs bg-red-500/15 text-red-400 rounded-full">{stats.spam} Spam</span>
          <span className="px-3 py-1.5 text-xs bg-purple-500/15 text-purple-400 rounded-full">{stats.featured} Featured</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/25 outline-none focus:border-[#c9a96e]/40"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5">
        {(['all', 'approved', 'pending', 'rejected', 'spam', 'featured'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-[11px] rounded-md capitalize transition-all ${
              filter === f ? 'bg-[#c9a96e]/20 text-[#c9a96e]' : 'text-white/35 hover:text-white/60 hover:bg-white/5'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filtered.map((review, i) => (
            <motion.div
              key={review._id || review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-white/[0.03] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors ${review.isSpam ? 'border-red-500/30' : ''}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Product Image */}
                <div className="w-20 h-20 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${review.productImage})` }} />
                </div>

                <div className="flex-1 min-w-0">
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white/5 overflow-hidden">
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${review.userAvatar})` }} />
                    </div>
                    <span className="text-sm text-white/80">{review.userName || review.user || 'Unknown User'}</span>
                    <span className="text-[10px] text-white/30">{review.date}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusStyles[review.status]}`}>{review.status}</span>
                    {review.isSpam && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400">Spam</span>}
                    {review.isFeatured && <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400">Featured</span>}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-[#c9a96e]' : 'text-white/10'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    {(review.helpfulCount || 0) > 0 && <span className="text-[10px] text-white/30 ml-2">{review.helpfulCount} helpful</span>}
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-white/60 mb-2">{review.comment}</p>
                  <p className="text-xs text-white/30">on {review.productName || review.product || 'Unknown Product'}</p>

                  {/* Customer Photos */}
                  {(review.customerPhotos && review.customerPhotos.length > 0) && (
                    <div className="flex gap-2 mt-3">
                      {review.customerPhotos.map((photo, idx) => (
                        <div key={idx} className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden">
                          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${photo})` }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                  {review.status === 'pending' && (
                    <>
                      <button onClick={() => handleApprove(review._id || review.id || '')} className="px-3 py-1.5 text-[10px] bg-emerald-500/15 text-emerald-400 rounded-lg hover:bg-emerald-500/25 transition-colors">Approve</button>
                      <button onClick={() => handleReject(review._id || review.id || '')} className="px-3 py-1.5 text-[10px] bg-red-500/15 text-red-400 rounded-lg hover:bg-red-500/25 transition-colors">Reject</button>
                    </>
                  )}
                  <button 
                    onClick={() => handleToggleSpam(review._id || review.id || '', review.isSpam || false)}
                    className={`px-3 py-1.5 text-[10px] rounded-lg transition-colors ${review.isSpam ? 'bg-red-500/15 text-red-400' : 'bg-white/5 text-white/40 hover:text-white/70'}`}
                  >
                    {review.isSpam ? 'Spam' : 'Mark Spam'}
                  </button>
                  <button 
                    onClick={() => handleToggleFeatured(review._id || review.id || '', review.isFeatured || false)}
                    className={`px-3 py-1.5 text-[10px] rounded-lg transition-colors ${review.isFeatured ? 'bg-purple-500/15 text-purple-400' : 'bg-white/5 text-white/40 hover:text-white/70'}`}
                  >
                    {review.isFeatured ? 'Featured' : 'Feature'}
                  </button>
                  <button onClick={() => setSelectedReview(review)} className="px-3 py-1.5 text-[10px] text-white/40 hover:text-white/70 bg-white/5 rounded-lg transition-colors">View</button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-white/25">No reviews found</p>
        </div>
      )}

      {/* Review Detail Modal */}
      <AnimatePresence>
        {selectedReview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedReview(null)} />
            <motion.div initial={{ scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl p-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">Review Details</h2>
                <button onClick={() => setSelectedReview(null)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg bg-white/5 overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${selectedReview.productImage})` }} />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{selectedReview.productName || selectedReview.product || 'Unknown Product'}</p>
                  <p className="text-xs text-white/40">by {selectedReview.userName || selectedReview.user || 'Unknown User'}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className={`w-5 h-5 ${star <= selectedReview.rating ? 'text-[#c9a96e]' : 'text-white/10'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-sm text-white/70 mb-4 whitespace-pre-wrap">{selectedReview.comment}</p>

              {(selectedReview.customerPhotos && selectedReview.customerPhotos.length > 0) && (
                <div className="mb-4">
                  <p className="text-xs text-white/40 mb-2">Customer Photos</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedReview.customerPhotos.map((photo, idx) => (
                      <div key={idx} className="w-20 h-20 rounded-lg bg-white/5 overflow-hidden">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${photo})` }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${statusStyles[selectedReview.status]}`}>{selectedReview.status}</span>
                  {selectedReview.isSpam && <span className="text-[10px] px-2 py-1 rounded-full bg-red-500/15 text-red-400">Spam</span>}
                  {selectedReview.isFeatured && <span className="text-[10px] px-2 py-1 rounded-full bg-purple-500/15 text-purple-400">Featured</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(selectedReview._id || selectedReview.id || '')} className="px-4 py-2 text-xs text-red-400 hover:text-red-300">Delete</button>
                  <button onClick={() => setSelectedReview(null)} className="px-4 py-2 text-xs bg-white/10 text-white rounded-lg hover:bg-white/20">Close</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}