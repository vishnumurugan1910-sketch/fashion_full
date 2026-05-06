'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productsApi, Product } from '@/lib/api';

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-400',
  draft: 'bg-amber-500/15 text-amber-400',
  archived: 'bg-white/10 text-white/30',
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getAll({ limit: 100 });
      setProducts(data.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = products.filter((p) => {
    const isLowStock = p.stock <= (p.lowStockThreshold || 5) && p.stock > 0;
    const isOutOfStock = p.stock === 0;
    
    let matchFilter = true;
    if (filter === 'low') matchFilter = isLowStock;
    else if (filter === 'out') matchFilter = isOutOfStock;
    else if (filter === 'in') matchFilter = !isLowStock && !isOutOfStock;
    
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                     p.sku?.toLowerCase().includes(search.toLowerCase());
    
    return matchFilter && matchSearch;
  });

  const stats = {
    total: products.length,
    lowStock: products.filter(p => p.stock <= (p.lowStockThreshold || 5) && p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    inStock: products.filter(p => p.stock > (p.lowStockThreshold || 5)).length,
  };

  const handleBulkUpdate = async (updates: { id: string; stock: number }[]) => {
    try {
      for (const update of updates) {
        await productsApi.update(update.id, { stock: update.stock });
      }
      await fetchProducts();
      alert('Stock updated successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update stock');
    }
  };

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
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleSave = async (product: Product) => {
    try {
      await productsApi.update(product._id || '', {
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold,
        warehouseLocation: (product as Product & { warehouseLocation?: string }).warehouseLocation,
        stockByVariant: (product as Product & { stockByVariant?: { size: string; color: string; quantity: number }[] }).stockByVariant,
      });
      await fetchProducts();
      setModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    }
  };

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
          <h1 className="text-2xl font-semibold text-white">Inventory Management</h1>
          <p className="text-sm text-white/40 mt-1">Track and manage stock levels</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-semibold text-white">{stats.total}</p>
          <p className="text-xs text-white/40">Total Products</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-semibold text-emerald-400">{stats.inStock}</p>
          <p className="text-xs text-white/40">In Stock</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-semibold text-amber-400">{stats.lowStock}</p>
          <p className="text-xs text-white/40">Low Stock</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-semibold text-red-400">{stats.outOfStock}</p>
          <p className="text-xs text-white/40">Out of Stock</p>
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
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/25 outline-none focus:border-[#c9a96e]/40"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'in', label: 'In Stock' },
            { key: 'low', label: 'Low Stock' },
            { key: 'out', label: 'Out of Stock' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                filter === f.key ? 'bg-[#c9a96e]/20 text-[#c9a96e]' : 'text-white/35 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Product', 'SKU', 'Current Stock', 'Threshold', 'Warehouse', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-wider uppercase text-white/25 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((product, i) => {
                  const isLowStock = product.stock <= (product.lowStockThreshold || 5) && product.stock > 0;
                  const isOutOfStock = product.stock === 0;
                  
                  return (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }} />
                          </div>
                          <div>
                            <p className="text-sm text-white">{product.name}</p>
                            <p className="text-[10px] text-white/30">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-white/50 font-mono">{product.sku || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${
                          isOutOfStock ? 'text-red-400' : isLowStock ? 'text-amber-400' : 'text-white'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-white/40">{product.lowStockThreshold || 5}</td>
                      <td className="px-4 py-3 text-xs text-white/40">{(product as Product & { warehouseLocation?: string }).warehouseLocation || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-1 rounded-full ${
                          isOutOfStock ? 'bg-red-500/15 text-red-400' : 
                          isLowStock ? 'bg-amber-500/15 text-amber-400' : 
                          'bg-emerald-500/15 text-emerald-400'
                        }`}>
                          {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(product)}
                            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(product._id || '')}
                            className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/40 hover:text-red-400"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-white/25">No products found</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && selectedProduct && (
          <InventoryModal
            product={selectedProduct}
            onClose={() => { setModalOpen(false); setSelectedProduct(null); }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function InventoryModal({
  product,
  onClose,
  onSave,
}: {
  product: Product;
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const [stock, setStock] = useState(product.stock);
  const [lowStockThreshold, setLowStockThreshold] = useState(product.lowStockThreshold || 5);
  const [warehouseLocation, setWarehouseLocation] = useState((product as Product & { warehouseLocation?: string }).warehouseLocation || '');
  const [stockByVariant, setStockByVariant] = useState<{ size: string; color: string; quantity: number }[]>(
    (product as Product & { stockByVariant?: { size: string; color: string; quantity: number }[] }).stockByVariant || []
  );
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [variantQty, setVariantQty] = useState(0);

  const sizes = product.sizes || [];
  const colors = (product.colors || []) as { name: string; hex: string }[];

  const addVariantStock = () => {
    if (!selectedSize || !selectedColor) return;
    
    setStockByVariant(prev => {
      const existing = prev.find(v => v.size === selectedSize && v.color === selectedColor);
      if (existing) {
        return prev.map(v => 
          v.size === selectedSize && v.color === selectedColor 
            ? { ...v, quantity: variantQty }
            : v
        );
      }
      return [...prev, { size: selectedSize, color: selectedColor, quantity: variantQty }];
    });
    setVariantQty(0);
    setSelectedSize('');
    setSelectedColor('');
  };

  const removeVariantStock = (size: string, color: string) => {
    setStockByVariant(prev => prev.filter(v => !(v.size === size && v.color === color)));
  };

  const handleSave = () => {
    const totalVariantStock = stockByVariant.reduce((sum, v) => sum + v.quantity, 0);
    onSave({
      ...product,
      stock: totalVariantStock > 0 ? totalVariantStock : stock,
      lowStockThreshold,
      warehouseLocation,
      stockByVariant,
    } as Product);
  };

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
          <h2 className="text-lg font-medium text-white">Update Inventory</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }} />
            </div>
            <div>
              <p className="text-sm text-white">{product.name}</p>
              <p className="text-[10px] text-white/40">{product.brand} · {product.sku}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-white/40 mb-2 block">Total Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-2 block">Low Stock Alert</label>
              <input
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-2 block">Warehouse Location</label>
              <input
                type="text"
                value={warehouseLocation}
                onChange={(e) => setWarehouseLocation(e.target.value)}
                placeholder="e.g. Rack A-12"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
              />
            </div>
          </div>

          {sizes.length > 0 && colors.length > 0 && (
            <div>
              <label className="text-xs text-white/40 mb-2 block">Stock by Size & Color</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                >
                  <option value="">Select Size</option>
                  {sizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                >
                  <option value="">Select Color</option>
                  {colors.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={variantQty}
                  onChange={(e) => setVariantQty(Number(e.target.value))}
                  placeholder="Qty"
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                />
                <button
                  onClick={addVariantStock}
                  className="px-3 py-2 bg-[#c9a96e] text-black text-xs rounded-lg"
                >
                  Add
                </button>
              </div>

              {stockByVariant.length > 0 && (
                <div className="space-y-2">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-white/40">
                        <th className="text-left px-2 py-1">Size</th>
                        <th className="text-left px-2 py-1">Color</th>
                        <th className="text-left px-2 py-1">Qty</th>
                        <th className="text-right px-2 py-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockByVariant.map((v, i) => (
                        <tr key={i} className="border-t border-white/5">
                          <td className="px-2 py-1 text-white">{v.size}</td>
                          <td className="px-2 py-1 text-white">{v.color}</td>
                          <td className="px-2 py-1 text-white">{v.quantity}</td>
                          <td className="px-2 py-1 text-right">
                            <button
                              onClick={() => removeVariantStock(v.size, v.color)}
                              className="text-red-400 hover:text-red-300"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="px-5 py-2.5 text-xs text-white/40 hover:text-white/70">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2.5 bg-[#c9a96e] text-black text-xs font-semibold uppercase rounded-lg">
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}