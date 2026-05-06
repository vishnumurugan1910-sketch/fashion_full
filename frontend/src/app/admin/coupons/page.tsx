'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { couponsApi, Coupon } from '@/lib/api';

type CouponType = Coupon['type'];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await couponsApi.getAll();
      setCoupons(data.coupons || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch coupons');
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await couponsApi.delete(id);
      setCoupons((prev) => prev.filter((c) => (c._id || c.id) !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete coupon');
    }
  };

  const handleToggle = async (id: string) => {
    const coupon = coupons.find((c) => (c._id || c.id) === id);
    if (!coupon) return;
    try {
      await couponsApi.update(id, { active: !coupon.active });
      setCoupons((prev) => prev.map((c) => ((c._id || c.id) === id ? { ...c, active: !c.active } : c)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update coupon');
    }
  };

  const handleAdd = () => {
    setEditingCoupon(null);
    setModalOpen(true);
  };

  const handleSave = async (coupon: Coupon) => {
    try {
      const couponData = { code: coupon.code, type: coupon.type, value: coupon.value, minOrder: coupon.minOrder, maxUses: coupon.maxUses, startDate: coupon.startDate, endDate: coupon.endDate, active: coupon.active };
      if (editingCoupon?._id) {
        await couponsApi.update(editingCoupon._id, couponData);
      } else {
        await couponsApi.create(couponData);
      }
      await fetchCoupons();
      setModalOpen(false);
      setEditingCoupon(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save coupon');
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
        <button onClick={fetchCoupons} className="mt-4 px-4 py-2 bg-[#c9a96e] text-black rounded-lg text-sm">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Coupons & Offers</h1>
          <p className="text-sm text-white/40 mt-1">{coupons.length} total coupons</p>
        </div>
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c9a96e] text-black text-xs font-semibold tracking-wider uppercase rounded-lg hover:bg-[#dfc08a] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Create Coupon
        </button>
      </div>

      <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Code', 'Type', 'Value', 'Min Order', 'Usage', 'Valid Until', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-[10px] tracking-wider uppercase text-white/25 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {coupons.map((coupon, i) => (
                  <motion.tr key={coupon._id || coupon.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#c9a96e] font-mono font-medium">{coupon.code}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-white/50 capitalize">{coupon.type}</td>
                    <td className="px-6 py-4 text-sm text-white font-medium">{coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}</td>
                    <td className="px-6 py-4 text-xs text-white/40">₹{coupon.minOrder.toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs text-white/40">{coupon.maxUses === 0 ? '∞' : `${coupon.usedCount}/${coupon.maxUses}`}</td>
                    <td className="px-6 py-4 text-xs text-white/30">{coupon.endDate}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleToggle(coupon._id || coupon.id || '')} className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-colors ${coupon.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-white/30'}`}>
                        {coupon.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(coupon)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(coupon._id || coupon.id || '')} className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/40 hover:text-red-400">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79" /></svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <CouponModal coupon={editingCoupon} onClose={() => { setModalOpen(false); setEditingCoupon(null); }} onSave={handleSave} />
        )}
      </AnimatePresence>
    </div>
  );
}

function CouponModal({ coupon, onClose, onSave }: { coupon: Coupon | null; onClose: () => void; onSave: (c: Coupon) => void }) {
  const [form, setForm] = useState<Coupon>(
    coupon || { id: '', code: '', type: 'percentage', value: 10, minOrder: 0, maxUses: 100, usedCount: 0, startDate: new Date().toISOString().split('T')[0], endDate: '', active: true }
  );

  const handleChange = (field: keyof Coupon, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-medium text-white">{coupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="p-6 space-y-4">
          <div><label className="text-xs text-white/40 mb-2 block">Coupon Code</label><input type="text" value={form.code} onChange={(e) => handleChange('code', e.target.value.toUpperCase())} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white font-mono" placeholder="e.g. SAVE20" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-white/40 mb-2 block">Discount Type</label><select value={form.type} onChange={(e) => handleChange('type', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white"><option value="percentage" className="bg-[#111]">Percentage</option><option value="fixed" className="bg-[#111]">Fixed Amount</option></select></div>
            <div><label className="text-xs text-white/40 mb-2 block">Value</label><input type="number" value={form.value} onChange={(e) => handleChange('value', Number(e.target.value))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-white/40 mb-2 block">Min Order (₹)</label><input type="number" value={form.minOrder} onChange={(e) => handleChange('minOrder', Number(e.target.value))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white" /></div>
            <div><label className="text-xs text-white/40 mb-2 block">Max Uses (0 = unlimited)</label><input type="number" value={form.maxUses} onChange={(e) => handleChange('maxUses', Number(e.target.value))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-white/40 mb-2 block">Start Date</label><input type="date" value={form.startDate} onChange={(e) => handleChange('startDate', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white" /></div>
            <div><label className="text-xs text-white/40 mb-2 block">End Date</label><input type="date" value={form.endDate} onChange={(e) => handleChange('endDate', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white" /></div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="couponActive" checked={form.active} onChange={(e) => handleChange('active', e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#c9a96e]" />
            <label htmlFor="couponActive" className="text-sm text-white/70">Active</label>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="px-5 py-2.5 text-xs text-white/40 hover:text-white/70">Cancel</button>
          <button onClick={() => onSave(form)} className="px-6 py-2.5 bg-[#c9a96e] text-black text-xs font-semibold uppercase rounded-lg hover:bg-[#dfc08a]">{coupon ? 'Save Changes' : 'Create'}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}