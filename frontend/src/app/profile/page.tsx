'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ordersApi } from '@/lib/api';

const tabs = ['Orders', 'Addresses', 'Settings'];

const statusColors: Record<string, string> = {
  Delivered: 'text-emerald-400 bg-emerald-500/15',
  Shipped: 'text-blue-400 bg-blue-500/15',
  Processing: 'text-amber-400 bg-amber-500/15',
  Pending: 'text-amber-400 bg-amber-500/15',
  Cancelled: 'text-red-400 bg-red-500/15',
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Orders');
  const [user, setUser] = useState<{ name: string; email: string; phone: string }>({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [returnModal, setReturnModal] = useState<{ open: boolean; order: any }>({ open: false, order: null });
  const [returnForm, setReturnForm] = useState({ type: 'return', reasonCategory: '', reason: '', size: '', color: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Load user from localStorage
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      setUser({ name: 'Guest User', email: 'guest@elevation.com', phone: '+91 98765 43210' });
    }
    setLoading(false);

    // Fetch orders from API
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const data = await ordersApi.getAll();
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(user));
    alert('Profile saved!');
  };

  const formatPrice = (v: number) => `₹${v.toLocaleString('en-IN')}`;

  const reasonCategories = [
    'Wrong Size',
    'Wrong Color',
    'Defective Product',
    'Not as Described',
    'Better Price Elsewhere',
    'Changed Mind',
    'Other',
  ];

  const handleReturnRequest = (order: any) => {
    setReturnModal({ open: true, order });
    setReturnForm({ type: 'return', reasonCategory: '', reason: '', size: '', color: '' });
  };

  const submitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnForm.reasonCategory || !returnForm.reason) {
      alert('Please select a reason and describe the issue');
      return;
    }
    setSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/returns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: returnModal.order._id,
          orderId: returnModal.order.orderId,
          userName: user.name,
          userEmail: user.email,
          product: returnModal.order.items?.[0]?.name,
          productImage: returnModal.order.items?.[0]?.image,
          type: returnForm.type,
          reason: returnForm.reason,
          reasonCategory: returnForm.reasonCategory,
          description: returnForm.reason,
          refundAmount: returnModal.order.total,
          exchangeSize: returnForm.size,
          exchangeColor: returnForm.color,
          status: 'pending',
        }),
      });
      if (res.ok) {
        alert('Return/Exchange request submitted! We will review it shortly.');
        setReturnModal({ open: false, order: null });
      }
    } catch (err) {
      alert('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-28 pb-20 bg-midnight min-h-screen flex items-center justify-center">
          <div className="text-gold text-sm tracking-wider">Loading...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 bg-midnight min-h-screen">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-5 mb-10 pb-10 border-b border-white/5"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c9a96e]/30 to-[#c9a96e]/10 flex items-center justify-center">
              <span className="text-lg font-serif text-gold">{user.name?.charAt(0) || 'U'}</span>
            </div>
            <div>
              <h1 className="text-2xl font-serif text-pearl">{user.name}</h1>
              <p className="text-sm text-slate/40 mt-0.5">{user.email}</p>
            </div>
          </motion.div>

          <div className="flex gap-1 mb-8 border-b border-white/5">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-xs tracking-[0.15em] uppercase font-sans transition-all relative ${
                  activeTab === tab ? 'text-gold' : 'text-slate/40 hover:text-pearl/60'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="profile-tab" className="absolute bottom-0 left-0 right-0 h-px bg-gold" />
                )}
              </button>
            ))}
          </div>

          {activeTab === 'Orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {ordersLoading ? (
                <div className="text-slate/40 text-sm">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate/40">No orders yet</p>
                  <Link href="/" className="text-gold text-sm mt-2 inline-block">Start Shopping</Link>
                </div>
              ) : (
                orders.slice(0, 10).map((order: any, i: number) => (
                  <motion.div
                    key={order._id || order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-5 bg-white/[0.02] border border-white/5 rounded-lg hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-slate/50 font-mono">{order.orderId || order._id}</p>
                        <p className="text-sm text-pearl mt-0.5">{order.date}</p>
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${statusColors[order.status] || 'bg-white/10 text-white/50'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {order.items?.[0]?.image && (
                        <div className="w-12 h-12 rounded bg-white/5 overflow-hidden">
                          <img src={order.items[0].image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-pearl">{order.items?.[0]?.name || 'Product'}</p>
                        <p className="text-xs text-slate/40">Qty: {order.items?.[0]?.quantity || 1}</p>
                        {order.status === 'Delivered' && (
                          <button 
                            onClick={() => handleReturnRequest(order)}
                            className="text-xs text-gold hover:underline mt-1"
                          >
                            Request Return/Exchange
                          </button>
                        )}
                      </div>
                      <p className="text-sm font-medium text-pearl">{formatPrice(order.total)}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'Addresses' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-slate/40 text-sm">No addresses saved yet.</p>
            </motion.div>
          )}

          {activeTab === 'Settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-md">
              <div>
                <label className="text-xs text-slate/40 block mb-2">Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-lg text-pearl text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate/40 block mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-lg text-pearl text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate/40 block mb-2">Phone</label>
                <input
                  type="tel"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-lg text-pearl text-sm"
                />
              </div>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-gold text-black text-xs tracking-wider font-medium rounded-lg hover:bg-gold/90"
              >
                Save Changes
              </button>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />

      {/* Return Modal */}
      {returnModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setReturnModal({ open: false, order: null })} />
          <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-white">Request Return/Exchange</h2>
              <button onClick={() => setReturnModal({ open: false, order: null })} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={submitReturn}>
              <div className="mb-4">
                <label className="text-xs text-white/40 mb-2 block">Request Type</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setReturnForm({ ...returnForm, type: 'return' })} className={`flex-1 py-2 text-xs rounded ${returnForm.type === 'return' ? 'bg-blue-500/20 text-blue-400 border border-blue-500' : 'bg-white/5 text-white/40'}`}>Return</button>
                  <button type="button" onClick={() => setReturnForm({ ...returnForm, type: 'exchange' })} className={`flex-1 py-2 text-xs rounded ${returnForm.type === 'exchange' ? 'bg-purple-500/20 text-purple-400 border border-purple-500' : 'bg-white/5 text-white/40'}`}>Exchange</button>
                </div>
              </div>
              <div className="mb-4">
                <label className="text-xs text-white/40 mb-2 block">Reason</label>
                <select value={returnForm.reasonCategory} onChange={(e) => setReturnForm({ ...returnForm, reasonCategory: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white">
                  <option value="">Select a reason</option>
                  {reasonCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              {returnForm.type === 'exchange' && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Exchange Size</label>
                    <input type="text" value={returnForm.size} onChange={(e) => setReturnForm({ ...returnForm, size: e.target.value })} placeholder="Size" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-xs text-white" />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Color</label>
                    <input type="text" value={returnForm.color} onChange={(e) => setReturnForm({ ...returnForm, color: e.target.value })} placeholder="Color" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-xs text-white" />
                  </div>
                </div>
              )}
              <div className="mb-4">
                <label className="text-xs text-white/40 mb-2 block">Description</label>
                <textarea value={returnForm.reason} onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })} placeholder="Describe your issue..." className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white h-20 resize-none" />
              </div>
              <button type="submit" disabled={submitting} className="w-full py-3 text-xs uppercase tracking-wider bg-gold/10 border border-gold/40 text-gold hover:bg-gold/20 disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}