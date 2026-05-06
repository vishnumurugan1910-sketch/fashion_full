import { useState, useEffect, useCallback } from 'react';
import { categoriesApi, fixImageUrl } from './api';

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  image?: string;
  banner?: string;
  productCount?: number;
  isActive?: boolean;
  order?: number;
  [key: string]: unknown;
}

export interface CategoriesResponse {
  categories: Category[];
}

function sanitizeCategory(cat: Category): Category {
  const _id = cat._id ? String((cat._id as { toString(): string }).toString()) : '';
  return {
    _id: _id,
    id: _id,
    name: String(cat.name || ''),
    slug: String(cat.slug || ''),
    image: fixImageUrl(cat.image),
    banner: fixImageUrl(cat.banner),
    productCount: typeof cat.productCount === 'number' ? cat.productCount : 0,
    isActive: Boolean(cat.isActive),
    order: typeof cat.order === 'number' ? cat.order : 0,
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoriesApi.getAll() as CategoriesResponse;
      const sanitized = (data.categories || []).map(sanitizeCategory);
      const active = sanitized.filter((c) => c.isActive);
      setCategories(active);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}

export function useCategory(slug: string) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    
    const fetchCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await categoriesApi.getById(slug) as Category;
        setCategory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch category');
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  return { category, loading, error };
}