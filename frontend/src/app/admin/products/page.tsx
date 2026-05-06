'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productsApi, categoriesApi, Product } from '@/lib/api';

type ProductStatus = Product['status'];

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-400',
  draft: 'bg-amber-500/15 text-amber-400',
  archived: 'bg-white/10 text-white/30',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productsApi.getAll(),
        categoriesApi.getAll()
      ]);
      setProducts(productsData.products || []);
      const cats = categoriesData.categories || [];
      setCategories(['All', ...cats.map((c: { name: string }) => c.name)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = products.filter((p) => {
    const matchCategory = filter === 'All' || p.category?.toLowerCase() === filter.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsApi.delete(id);
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleSave = async (product: Product) => {
    try {
      const productData = {
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        stock: product.stock,
        status: product.status,
        image: product.image,
        images: product.images || [],
        sizes: product.sizes || [],
        colors: product.colors || [],
        description: product.description || '',
        details: product.details || [],
        sku: product.sku || undefined,
      };

      if (editingProduct?._id) {
        await productsApi.update(editingProduct._id, productData);
      } else {
        await productsApi.create(productData);
      }
      await fetchData();
      setModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save product');
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
        <button onClick={fetchData} className="mt-4 px-4 py-2 bg-[#c9a96e] text-black rounded-lg text-sm">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Products</h1>
          <p className="text-sm text-white/40 mt-1">{products.length} total products</p>
        </div>
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c9a96e] text-black text-xs font-semibold tracking-wider uppercase rounded-lg hover:bg-[#dfc08a] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/25 outline-none focus:border-[#c9a96e]/40 transition-colors" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1.5 text-[11px] rounded-md transition-all ${filter === cat ? 'bg-[#c9a96e]/20 text-[#c9a96e]' : 'text-white/35 hover:text-white/60 hover:bg-white/5'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Product', 'Category', 'Price', 'Sizes', 'Colors', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-[10px] tracking-wider uppercase text-white/25 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((product, i) => (
                  <motion.tr key={product._id || product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.03 }} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }} />
                        </div>
                        <div>
                          <p className="text-sm text-white/80">{product.name}</p>
                          <p className="text-[10px] text-white/30">{product.brand} · {product.sku || product._id?.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-white/40">{product.category}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-white font-medium">₹{product.price?.toLocaleString()}</p>
                      {product.originalPrice ? <p className="text-[10px] text-white/25 line-through">₹{product.originalPrice.toLocaleString()}</p> : null}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {(product.sizes || []).slice(0, 3).map((s) => (
                          <span key={s} className="px-1.5 py-0.5 bg-white/5 rounded text-[9px] text-white/50">{s}</span>
                        ))}
                        {(product.sizes || []).length > 3 && <span className="text-[9px] text-white/30">+{((product.sizes || []).length - 3)}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {(product.colors || []).slice(0, 4).map((c) => (
                          <span key={c.name} className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: c.hex }} title={c.name} />
                        ))}
                        {(product.colors || []).length > 4 && <span className="text-[9px] text-white/30">+{((product.colors || []).length - 4)}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs ${product.stock === 0 ? 'text-red-400' : 'text-white/50'}`}>
                        {product.stock === 0 ? 'Out of stock' : `${product.stock} units`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${statusStyles[product.status]}`}>{product.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(product)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(product._id || '')} className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/40 hover:text-red-400">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="py-16 text-center"><p className="text-sm text-white/25">No products found</p></div>}
      </div>

      <AnimatePresence>
        {modalOpen && <ProductModal product={editingProduct} onClose={() => setModalOpen(false)} onSave={handleSave} categories={categories} />}
      </AnimatePresence>
    </div>
  );
}

function ProductModal({ product, onClose, onSave, categories }: { product: Product | null; onClose: () => void; onSave: (p: Product) => void; categories: string[] }) {
  const [form, setForm] = useState<Product>(() => product || { 
    name: '', 
    brand: '', 
    category: categories[1] || 'Women', 
    price: 0, 
    originalPrice: 0, 
    stock: 0, 
    status: 'draft', 
    image: '',
    images: [],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [],
    description: '',
    details: []
  });
  const [imagePreview, setImagePreview] = useState(form.image);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>(form.images || []);
  const [uploading, setUploading] = useState(false);
  const [newSize, setNewSize] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newDetail, setNewDetail] = useState('');
  
  useEffect(() => {
    if (product) {
      setForm(product);
      setImagePreview(product.image || '');
      setAdditionalPreviews(product.images || []);
      setNewSize('');
      setNewColorName('');
      setNewColorHex('#000000');
      setNewDetail('');
    }
  }, [product]);

  const handleChange = (field: keyof Product, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const { uploadApi } = await import('@/lib/api');
        const result = await uploadApi.product(file);
        const imageUrl = result.url;
        setImagePreview(imageUrl);
        setForm((prev) => ({ ...prev, image: imageUrl }));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleAdditionalImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      const { uploadApi } = await import('@/lib/api');
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const result = await uploadApi.product(files[i]);
        newImages.push(result.url);
      }
      const updated = [...additionalPreviews, ...newImages];
      setAdditionalPreviews(updated);
      setForm((prev) => ({ ...prev, images: updated }));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeAdditionalImage = (index: number) => {
    const updated = additionalPreviews.filter((_, i) => i !== index);
    setAdditionalPreviews(updated);
    setForm((prev) => ({ ...prev, images: updated }));
  };

  const addSize = () => {
    if (!newSize.trim()) return;
    const sizes = form.sizes || [];
    if (!sizes.includes(newSize.trim().toUpperCase())) {
      setForm((prev) => ({ ...prev, sizes: [...sizes, newSize.trim().toUpperCase()] }));
    }
    setNewSize('');
  };

  const removeSize = (size: string) => {
    setForm((prev) => ({ ...prev, sizes: (prev.sizes || []).filter((s) => s !== size) }));
  };

  const addColor = () => {
    if (!newColorName.trim()) return;
    const colors = form.colors || [];
    if (!colors.find((c) => c.name.toLowerCase() === newColorName.toLowerCase())) {
      setForm((prev) => ({ ...prev, colors: [...colors, { name: newColorName.trim(), hex: newColorHex }] }));
    }
    setNewColorName('');
  };

  const removeColor = (name: string) => {
    setForm((prev) => ({ ...prev, colors: (prev.colors || []).filter((c) => c.name !== name) }));
  };

  const addDetail = () => {
    if (!newDetail.trim()) return;
    const details = form.details || [];
    if (!details.includes(newDetail.trim())) {
      setForm((prev) => ({ ...prev, details: [...details, newDetail.trim()] }));
    }
    setNewDetail('');
  };

  const removeDetail = (detail: string) => {
    setForm((prev) => ({ ...prev, details: (prev.details || []).filter((d) => d !== detail) }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-3xl max-h-[90vh] bg-[#111] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-medium text-white">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Image */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Main Product Image</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg bg-white/5 border border-dashed border-white/15 flex items-center justify-center overflow-hidden">
                {imagePreview ? <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagePreview})` }} /> : <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>}
              </div>
              <label className={`px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white/50 hover:text-white/80 hover:bg-white/8 transition-all cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>

          {/* Additional Images */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Additional Images (Gallery)</label>
            <div className="flex flex-wrap gap-3">
              {additionalPreviews.map((img, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg bg-white/5 overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
                  <button onClick={() => removeAdditionalImage(i)} className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-bl-lg flex items-center justify-center text-white text-xs">×</button>
                </div>
              ))}
              <label className="w-16 h-16 rounded-lg bg-white/5 border border-dashed border-white/15 flex items-center justify-center cursor-pointer hover:border-white/30">
                <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                <input type="file" accept="image/*" multiple onChange={handleAdditionalImages} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 mb-2 block">Product Name</label>
              <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-2 block">Brand</label>
              <input type="text" value={form.brand} onChange={(e) => handleChange('brand', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 mb-2 block">SKU (Auto-generated)</label>
              <input type="text" value={form.sku || ''} onChange={(e) => handleChange('sku', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-2 block">Category</label>
              <select value={form.category} onChange={(e) => handleChange('category', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white">
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-white/40 mb-2 block">Price (₹)</label>
              <input type="number" value={form.price} onChange={(e) => handleChange('price', Number(e.target.value))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-2 block">Original Price (₹)</label>
              <input type="number" value={form.originalPrice || 0} onChange={(e) => handleChange('originalPrice', Number(e.target.value))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-2 block">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => handleChange('stock', Number(e.target.value))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white" />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Sizes</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(form.sizes || []).map((size) => (
                <span key={size} className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-white flex items-center gap-2">
                  {size}
                  <button onClick={() => removeSize(size)} className="text-white/40 hover:text-red-400">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newSize} onChange={(e) => setNewSize(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())} className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-white/20" />
              <button onClick={addSize} className="px-3 py-2 bg-white/10 rounded-lg text-xs text-white hover:bg-white/20">Add</button>
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Colors</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(form.colors || []).map((color) => (
                <span key={color.name} className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-white flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color.hex }} />
                  {color.name}
                  <button onClick={() => removeColor(color.name)} className="text-white/40 hover:text-red-400">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newColorName} onChange={(e) => setNewColorName(e.target.value)} className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-white/20" />
              <input type="color" value={newColorHex} onChange={(e) => setNewColorHex(e.target.value)} className="w-9 h-9 rounded-lg cursor-pointer" />
              <button onClick={addColor} className="px-3 py-2 bg-white/10 rounded-lg text-xs text-white hover:bg-white/20">Add</button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Description</label>
            <textarea value={form.description || ''} onChange={(e) => handleChange('description', e.target.value)} rows={4} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 resize-none" />
          </div>

          {/* Details */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Product Details</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(form.details || []).map((detail) => (
                <span key={detail} className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-white flex items-center gap-2">
                  {detail}
                  <button onClick={() => removeDetail(detail)} className="text-white/40 hover:text-red-400">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newDetail} onChange={(e) => setNewDetail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDetail())} className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-white/20" />
              <button onClick={addDetail} className="px-3 py-2 bg-white/10 rounded-lg text-xs text-white hover:bg-white/20">Add</button>
            </div>
          </div>

          <div>
            <label className="text-xs text-white/40 mb-2 block">Status</label>
            <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="px-5 py-2.5 text-xs text-white/40 hover:text-white/70">Cancel</button>
          <button onClick={() => onSave(form)} className="px-6 py-2.5 bg-[#c9a96e] text-black text-xs font-semibold uppercase rounded-lg hover:bg-[#dfc08a]">{product ? 'Save Changes' : 'Add Product'}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}