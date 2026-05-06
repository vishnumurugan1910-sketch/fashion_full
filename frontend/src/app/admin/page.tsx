'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Stat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

interface RecentOrder {
  _id: string;
  orderId: string;
  name: string;
  email: string;
  products: { name: string; quantity: number }[];
  total: number;
  status: string;
  createdAt: string;
}

interface TopProduct {
  _id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  sales: number;
}

const statusColors: Record<string, string> = {
  Delivered: 'bg-emerald-500/15 text-emerald-400',
  Shipped: 'bg-blue-500/15 text-blue-400',
  Processing: 'bg-amber-500/15 text-amber-400',
  Pending: 'bg-white/10 text-white/50',
  Cancelled: 'bg-red-500/15 text-red-400',
};

function formatPrice(value: number): string {
  return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

function getMonth(index: number): string {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  return months[index] || '';
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState('7d');
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        const [ordersRes, productsRes, usersRes] = await Promise.allSettled([
          fetch(`${baseUrl}/api/orders`),
          fetch(`${baseUrl}/api/products`),
          fetch(`${baseUrl}/api/users`),
        ]);

        let orders: RecentOrder[] = [];
        let products: TopProduct[] = [];
        let users: any[] = [];

        if (ordersRes.status === 'fulfilled') {
          const ordersData = await ordersRes.value.json();
          orders = ordersData.orders || ordersData || [];
        }
        
        if (productsRes.status === 'fulfilled') {
          const productsData = await productsRes.value.json();
          products = productsData.products || productsData || [];
        }
        
        if (usersRes.status === 'fulfilled') {
          const usersData = await usersRes.value.json();
          users = usersData.users || usersData || [];
        }

      const totalRevenue = Array.isArray(orders) ? orders.reduce((sum: number, o: RecentOrder) => sum + (o.total || 0), 0) : 0;
      const orderCount = Array.isArray(orders) ? orders.length : 0;
      const productCount = Array.isArray(products) ? products.length : 0;
      const userCount = Array.isArray(users) ? users.length : 0;

        const newStats: Stat[] = [
          {
            label: 'Total Revenue',
            value: formatPrice(totalRevenue),
            change: '+12.5%',
            trend: 'up',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
            ),
          },
          {
            label: 'Orders',
            value: orderCount.toLocaleString('en-IN'),
            change: '+8.2%',
            trend: 'up',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            ),
          },
          {
            label: 'Products',
            value: productCount.toString(),
            change: '+24',
            trend: 'up',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
            ),
          },
          {
            label: 'Customers',
            value: userCount.toLocaleString('en-IN'),
            change: '+3.1%',
            trend: 'up',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            ),
          },
        ];

        const sortedOrders = [...orders].sort((a: RecentOrder, b: RecentOrder) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 5);

        const sortedProducts = [...products].sort((a: TopProduct, b: TopProduct) => 
          (b.sales || 0) - (a.sales || 0)
        ).slice(0, 4);

        setStats(newStats);
        setRecentOrders(sortedOrders);
        setTopProducts(sortedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, [period]);

  const chartData = [
    { month: 'Jul', value: 65 },
    { month: 'Aug', value: 78 },
    { month: 'Sep', value: 52 },
    { month: 'Oct', value: 91 },
    { month: 'Nov', value: 85 },
    { month: 'Dec', value: 98 },
    { month: 'Jan', value: 76 },
  ];

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-5 animate-pulse">
              <div className="h-10 w-10 bg-white/5 rounded-lg mb-4" />
              <div className="h-8 bg-white/10 rounded w-24 mb-2" />
              <div className="h-4 bg-white/5 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="text-sm text-white/40 mt-1">Welcome back, Admin</p>
        </div>
        <div className="flex items-center gap-2">
          {['7d', '30d', '90d'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                period === p
                  ? 'bg-[#c9a96e]/20 text-[#c9a96e]'
                  : 'text-white/40 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white/[0.03] border border-white/5 rounded-xl p-5 hover:bg-white/[0.05] transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/50">
                {stat.icon}
              </div>
              <span className="text-xs text-emerald-400 font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl font-semibold text-white">{stat.value}</p>
            <p className="text-xs text-white/35 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts + Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white/[0.03] border border-white/5 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-medium text-white">Revenue Overview</h2>
              <p className="text-xs text-white/30 mt-0.5">Monthly revenue trend</p>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="flex items-end gap-3 h-48">
            {chartData.map((item, i) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${item.value}%` }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full rounded-t-md bg-gradient-to-t from-[#c9a96e]/30 to-[#c9a96e]/60 relative group"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-white/10 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.value}%
                  </div>
                </motion.div>
                <span className="text-[10px] text-white/25">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
          <h2 className="text-sm font-medium text-white mb-4">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/70 truncate">{product.name}</p>
                  <p className="text-[10px] text-white/30">{product.sales || 0} sales</p>
                </div>
                <span className="text-xs text-[#c9a96e] font-medium">{formatPrice(product.price)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">Recent Orders</h2>
          <button className="text-xs text-[#c9a96e] hover:text-[#dfc08a] transition-colors">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Order ID', 'Customer', 'Product', 'Amount', 'Status'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-[10px] tracking-wider uppercase text-white/25 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-3.5 text-xs text-white/50 font-mono">{order.orderId || order._id.slice(-6)}</td>
                  <td className="px-6 py-3.5 text-xs text-white/70">{order.name}</td>
                  <td className="px-6 py-3.5 text-xs text-white/50">
                    {order.products?.map((p) => p.name).join(', ') || 'N/A'}
                  </td>
                  <td className="px-6 py-3.5 text-xs text-white font-medium">{formatPrice(order.total)}</td>
                  <td className="px-6 py-3.5">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${statusColors[order.status] || statusColors.Pending}`}>
                      {order.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
