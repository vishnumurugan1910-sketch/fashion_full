'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useCart } from '@/components/CartProvider';

/* ─── Razorpay types ─── */
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutSettings {
  payment: {
    razorpay: { keyId: string; keySecret: string; isActive: boolean };
    cod: { isActive: boolean; minimumOrder: number; maximumOrder: number; charges: number };
  };
  shipping: {
    freeShippingAbove: number;
    defaultCharge: number;
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<CheckoutSettings | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [paymentError, setPaymentError] = useState('');
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/settings`);
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        if (data.payment?.razorpay?.isActive) {
          setPaymentMethod('razorpay');
        } else if (data.payment?.cod?.isActive) {
          setPaymentMethod('cod');
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const formatPrice = (v: number) =>
    v.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  const isFreeShipping = settings?.shipping?.freeShippingAbove && subtotal >= settings.shipping.freeShippingAbove;
  const shippingCost = isFreeShipping ? 0 : (settings?.shipping?.defaultCharge || 499);
  const codCharges = paymentMethod === 'cod' ? (settings?.payment?.cod?.charges || 0) : 0;
  const total = subtotal + shippingCost + codCharges;

  const canUseCOD = settings?.payment?.cod?.isActive && 
    total >= (settings.payment.cod.minimumOrder || 0) && 
    total <= (settings.payment.cod.maximumOrder || Infinity);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async (method: string, paymentId?: string, razorpayOrderId?: string) => {
    const orderItems = cartItems.map((item: any) => ({
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: address.fullName,
        email: address.email,
        phone: address.phone,
        address: `${address.addressLine}, ${address.city}, ${address.state} - ${address.pincode}`,
        items: orderItems,
        subtotal,
        shipping: shippingCost,
        tax: 0,
        discount: 0,
        total: total + codCharges,
        status: method === 'cod' ? 'Pending' : 'Processing',
        payment: method === 'cod' ? 'Pending' : 'Paid',
        paymentMethod: method === 'cod' ? 'COD' : 'Online',
        paymentId: paymentId || '',
        orderId: razorpayOrderId || `order_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
      }),
    });
  };

  const handleCODOrder = async () => {
    setLoading(true);
    setPaymentError('');
    try {
      await createOrder('COD');
      clearCart();
      router.push('/payment/success?method=cod');
    } catch (error: any) {
      setPaymentError(error.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    setLoading(true);
    setPaymentError('');

    try {
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          receipt: `order_${Date.now()}`,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      if (orderData.demo) {
        const mockPaymentId = `pay_demo_${Date.now()}`;
        const mockOrderId = orderData.id;

        const verifyRes = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: mockOrderId,
            razorpay_payment_id: mockPaymentId,
            razorpay_signature: 'demo_signature',
          }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          await createOrder('Online', mockPaymentId, mockOrderId);
          clearCart();
          router.push(`/payment/success?paymentId=${mockPaymentId}&orderId=${mockOrderId}`);
        } else {
          throw new Error('Payment verification failed');
        }
        setLoading(false);
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) {
        throw new Error('Failed to load payment gateway');
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ÉLÉVATION',
        description: `Order for ${cartItems.length} items`,
        order_id: orderData.id,
        prefill: {
          name: address.fullName,
          email: address.email,
          contact: address.phone,
        },
        theme: { color: '#c9a96e' },
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            await createOrder('Online', response.razorpay_payment_id, response.razorpay_order_id);
            clearCart();
            router.push(`/payment/success?paymentId=${response.razorpay_payment_id}&orderId=${response.razorpay_order_id}`);
          } else {
            setPaymentError('Payment verification failed');
          }
          setLoading(false);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        setPaymentError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      razorpay.open();
    } catch (error: any) {
      setPaymentError(error.message || 'Payment failed');
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'cod') {
      handleCODOrder();
    } else {
      handleOnlinePayment();
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 bg-theme min-h-screen">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-theme-tertiary mb-8">
            <Link href="/cart" className="hover:text-gold transition-colors">Cart</Link>
            <span>/</span>
            <span className="text-theme-secondary">Checkout</span>
          </nav>

          {/* Steps */}
          <div className="flex items-center gap-4 mb-10">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-gold' : 'text-theme-muted'}`}>
              <span className={`w-6 h-6 rounded-full text-[10px] font-semibold flex items-center justify-center ${step >= 1 ? 'bg-gold text-black' : 'bg-theme-input'}`}>1</span>
              <span className="text-xs tracking-wider uppercase font-sans">Address</span>
            </div>
            <span className={`w-8 h-px ${step >= 2 ? 'bg-gold' : 'bg-theme'}`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-gold' : 'text-theme-muted'}`}>
              <span className={`w-6 h-6 rounded-full text-[10px] font-semibold flex items-center justify-center ${step >= 2 ? 'bg-gold text-black' : 'bg-theme-input'}`}>2</span>
              <span className="text-xs tracking-wider uppercase font-sans">Payment</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleAddressSubmit}
                  className="space-y-5"
                >
                  <h2 className="text-lg font-serif text-theme mb-6">Shipping Address</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-theme-tertiary mb-1.5 block">Full Name *</label>
                      <input required value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} className="w-full px-4 py-3 bg-theme-input border border-theme-strong rounded-lg text-sm text-theme outline-none focus:border-gold/40 transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs text-theme-tertiary mb-1.5 block">Phone *</label>
                      <input required type="tel" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="w-full px-4 py-3 bg-theme-input border border-theme-strong rounded-lg text-sm text-theme outline-none focus:border-gold/40 transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-theme-tertiary mb-1.5 block">Email *</label>
                    <input required type="email" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} className="w-full px-4 py-3 bg-theme-input border border-theme-strong rounded-lg text-sm text-theme outline-none focus:border-gold/40 transition-colors" />
                  </div>

                  <div>
                    <label className="text-xs text-theme-tertiary mb-1.5 block">Address *</label>
                    <input required value={address.addressLine} onChange={(e) => setAddress({ ...address, addressLine: e.target.value })} className="w-full px-4 py-3 bg-theme-input border border-theme-strong rounded-lg text-sm text-theme outline-none focus:border-gold/40 transition-colors" placeholder="Street address, apartment, etc." />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-theme-tertiary mb-1.5 block">City *</label>
                      <input required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full px-4 py-3 bg-theme-input border border-theme-strong rounded-lg text-sm text-theme outline-none focus:border-gold/40 transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs text-theme-tertiary mb-1.5 block">State *</label>
                      <input required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="w-full px-4 py-3 bg-theme-input border border-theme-strong rounded-lg text-sm text-theme outline-none focus:border-gold/40 transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs text-theme-tertiary mb-1.5 block">Pincode *</label>
                      <input required value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="w-full px-4 py-3 bg-theme-input border border-theme-strong rounded-lg text-sm text-theme outline-none focus:border-gold/40 transition-colors" />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-4 bg-gold/10 border border-gold/40 text-theme text-xs tracking-[0.2em] uppercase font-sans hover:bg-gold/20 hover:border-gold transition-all rounded-lg mt-4">
                    Continue to Payment
                  </button>
                </motion.form>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-lg font-serif text-theme mb-6">Payment</h2>

                  {/* Address Summary */}
                  <div className="bg-theme-card border border-theme rounded-lg p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] tracking-wider uppercase text-gold/60 font-sans">Shipping To</span>
                      <button onClick={() => setStep(1)} className="text-[10px] text-theme-tertiary hover:text-gold transition-colors">Edit</button>
                    </div>
                    <p className="text-sm text-theme">{address.fullName}</p>
                    <p className="text-xs text-theme-tertiary mt-1">{address.addressLine}, {address.city}, {address.state} - {address.pincode}</p>
                    <p className="text-xs text-theme-tertiary">{address.phone} · {address.email}</p>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-3">
                    <p className="text-[10px] tracking-wider uppercase text-gold/60 font-sans">Payment Method</p>
                    
                    {settings?.payment?.razorpay?.isActive && (
                      <button
                        onClick={() => setPaymentMethod('razorpay')}
                        className={`w-full p-4 rounded-lg border flex items-center gap-3 transition-all ${paymentMethod === 'razorpay' ? 'border-gold bg-gold/5' : 'border-theme hover:border-gold/40'}`}
                      >
                        <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                          <span className="text-[8px] font-bold text-blue-800">RZP</span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-theme font-medium">Online Payment</p>
                          <p className="text-[10px] text-theme-tertiary">Cards, UPI, Netbanking, Wallets</p>
                        </div>
                        {paymentMethod === 'razorpay' && (
                          <svg className="w-5 h-5 text-gold ml-auto" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        )}
                      </button>
                    )}

                    {canUseCOD && (
                      <button
                        onClick={() => setPaymentMethod('cod')}
                        className={`w-full p-4 rounded-lg border flex items-center gap-3 transition-all ${paymentMethod === 'cod' ? 'border-gold bg-gold/5' : 'border-theme hover:border-gold/40'}`}
                      >
                        <div className="w-10 h-6 bg-gold rounded flex items-center justify-center">
                          <span className="text-[8px] font-bold text-black">COD</span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-theme font-medium">Cash on Delivery</p>
                          <p className="text-[10px] text-theme-tertiary">
                            Pay {formatPrice(codCharges)} on delivery {!canUseCOD && '(Not available for this order amount)'}
                          </p>
                        </div>
                        {paymentMethod === 'cod' && (
                          <svg className="w-5 h-5 text-gold ml-auto" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Error Message */}
                  {paymentError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <p className="text-xs text-red-400">{paymentError}</p>
                    </div>
                  )}

                  {/* Demo Mode Info */}
                  {paymentMethod === 'razorpay' && (
                    <div className="bg-gold/5 border border-gold/15 rounded-lg p-4">
                      <p className="text-[10px] tracking-wider uppercase text-gold/70 font-sans mb-2">Secure Payment</p>
                      <p className="text-xs text-theme-tertiary">You will be redirected to Razorpay to complete payment securely.</p>
                    </div>
                  )}

                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full py-4 bg-gold text-black text-xs tracking-[0.2em] uppercase font-sans font-semibold hover:bg-gold-light transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
                  </button>
                </motion.div>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-theme-card border border-theme rounded-lg p-6 sticky top-28">
                <h3 className="text-sm font-medium text-theme mb-5">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
                      <div className="w-14 h-18 rounded-md overflow-hidden bg-charcoal flex-shrink-0">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gold/60 font-sans uppercase tracking-wider">{item.brand}</p>
                        <p className="text-xs text-theme line-clamp-1">{item.title}</p>
                        <p className="text-[10px] text-theme-muted mt-0.5">{item.size} · {item.color}</p>
                        <p className="text-xs text-theme font-medium mt-1">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-theme pt-4 space-y-2 text-sm font-sans">
                  <div className="flex justify-between text-theme-tertiary">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-theme-tertiary">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? 'text-emerald-400' : ''}>
                      {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  {codCharges > 0 && (
                    <div className="flex justify-between text-theme-tertiary">
                      <span>COD Charges</span>
                      <span>{formatPrice(codCharges)}</span>
                    </div>
                  )}
                  <div className="border-t border-theme pt-3 flex justify-between text-theme font-medium">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
