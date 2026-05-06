'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useCart } from '@/components/CartProvider';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, subtotal, savings } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  const formatPrice = (v: number) =>
    v.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  const shipping = subtotal > 15000 ? 0 : 499;
  const total = subtotal + shipping;

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 bg-theme min-h-screen">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <h1 className="font-serif text-4xl text-theme">Shopping Bag</h1>
            <p className="text-sm text-theme-muted mt-2">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>

          {items.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <svg className="w-16 h-16 mx-auto text-theme-muted mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <p className="text-lg text-theme-secondary font-serif mb-2">Your bag is empty</p>
              <p className="text-sm text-theme-muted mb-6">Start adding items to your bag</p>
              <Link href="/" className="inline-block px-8 py-3 bg-theme-button border border-theme-gold text-theme text-xs tracking-[0.2em] uppercase hover:bg-theme-button hover:border-gold transition-all rounded-lg">
                Continue Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {items.map((item, i) => (
                    <motion.div
                      key={`${item.id}-${item.size}-${item.color}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-5 bg-theme-card border border-theme rounded-lg p-4"
                    >
                      <Link href={`/product/${item.id}`} className="w-24 h-32 flex-shrink-0 rounded-md overflow-hidden bg-charcoal">
                        <div className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${item.image})` }} />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-[10px] tracking-[0.2em] uppercase text-gold/70 font-sans">{item.brand}</p>
                            <Link href={`/product/${item.productId}`} className="text-sm text-theme hover:text-gold transition-colors">{item.title}</Link>
                          </div>
                          <button onClick={() => removeItem(item.id, item.size, item.color)} className="text-theme-muted hover:text-red-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-[10px] text-theme-muted font-sans">
                          <span>Size: {item.size}</span>
                          <span>Color: {item.color}</span>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                              className="w-7 h-7 border border-theme-strong rounded-md flex items-center justify-center text-theme-tertiary hover:text-theme text-xs transition-colors"
                            >
                              -
                            </button>
                            <span className="text-sm text-theme w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                              className="w-7 h-7 border border-theme-strong rounded-md flex items-center justify-center text-theme-tertiary hover:text-theme text-xs transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-theme font-medium">{formatPrice(item.price * item.quantity)}</p>
                            {item.originalPrice > item.price && (
                              <p className="text-[10px] text-theme-muted line-through">{formatPrice(item.originalPrice * item.quantity)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-theme-card border border-theme rounded-lg p-6 h-fit sticky top-28"
              >
                <h2 className="text-sm font-medium text-theme mb-6">Order Summary</h2>

                <div className="space-y-3 text-sm font-sans">
                  <div className="flex justify-between text-theme-tertiary">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Savings</span>
                      <span>-{formatPrice(savings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-theme-tertiary">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-400' : ''}>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  <div className="border-t border-theme pt-3 flex justify-between text-theme font-medium">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    if (mounted) handleCheckout();
                  }}
                  href="/checkout"
                  className="block w-full py-4 mt-6 bg-gold/10 border border-gold/40 text-theme text-xs tracking-[0.2em] uppercase font-sans text-center hover:bg-gold/20 hover:border-gold transition-all rounded-lg"
                >
                  Proceed to Checkout
                </Link>

                <Link href="/" className="block text-center text-xs text-theme-muted hover:text-gold mt-4 transition-colors">
                  Continue Shopping
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
