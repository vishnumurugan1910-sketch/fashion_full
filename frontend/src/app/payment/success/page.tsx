'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId') || '';
  const orderId = searchParams.get('orderId') || '';
  const method = searchParams.get('method') || '';
  const isCOD = method === 'cod' || !paymentId;

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 bg-theme min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center"
          >
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="w-10 h-10 text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </motion.svg>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="font-serif text-3xl md:text-4xl text-theme tracking-tight mb-4">
              Order <span className="italic text-gold">Confirmed</span>
            </h1>
            <p className="text-sm text-theme-tertiary mb-8">
              {isCOD 
                ? 'Your order has been placed. Pay on delivery when the package arrives.' 
                : 'Thank you for your purchase. Your order has been placed successfully.'
              }
            </p>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-theme-card border border-theme rounded-lg p-5 mb-8 text-left"
          >
            {isCOD && (
              <div className="flex justify-between items-center py-2 border-b border-theme">
                <span className="text-[10px] tracking-wider uppercase text-theme-tertiary font-sans">Payment Method</span>
                <span className="text-xs text-gold font-medium">Cash on Delivery</span>
              </div>
            )}
            {orderId && !isCOD && (
              <div className="flex justify-between items-center py-2 border-b border-theme">
                <span className="text-[10px] tracking-wider uppercase text-theme-tertiary font-sans">Order ID</span>
                <span className="text-xs text-theme font-mono">{orderId.slice(0, 20)}...</span>
              </div>
            )}
            {paymentId && !isCOD && (
              <div className="flex justify-between items-center py-2">
                <span className="text-[10px] tracking-wider uppercase text-theme-tertiary font-sans">Payment ID</span>
                <span className="text-xs text-theme font-mono">{paymentId.slice(0, 20)}...</span>
              </div>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/profile"
              className="px-8 py-3.5 bg-gold/10 border border-gold/40 text-theme text-xs tracking-[0.2em] uppercase font-sans hover:bg-gold/20 hover:border-gold transition-all rounded-lg"
            >
              View Orders
            </Link>
            <Link
              href="/"
              className="px-8 py-3.5 border border-theme-strong text-theme-tertiary text-xs tracking-[0.2em] uppercase font-sans hover:text-theme hover:border-theme-gold transition-all rounded-lg"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <main className="pt-28 pb-20 bg-theme min-h-screen flex items-center justify-center">
        <p className="text-theme-muted text-sm">Loading...</p>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
