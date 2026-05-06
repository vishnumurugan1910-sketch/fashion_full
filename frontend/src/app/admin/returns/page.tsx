'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReturnRequest {
  _id: string;
  orderId: string;
  userName: string;
  userEmail: string;
  product: string;
  productImage: string;
  type: string;
  status: string;
  reason: string;
  reasonCategory: string;
  description: string;
  refundAmount: number;
  refundStatus: string;
  exchangeSize: string;
  exchangeColor: string;
  trackingNumber: string;
  adminNotes: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400',
  approved: 'bg-blue-500/15 text-blue-400',
  rejected: 'bg-red-500/15 text-red-400',
  processing: 'bg-purple-500/15 text-purple-400',
  completed: 'bg-emerald-500/15 text-emerald-400',
};

const reasonCategories = [
  'Wrong Size',
  'Wrong Color',
  'Defective Product',
  'Not as Described',
  'Better Price Elsewhere',
  'Changed Mind',
  'Other',
];

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'return' | 'exchange'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const fetchReturns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/returns`);
      const data = await res.json();
      setReturns(data.returns || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch returns');
      setReturns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  const filtered = returns.filter((r) => {
    if (filter !== 'all' && r.type !== filter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: returns.length,
    pending: returns.filter(r => r.status === 'pending').length,
    returns: returns.filter(r => r.type === 'return').length,
    exchanges: returns.filter(r => r.type === 'exchange').length,
    refunds: returns.filter(r => r.refundStatus === 'completed').length,
  };

  const reasonAnalytics = reasonCategories.map(cat => ({
    category: cat,
    count: returns.filter(r => r.reasonCategory === cat).length,
  })).filter(r => r.count > 0).sort((a, b) => b.count - a.count);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/returns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes }),
      });
      await fetchReturns();
      setSelectedReturn(null);
      setAdminNotes('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleRefund = async (id: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/returns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refundStatus: 'completed' }),
      });
      await fetchReturns();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to process refund');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/returns/${id}`, { method: 'DELETE' });
      await fetchReturns();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
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
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">{error}</div>
        <button onClick={fetchReturns} className="mt-4 px-4 py-2 bg-[#c9a96e] text-black rounded-lg text-sm">Retry</button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Returns & Exchanges</h1>
          <p className="text-sm text-white/40 mt-1">{stats.total} total requests</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 text-xs bg-amber-500/15 text-amber-400 rounded-full">{stats.pending} Pending</span>
          <span className="px-3 py-1.5 text-xs bg-blue-500/15 text-blue-400 rounded-full">{stats.returns} Returns</span>
          <span className="px-3 py-1.5 text-xs bg-purple-500/15 text-purple-400 rounded-full">{stats.exchanges} Exchanges</span>
          <span className="px-3 py-1.5 text-xs bg-emerald-500/15 text-emerald-400 rounded-full">{stats.refunds} Refunded</span>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3">Return Reasons</h3>
          <div className="space-y-2">
            {reasonAnalytics.map((r) => (
              <div key={r.category} className="flex items-center justify-between">
                <span className="text-xs text-white/60">{r.category}</span>
                <span className="text-xs text-gold">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3">Status Overview</h3>
          <div className="space-y-2">
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${color}`}>{status}</span>
                <span className="text-xs text-white/60">{returns.filter(r => r.status === status).length}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Total Refund Amount</span>
              <span className="text-xs text-gold">₹{returns.reduce((sum, r) => sum + (r.refundAmount || 0), 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Processed</span>
              <span className="text-xs text-emerald-400">{returns.filter(r => r.status === 'completed').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">In Progress</span>
              <span className="text-xs text-purple-400">{returns.filter(r => r.status === 'processing').length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 text-[11px] rounded-md transition-all ${filter === 'all' ? 'bg-[#c9a96e]/20 text-[#c9a96e]' : 'text-white/35 hover:text-white/60'}`}>All</button>
        <button onClick={() => setFilter('return')} className={`px-3 py-1.5 text-[11px] rounded-md transition-all ${filter === 'return' ? 'bg-[#c9a96e]/20 text-[#c9a96e]' : 'text-white/35 hover:text-white/60'}`}>Returns</button>
        <button onClick={() => setFilter('exchange')} className={`px-3 py-1.5 text-[11px] rounded-md transition-all ${filter === 'exchange' ? 'bg-[#c9a96e]/20 text-[#c9a96e]' : 'text-white/35 hover:text-white/60'}`}>Exchanges</button>
        <span className="w-px bg-white/10 mx-2" />
        {['all', 'pending', 'approved', 'processing', 'completed', 'rejected'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-[11px] rounded-md capitalize transition-all ${statusFilter === s ? 'bg-white/10 text-white' : 'text-white/35 hover:text-white/60'}`}>{s}</button>
        ))}
      </div>

      {/* Returns List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filtered.map((ret, i) => (
            <motion.div
              key={ret._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white/[0.03] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-20 h-24 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${ret.productImage})` }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${ret.type === 'return' ? 'bg-blue-500/15 text-blue-400' : 'bg-purple-500/15 text-purple-400'}`}>{ret.type}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[ret.status]}`}>{ret.status}</span>
                    {ret.refundStatus === 'completed' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">Refunded</span>}
                  </div>
                  <h3 className="text-sm text-white font-medium mb-1">{ret.product}</h3>
                  <p className="text-xs text-white/40 mb-2">Order #{ret.orderId} • {ret.userName}</p>
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <span>Reason: {ret.reasonCategory}</span>
                    {ret.exchangeSize && <span>Exchange: {ret.exchangeSize} {ret.exchangeColor && `(${ret.exchangeColor})`}</span>}
                    {ret.refundAmount > 0 && <span className="text-gold">₹{ret.refundAmount.toLocaleString()}</span>}
                  </div>
                  <p className="text-xs text-white/30 mt-2 line-clamp-2">{ret.description}</p>
                </div>
                <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                  <button onClick={() => setSelectedReturn(ret)} className="px-3 py-1.5 text-[10px] text-white/40 hover:text-white/70 bg-white/5 rounded-lg transition-colors">View</button>
                  {ret.status === 'pending' && (
                    <>
                      <button onClick={() => handleUpdateStatus(ret._id, 'approved')} className="px-3 py-1.5 text-[10px] bg-blue-500/15 text-blue-400 rounded-lg">Approve</button>
                      <button onClick={() => handleUpdateStatus(ret._id, 'rejected')} className="px-3 py-1.5 text-[10px] bg-red-500/15 text-red-400 rounded-lg">Reject</button>
                    </>
                  )}
                  {ret.status === 'approved' && (
                    <button onClick={() => handleUpdateStatus(ret._id, 'processing')} className="px-3 py-1.5 text-[10px] bg-purple-500/15 text-purple-400 rounded-lg">Process</button>
                  )}
                  {ret.status === 'processing' && ret.type === 'return' && (
                    <button onClick={() => handleRefund(ret._id)} className="px-3 py-1.5 text-[10px] bg-emerald-500/15 text-emerald-400 rounded-lg">Refund</button>
                  )}
                  {ret.status === 'processing' && ret.type === 'exchange' && (
                    <button onClick={() => handleUpdateStatus(ret._id, 'completed')} className="px-3 py-1.5 text-[10px] bg-emerald-500/15 text-emerald-400 rounded-lg">Complete</button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-white/25">No return requests found</p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedReturn && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedReturn(null)} />
            <motion.div initial={{ scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl p-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white capitalize">{selectedReturn.type} Details</h2>
                <button onClick={() => setSelectedReturn(null)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg bg-white/5 overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${selectedReturn.productImage})` }} />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{selectedReturn.product}</p>
                  <p className="text-xs text-white/40">Order #{selectedReturn.orderId}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                <div><p className="text-white/40">Customer</p><p className="text-white">{selectedReturn.userName}</p></div>
                <div><p className="text-white/40">Email</p><p className="text-white">{selectedReturn.userEmail}</p></div>
                <div><p className="text-white/40">Reason Category</p><p className="text-white">{selectedReturn.reasonCategory}</p></div>
                <div><p className="text-white/40">Status</p><span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColors[selectedReturn.status]}`}>{selectedReturn.status}</span></div>
              </div>
              <div className="mb-4">
                <p className="text-xs text-white/40 mb-1">Description</p>
                <p className="text-sm text-white/70">{selectedReturn.description}</p>
              </div>
              <div className="mb-4">
                <label className="text-xs text-white/40 mb-2 block">Admin Notes</label>
                <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-[#c9a96e]/40 h-20 resize-none" placeholder="Add notes..." />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <button onClick={() => handleDelete(selectedReturn._id)} className="px-4 py-2 text-xs text-red-400 hover:text-red-300">Delete</button>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedReturn(null)} className="px-4 py-2 text-xs bg-white/10 text-white rounded-lg hover:bg-white/20">Close</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}