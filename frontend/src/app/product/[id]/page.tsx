'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useCart } from '@/components/CartProvider';

interface Review {
  _id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  description: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  details: string[];
  category: string;
}

export default function ProductPage() {
  const params = useParams();
  const id = (params?.id as string) || '';
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', userName: '' });
  const [submitting, setSubmitting] = useState(false);
  const { addItem } = useCart();

  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        const [productRes, reviewsRes] = await Promise.all([
          fetch(`${baseUrl}/api/products/${id}`),
          fetch(`${baseUrl}/api/reviews?status=approved`)
        ]);
        
        if (!productRes.ok) {
          console.error('Product not found');
          setLoading(false);
          return;
        }
        
        const productData = await productRes.json();
        const reviewsData = await reviewsRes.json();
        
        setProduct(productData);
        setReviews(reviewsData.reviews || reviewsData || []);
        setReviewCount(reviewsData.reviews?.length || reviewsData?.length || 0);
      } catch (err) {
        console.error('Failed to fetch:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    const colorName = product?.colors?.[selectedColor]?.name || '';
    addItem({
      id: `${product?._id || id}-${selectedSize}-${colorName}`.toLowerCase(),
      productId: product?._id || id,
      title: product?.name || '',
      brand: product?.brand || '',
      price: product?.price || 0,
      originalPrice: product?.originalPrice || 0,
      image: product?.image || '',
      size: selectedSize,
      color: colorName,
    }, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim() || !newReview.userName.trim()) {
      alert('Please fill in your name and review');
      return;
    }
    setSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: id,
          productName: product?.name,
          productImage: product?.image,
          userName: newReview.userName,
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=60',
          rating: newReview.rating,
          comment: newReview.comment,
          status: 'pending',
          date: new Date().toISOString().split('T')[0],
        }),
      });
      if (res.ok) {
        alert('Review submitted! It will appear after moderation.');
        setShowReviewForm(false);
        setNewReview({ rating: 5, comment: '', userName: '' });
      }
    } catch (err) {
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-midnight">
        <Navbar />
        <main className="pt-28 pb-20">
          <div className="text-center text-pearl">Product not found</div>
        </main>
      </div>
    );
  }

  const images = product.images || [product.image];
  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const details = product.details || [];
  
  const discount = product.originalPrice > 0
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-midnight">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate/50 mb-10">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/category/${product.category}`} className="hover:text-gold transition-colors">{product.category}</Link>
            <span>/</span>
            <span className="text-pearl/60">{product.brand}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-[3/4] rounded-sm overflow-hidden bg-charcoal"
              >
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ backgroundImage: `url(${images[selectedImage]})` }} 
                />
              </motion.div>
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-24 rounded-sm overflow-hidden bg-charcoal transition-all ${
                      selectedImage === i ? 'ring-2 ring-gold' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Brand & Name */}
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-slate/50 mb-2 font-sans">{product.brand}</p>
                <h1 className="text-3xl font-serif text-pearl">{product.name}</h1>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-2xl text-pearl font-sans">₹{product.price?.toLocaleString('en-IN')}</span>
                {product.originalPrice > 0 && (
                  <>
                    <span className="text-lg text-slate/50 line-through font-sans">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-sans">-{discount}%</span>
                  </>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star} 
                      className={`w-4 h-4 ${star <= Math.round(Number(avgRating)) ? 'text-gold' : 'text-white/10'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-slate/40">({reviews.length} reviews)</span>
              </div>

              {/* Colors */}
              {colors.length > 0 && (
                <div>
                  <p className="text-xs text-slate/60 mb-3 font-sans">Color</p>
                  <div className="flex gap-2">
                    {colors.map((color, i) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(i)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === i ? 'border-gold scale-110' : 'border-white/10'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {sizes.length > 0 && (
                <div>
                  <p className="text-xs text-slate/60 mb-3 font-sans">Size</p>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2.5 text-xs tracking-wider uppercase font-sans border rounded-sm transition-all ${
                          selectedSize === size
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-white/10 text-slate hover:text-pearl hover:border-white/30'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="text-xs text-slate/60 mb-3 font-sans">Quantity</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-white/10 rounded-sm flex items-center justify-center text-slate hover:text-pearl transition-colors"
                  >
                    -
                  </button>
                  <span className="text-pearl font-sans w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-white/10 rounded-sm flex items-center justify-center text-slate hover:text-pearl transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 text-xs tracking-[0.2em] uppercase font-sans text-center transition-all rounded-sm ${
                    addedToCart
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                      : 'bg-gold/10 border border-gold/40 text-pearl hover:bg-gold/20'
                  }`}
                >
                  {addedToCart ? '✓ Added to Bag' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className={`w-14 h-14 border rounded-sm flex items-center justify-center transition-all ${
                    wishlisted ? 'border-gold bg-gold/10' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <svg 
                    className="w-5 h-5" 
                    viewBox="0 0 24 24" 
                    fill={wishlisted ? '#c9a96e' : 'none'} 
                    stroke={wishlisted ? '#c9a96e' : 'currentColor'} 
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </button>
              </div>

              {/* Description */}
              <div className="pt-6 border-t border-white/5">
                <p className="text-sm text-champagne/60 font-sans leading-relaxed">
                  {product.description || 'Premium quality product.'}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-2">
                {details.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate/50 font-sans">
                    <span className="w-1 h-1 bg-gold/40 rounded-full" />
                    {d}
                  </div>
                ))}
              </div>

              {/* Reviews */}
              <div className="pt-6 border-t border-white/5">
                <p className="text-sm text-pearl font-sans mb-4">Customer Reviews ({reviews.length})</p>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.slice(0, 3).map((review) => (
                      <div key={review._id} className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-white/10 overflow-hidden">
                            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${review.userAvatar})` }} />
                          </div>
                          <span className="text-xs text-pearl">{review.userName}</span>
                          <span className="text-xs text-slate/40">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg 
                              key={star} 
                              className={`w-3 h-3 ${star <= review.rating ? 'text-gold' : 'text-white/10'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-xs text-champagne/70">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate/40">No reviews yet. Be the first to review this product!</p>
                )}
                
                {/* Write Review Button */}
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="mt-4 px-4 py-2 text-xs border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
                >
                  Write a Review
                </button>
                
                {/* Review Form Modal */}
                {showReviewForm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowReviewForm(false)} />
                    <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-white">Write a Review</h3>
                        <button onClick={() => setShowReviewForm(false)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <form onSubmit={handleSubmitReview}>
                        <div className="mb-4">
                          <label className="text-xs text-white/40 mb-2 block">Your Name</label>
                          <input
                            type="text"
                            value={newReview.userName}
                            onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-gold/40"
                            placeholder="Enter your name"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="text-xs text-white/40 mb-2 block">Rating</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                className="p-1"
                              >
                                <svg 
                                  className={`w-6 h-6 ${star <= newReview.rating ? 'text-gold' : 'text-white/10'}`} 
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="text-xs text-white/40 mb-2 block">Your Review</label>
                          <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-gold/40 h-24 resize-none"
                            placeholder="Share your experience with this product..."
                          />
                        </div>
                        
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full py-3 text-xs uppercase tracking-wider bg-gold/10 border border-gold/40 text-gold hover:bg-gold/20 disabled:opacity-50"
                        >
                          {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}