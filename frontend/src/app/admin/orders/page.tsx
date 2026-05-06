'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderItem {
  product?: string;
  name?: string;
  image?: string;
  price?: number;
  originalPrice?: number;
  quantity?: number;
  size?: string;
  color?: string;
  sku?: string;
}

interface Order {
  _id?: string;
  id?: string;
  orderId?: string;
  customer?: string;
  email?: string;
  phone?: string;
  address?: string | { street?: string; city?: string; state?: string; pincode?: string; country?: string };
  items?: OrderItem[];
  subtotal?: number;
  shipping?: number;
  tax?: number;
  discount?: number;
  couponCode?: string;
  total?: number;
  status?: string;
  payment?: string;
  paymentMethod?: string;
  paymentId?: string;
  paymentStatus?: string;
  invoiceNumber?: string;
  trackingNumber?: string;
  shippingCarrier?: string;
  cancellationReason?: string;
  cancelledDate?: string;
  returnReason?: string;
  refundAmount?: number;
  refundDate?: Date;
  notes?: string;
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

const statusColors: Record<string, string> = {
  Pending: 'bg-amber-500/15 text-amber-400',
  Processing: 'bg-blue-500/15 text-blue-400',
  Packed: 'bg-purple-500/15 text-purple-400',
  Shipped: 'bg-cyan-500/15 text-cyan-400',
  Delivered: 'bg-emerald-500/15 text-emerald-400',
  Cancelled: 'bg-red-500/15 text-red-400',
  Returned: 'bg-pink-500/15 text-pink-400',
};

const paymentStatusColors: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400',
  paid: 'bg-emerald-500/15 text-emerald-400',
  failed: 'bg-red-500/15 text-red-400',
  refunded: 'bg-purple-500/15 text-purple-400',
  partial_refunded: 'bg-orange-500/15 text-orange-400',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/orders`);
      const data = await res.json();
      const orderList = data.orders || data || [];
      setOrders(orderList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filtered = orders.filter((o) => {
    const matchFilter = filter === 'all' || o.status === filter;
    const matchSearch = o.orderId?.toLowerCase().includes(search.toLowerCase()) || 
                     o.customer?.toLowerCase().includes(search.toLowerCase()) ||
                     o.email?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length,
    revenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + (o.total || 0), 0),
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await fetchOrders();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus }),
      });
      await fetchOrders();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update payment status');
    }
  };

  const handlePaymentStatusChange = (orderId: string, newStatus: string) => {
    updatePaymentStatus(orderId, newStatus);
  };

  const handleCancel = async (orderId: string, reason: string) => {
    if (!reason) return alert('Please provide a cancellation reason');
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'Cancelled',
          cancellationReason: reason,
          cancelledDate: new Date().toISOString(),
          paymentStatus: 'refunded'
        }),
      });
      await fetchOrders();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel order');
    }
  };

  const handleRefund = async (orderId: string, amount: number, method: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentStatus: amount > 0 ? 'partial_refunded' : 'refunded',
          refundAmount: amount,
          refundDate: new Date().toISOString(),
          refundMethod: method,
          status: amount > 0 ? 'Cancelled' : 'Cancelled'
        }),
      });
      await fetchOrders();
      alert('Refund processed successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to process refund');
    }
  };

  const formatPrice = (value: number) => 
    value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

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
          <h1 className="text-2xl font-semibold text-white">Order Management</h1>
          <p className="text-sm text-white/40 mt-1">{orders.length} total orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-semibold text-white">{stats.total}</p>
          <p className="text-xs text-white/40">Total Orders</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-semibold text-amber-400">{stats.pending}</p>
          <p className="text-xs text-white/40">Pending</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-semibold text-cyan-400">{stats.shipped}</p>
          <p className="text-xs text-white/40">Shipped</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-semibold text-emerald-400">{stats.delivered}</p>
          <p className="text-xs text-white/40">Delivered</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-semibold text-red-400">{stats.cancelled}</p>
          <p className="text-xs text-white/40">Cancelled</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-semibold text-[#c9a96e]">{formatPrice(stats.revenue)}</p>
          <p className="text-xs text-white/40">Revenue</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21 -5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search by order ID, customer, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/25 outline-none focus:border-[#c9a96e]/40"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'Pending', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                filter === s ? 'bg-[#c9a96e]/20 text-[#c9a96e]' : 'text-white/35 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Payment', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-wider uppercase text-white/25 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((order, i) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-xs text-white font-mono">{order.orderId}</p>
                        <p className="text-[10px] text-white/30">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-white">{order.customer}</p>
                      <p className="text-[10px] text-white/30">{order.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/50">
                      {(order.items || []).length} item(s)
                    </td>
                    <td className="px-4 py-3 text-xs text-white font-medium">
                      {formatPrice(order.total || 0)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id || '', e.target.value)}
                        className={`text-[10px] px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${statusColors[order.status || 'Pending']}`}
                      >
                        {['Pending', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.paymentStatus || 'pending'}
                        onChange={(e) => handlePaymentStatusChange(order._id || '', e.target.value)}
                        className={`text-[10px] px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${paymentStatusColors[order.paymentStatus || 'pending']}`}
                      >
                        {['pending', 'paid', 'failed', 'refunded', 'partial_refunded'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/40">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleView(order)}
                        className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.736 12 4c4.878 4.078 8.754 7.9 9.584 11.959a1.012 1.012 0 010 .639C20.577 16.49 16.64 19.24 12 19c-4.878-4.078-8.754-7.9-9.584-11.959z" />
                        </svg>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-white/25">No orders found</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => { setModalOpen(false); setSelectedOrder(null); }}
            onUpdateStatus={updateStatus}
            onCancel={handleCancel}
            onRefund={handleRefund}
            formatPrice={formatPrice}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
  onCancel,
  onRefund,
  formatPrice,
}: {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  onCancel: (id: string, reason: string) => void;
  onRefund: (id: string, amount: number, method: string) => void;
  formatPrice: (v: number) => string;
}) {
  const [cancelReason, setCancelReason] = useState('');
  const [refundAmount, setRefundAmount] = useState(order.total || 0);
  const [refundMethod, setRefundMethod] = useState('original');
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || '');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingCarrier, setShippingCarrier] = useState('');

  const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString() : '-';

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
        className="relative w-full max-w-3xl max-h-[85vh] bg-[#111] border border-white/10 rounded-2xl overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h2 className="text-lg font-medium text-white">Order Details</h2>
            <p className="text-xs text-white/40">{order.orderId}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status & Payment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 mb-2 block">Order Status</label>
              <select
                value={order.status}
                onChange={(e) => onUpdateStatus(order._id || '', e.target.value)}
                className={`w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm ${statusColors[order.status || 'Pending']}`}
              >
                {['Pending', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-2 block">Payment Status</label>
              <div className={`w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm ${paymentStatusColors[order.paymentStatus || 'pending']}`}>
                {order.paymentStatus || 'pending'}
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Customer Information</label>
            <div className="bg-white/5 rounded-lg p-4 space-y-2">
              <p className="text-sm text-white">{order.customer}</p>
              <p className="text-xs text-white/50">{order.email}</p>
              <p className="text-xs text-white/50">{order.phone}</p>
              {typeof order.address === 'object' && order.address?.street && (
                <p className="text-xs text-white/50">
                  {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                </p>
              )}
            </div>
          </div>

          {/* Items */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Order Items</label>
            <div className="space-y-2">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                  <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white">{item.name}</p>
                    <p className="text-[10px] text-white/40">Qty: {item.quantity} | Size: {item.size} | Color: {item.color}</p>
                  </div>
                  <p className="text-xs text-white">{formatPrice((item.price || 0) * (item.quantity || 0))}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/40">Subtotal</p>
              <p className="text-white/40">Shipping</p>
              <p className="text-white/40">Tax</p>
              <p className="text-white/40">Discount</p>
              <p className="text-white font-medium">Total</p>
            </div>
            <div className="text-right">
              <p className="text-white">{formatPrice(order.subtotal || 0)}</p>
              <p className="text-white">{formatPrice(order.shipping || 0)}</p>
              <p className="text-white">{formatPrice(order.tax || 0)}</p>
              <p className="text-emerald-400">-{formatPrice(order.discount || 0)}</p>
              <p className="text-white font-medium">{formatPrice(order.total || 0)}</p>
            </div>
          </div>

          {/* Shipping Info */}
          {order.status === 'Packed' && (
            <div className="flex gap-2">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Tracking Number"
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
              />
              <input
                type="text"
                value={shippingCarrier}
                onChange={(e) => setShippingCarrier(e.target.value)}
                placeholder="Carrier"
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
              />
            </div>
          )}

          {/* Cancel Order */}
          {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
            <div>
              <label className="text-xs text-white/40 mb-2 block">Cancel Order</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Cancellation reason"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                />
                <button
                  onClick={() => onCancel(order._id || '', cancelReason)}
                  disabled={!cancelReason}
                  className="w-full py-2 bg-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/30 disabled:opacity-50"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          )}

          {/* Refund */}
          {order.paymentStatus === 'paid' && (order.status === 'Cancelled' || order.status === 'Delivered') && (
            <div>
              <label className="text-xs text-white/40 mb-2 block">Process Refund</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                />
                <select
                  value={refundMethod}
                  onChange={(e) => setRefundMethod(e.target.value)}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                >
                  <option value="original">Original Payment</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              <button
                onClick={() => onRefund(order._id || '', refundAmount, refundMethod)}
                className="mt-3 w-full py-2 bg-purple-500/20 text-purple-400 text-xs rounded-lg hover:bg-purple-500/30"
              >
                Process Refund
              </button>
            </div>
          )}

          {/* Admin Notes */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Admin Notes</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal notes..."
              rows={2}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="px-5 py-2.5 text-xs text-white/40 hover:text-white/70">Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
}