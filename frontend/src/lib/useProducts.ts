import { useState, useEffect, useCallback } from 'react';
import { productsApi, fixImageUrl, Product } from './api';

export interface ProductsResponse {
  products: Product[];
  total?: number;
  page?: number;
  pages?: number;
}

function sanitizeProduct(prod: Product): Product {
  let idStr = '';
  try {
    if (prod._id) {
      if (typeof prod._id === 'string') {
        idStr = prod._id;
      } else if (typeof prod._id === 'object') {
        const obj = prod._id as { toString(): string };
        if (typeof obj.toString === 'function') {
          idStr = obj.toString();
        }
      }
    }
    if (!idStr) idStr = (prod.id as string) || '';
  } catch {
    idStr = (prod.id as string) || '';
  }
  
  let imageStr = '';
  try {
    if (typeof prod.image === 'string') {
      imageStr = prod.image;
    } else if (prod.image && typeof prod.image === 'object') {
      imageStr = String(prod.image);
    }
  } catch {
    imageStr = '';
  }
  
  return {
    id: idStr,
    _id: idStr,
    sku: prod.sku ? String(prod.sku) : undefined,
    name: String(prod.name || ''),
    brand: String(prod.brand || ''),
    category: String(prod.category || ''),
    price: Number(prod.price) || 0,
    originalPrice: prod.originalPrice ? Number(prod.originalPrice) : undefined,
    stock: Number(prod.stock) || 0,
    status: String(prod.status || 'draft'),
    image: fixImageUrl(imageStr),
    images: prod.images ? prod.images.map((img: string) => fixImageUrl(img)) : [],
    sizes: prod.sizes ? prod.sizes.map((s: string) => String(s)) : [],
    colors: prod.colors ? prod.colors.map((c: { name: string; hex: string }) => ({ name: String(c.name), hex: String(c.hex) })) : [],
    description: prod.description ? String(prod.description) : '',
    details: prod.details ? prod.details.map((d: string) => String(d)) : [],
  };
}

export function useProducts(params?: { category?: string; status?: string; search?: string; page?: number; limit?: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getAll(params) as ProductsResponse;
      const sanitized = (data.products || []).map(sanitizeProduct);
      setProducts(sanitized);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [params?.category, params?.status, params?.search, params?.page, params?.limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productsApi.getById(id) as Product;
        setProduct(sanitizeProduct(data));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}

export function useFeaturedProducts(limit = 8) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productsApi.getAll({ status: 'active', limit }) as ProductsResponse;
        const sanitized = (data.products || []).map(sanitizeProduct);
        setProducts(sanitized);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch featured products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [limit]);

  return { products, loading, error };
}