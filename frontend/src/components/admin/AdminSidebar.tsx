'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [returnCount, setReturnCount] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        const [ordersRes, usersRes, reviewsRes, returnsRes] = await Promise.allSettled([
          fetch(`${baseUrl}/api/orders`),
          fetch(`${baseUrl}/api/users`),
          fetch(`${baseUrl}/api/reviews?status=pending`),
          fetch(`${baseUrl}/api/returns?status=pending`),
        ]);
        
        if (ordersRes.status === 'fulfilled') {
          const ordersData = await ordersRes.value.json();
          const orders = ordersData.orders || ordersData || [];
          setOrderCount(Array.isArray(orders) ? orders.length : 0);
        }
        
        if (usersRes.status === 'fulfilled') {
          const usersData = await usersRes.value.json();
          const users = usersData.users || usersData || [];
          setCustomerCount(Array.isArray(users) ? users.length : 0);
        }
        
        if (reviewsRes.status === 'fulfilled') {
          const reviewsData = await reviewsRes.value.json();
          const reviews = reviewsData.reviews || reviewsData || [];
          setReviewCount(Array.isArray(reviews) ? reviews.length : 0);
        }
        
        if (returnsRes.status === 'fulfilled') {
          const returnsData = await returnsRes.value.json();
          const returns = returnsData.returns || returnsData || [];
          setReturnCount(Array.isArray(returns) ? returns.length : 0);
        }
      } catch (err) {
        console.error('Failed to fetch counts:', err);
      }
    }
    fetchCounts();
  }, []);

  const mainLinks = [
    { label: 'Dashboard', href: '/admin', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg> },
    { label: 'Products', href: '/admin/products', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg> },
    { label: 'Inventory', href: '/admin/inventory', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg> },
    { label: 'Categories', href: '/admin/categories', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> },
    { label: 'Orders', href: '/admin/orders', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></svg>, badge: orderCount > 0 ? orderCount : undefined },
    { label: 'Customers', href: '/admin/users', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>, badge: customerCount > 0 ? customerCount : undefined },
    { label: 'Reviews', href: '/admin/reviews', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 012.04 0l2.51 5.517a.562.562 0 01.84.331l-1.561 3.888a.562.562 0 01-.724.372l-1.922-1.422a.562.562 0 00-.676 0l-1.922 1.422a.562.562 0 01-.724-.372l-1.56-3.889a.562.562 0 01.84-.331l2.51 5.517zM12 21v-8.625m0 0a4.5 4.5 0 00-4.5 4.5V21h1" /></svg>, badge: reviewCount > 0 ? reviewCount : undefined },
    { label: 'Returns', href: '/admin/returns', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 15.75v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0110.5 12.75v-1.5a3.375 3.375 0 00-3.375-3.375H3.75M5.25 21h13.5a1.125 1.125 0 001.125-1.125V10.5a1.125 1.125 0 00-1.125-1.125H3.75a1.125 1.125 0 00-1.125 1.125v9.75a1.125 1.125 0 001.125 1.125z" /></svg>, badge: returnCount > 0 ? returnCount : undefined },
  ];

  const contentLinks = [
    { label: 'Banners', href: '/admin/banners', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003.75 21z" /></svg> },
    { label: 'Stories', href: '/admin/stories', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg> },
    { label: 'SEO', href: '/admin/seo', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg> },
    { label: 'Settings', href: '/admin/settings', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a7.725 7.725 0 010-.255c.008-.378-.137-.75-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { label: 'Roles', href: '/admin/roles', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.942 9.942 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c.342.243.682.421.918.703.24.204.544.285.919.233a3.03 3.03 0 001.807-2.252 9.942 9.942 0 01-3.741-.479m-5.813 2.252a3 3 0 00-4.682 2.72m.94-3.198l.031-.001c.342-.243.682-.421.918-.703.24-.204.544-.285.919-.233a3.03 3.03 0 001.807 2.252m-6.054 0a9.942 9.942 0 013.741.479 3 3 0 00-4.682-2.72m.94 3.198l-.001.031" /></svg> },
    { label: 'Team', href: '/admin/team', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg> },
  ];

  const isActive = (href: string) => href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <motion.aside animate={{ width: collapsed ? 72 : 260 }} className="hidden lg:flex flex-col h-screen bg-[#0c0c0c] border-r border-white/5 fixed left-0 top-0 z-40">
      <div className="h-16 flex items-center px-5 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a96e] to-[#8a6d3b] flex items-center justify-center"><span className="text-xs font-bold text-white">É</span></div>
          <AnimatePresence>{!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-white font-semibold">ÉLÉVATION</motion.span>}</AnimatePresence>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <p className="text-[10px] uppercase text-white/25 px-3 mb-2">{!collapsed && 'Main'}</p>
        {mainLinks.map((l) => {
          const active = isActive(l.href);
          return (
            <Link key={l.href} href={l.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg relative ${active ? 'bg-white/8 text-white' : 'text-white/40 hover:text-white/70'}`}>
              {active && <div className="absolute left-0 w-[3px] h-5 bg-[#c9a96e] rounded-r-full" />}
              <span className={active ? 'text-[#c9a96e]' : ''}>{l.icon}</span>
              <AnimatePresence>{!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm">{l.label}</motion.span>}</AnimatePresence>
              {(l as any).badge > 0 && !collapsed && <span className="ml-auto text-xs bg-[#c9a96e]/20 text-[#c9a96e] px-2 py-0.5 rounded-full">{(l as any).badge}</span>}
            </Link>
          );
        })}
        <p className="text-[10px] uppercase text-white/25 px-3 mt-6 mb-2">{!collapsed && 'Content'}</p>
        {contentLinks.map((l) => {
          const active = isActive(l.href);
          return (
            <Link key={l.href} href={l.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg relative ${active ? 'bg-white/8 text-white' : 'text-white/40 hover:text-white/70'}`}>
              {active && <div className="absolute left-0 w-[3px] h-5 bg-[#c9a96e] rounded-r-full" />}
              <span className={active ? 'text-[#c9a96e]' : ''}>{l.icon}</span>
              <AnimatePresence>{!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm">{l.label}</motion.span>}</AnimatePresence>
            </Link>
          );
        })}
        
        <button
          onClick={() => {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = '/admin/login';
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/40 hover:text-red-400 w-full mt-4"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 0010.5 21h3a2.25 2.25 0 002.25-2.25V15M12 9l-3-3m0 0l3 3m-3-3h12.75" /></svg>
          <AnimatePresence>{!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm">Logout</motion.span>}</AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}