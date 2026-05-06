'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Address {
  label?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  isDefault?: boolean;
}

interface PurchaseHistory {
  orderId?: string;
  orderDate?: Date;
  total?: number;
  status?: string;
  items?: number;
}

interface User {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  roleId?: string;
  status?: string;
  orders?: number;
  spent?: number;
  loyaltyPoints?: number;
  totalSpent?: number;
  joined?: string;
  lastOrderDate?: string;
  addresses?: Address[];
  wishlist?: string[];
  purchaseHistory?: PurchaseHistory[];
  notes?: string;
  tags?: string[];
  createdAt?: string;
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-400',
  inactive: 'bg-white/10 text-white/30',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/users`);
      const data = await res.json();
      const userList = data.users || data || [];
      setUsers(userList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || 
                       u.email?.toLowerCase().includes(search.toLowerCase()) ||
                       u.phone?.includes(search);
    const matchFilter = filter === 'all' || u.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    repeatCustomers: users.filter(u => (u.orders || 0) > 1).length,
    revenue: users.reduce((sum, u) => sum + (u.totalSpent || u.spent || 0), 0),
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const formatPrice = (value: number) => 
    value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString() : '-';

  const isRepeatCustomer = (user: User) => (user.orders || 0) > 1;

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
          <h1 className="text-2xl font-semibold text-white">Customer Management</h1>
          <p className="text-sm text-white/40 mt-1">{users.length} total customers</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-semibold text-white">{stats.total}</p>
          <p className="text-xs text-white/40">Total Customers</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-semibold text-emerald-400">{stats.active}</p>
          <p className="text-xs text-white/40">Active</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-semibold text-[#c9a96e]">{stats.repeatCustomers}</p>
          <p className="text-xs text-white/40">Repeat Customers</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-semibold text-white">{formatPrice(stats.revenue)}</p>
          <p className="text-xs text-white/40">Total Revenue</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21 -5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/25 outline-none focus:border-[#c9a96e]/40"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as 'all' | 'active' | 'inactive')}
              className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                filter === s ? 'bg-[#c9a96e]/20 text-[#c9a96e]' : 'text-white/35 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Customer', 'Contact', 'Orders', 'Spent', 'Loyalty Points', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-wider uppercase text-white/25 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((user, i) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-medium text-sm">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-white">{user.name}</p>
                            {isRepeatCustomer(user) && (
                              <span className="text-[8px] px-1.5 py-0.5 bg-[#c9a96e]/20 text-[#c9a96e] rounded">REPEAT</span>
                            )}
                          </div>
                          <p className="text-[10px] text-white/30">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-white/50">{user.phone || '-'}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-white">
                      {user.orders || 0} orders
                    </td>
                    <td className="px-4 py-3 text-xs text-white font-medium">
                      {formatPrice(user.totalSpent || user.spent || 0)}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#c9a96e] font-medium">
                      {user.loyaltyPoints || 0} pts
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.status || 'active'}
                        onChange={(e) => updateUserStatus(user._id || '', e.target.value)}
                        className={`text-[10px] px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${statusColors[user.status || 'active']}`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/40">
                      {formatDate(user.joined)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleView(user)}
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
            <p className="text-sm text-white/25">No customers found</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && selectedUser && (
          <CustomerDetailModal
            user={selectedUser}
            onClose={() => { setModalOpen(false); setSelectedUser(null); }}
            formatPrice={formatPrice}
            formatDate={formatDate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CustomerDetailModal({
  user,
  onClose,
  formatPrice,
  formatDate,
}: {
  user: User;
  onClose: () => void;
  formatPrice: (v: number) => string;
  formatDate: (date?: string) => string;
}) {
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
          <h2 className="text-lg font-medium text-white">Customer Profile</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white text-2xl font-medium">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg text-white">{user.name}</h3>
              <p className="text-xs text-white/40">{user.email}</p>
              <p className="text-xs text-white/40">{user.phone || 'No phone'}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-lg text-white font-medium">{user.orders || 0}</p>
              <p className="text-[10px] text-white/40">Orders</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-lg text-white font-medium">{formatPrice(user.totalSpent || user.spent || 0)}</p>
              <p className="text-[10px] text-white/40">Spent</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-lg text-[#c9a96e] font-medium">{user.loyaltyPoints || 0}</p>
              <p className="text-[10px] text-white/40">Points</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-lg text-white font-medium">{(user.purchaseHistory || []).length}</p>
              <p className="text-[10px] text-white/40">Purchases</p>
            </div>
          </div>

          {/* Addresses */}
          {(user.addresses || []).length > 0 && (
            <div>
              <label className="text-xs text-white/40 mb-2 block">Saved Addresses</label>
              <div className="space-y-2">
                {user.addresses?.map((addr, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-white">{addr.label}</p>
                    <p className="text-xs text-white/50">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-xs text-white/30">{addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Purchase History */}
          {(user.purchaseHistory || []).length > 0 && (
            <div>
              <label className="text-xs text-white/40 mb-2 block">Purchase History</label>
              <div className="space-y-2">
                {user.purchaseHistory?.slice(0, 5).map((purchase, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <div>
                      <p className="text-xs text-white">{purchase.orderId}</p>
                      <p className="text-[10px] text-white/30">{purchase.orderDate ? formatDate(purchase.orderDate.toString()) : '-'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white font-medium">{formatPrice(purchase.total || 0)}</p>
                      <p className="text-[10px] text-white/30">{purchase.items} items</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wishlist Count */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Wishlist</label>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-white">{user.wishlist?.length || 0} items in wishlist</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="px-5 py-2.5 text-xs text-white/40 hover:text-white/70">Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
}