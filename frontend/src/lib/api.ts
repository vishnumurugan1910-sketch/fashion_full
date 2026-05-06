const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
const UPLOADS_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function fixImageUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('blob:')) return url;
  return `${UPLOADS_BASE_URL}${url}`;
}

export function fixProductImage(image?: string): string {
  return fixImageUrl(image);
}

export function fixCategoryImage(image?: string): string {
  return fixImageUrl(image);
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(endpoint: string, params?: Record<string, unknown>): string {
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      return queryString ? `${endpoint}?${queryString}` : endpoint;
    }
    return endpoint;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: { params?: Record<string, unknown> } & RequestInit): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();

export const productsApi = {
  getAll: (params?: { category?: string; status?: string; search?: string; page?: number; limit?: number }): Promise<ProductsResponse> => 
    api.get('/products', { params }) as Promise<ProductsResponse>,
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: unknown) => api.post('/products', data),
  update: (id: string, data: unknown) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export const categoriesApi = {
  getAll: (): Promise<CategoriesResponse> => 
    api.get('/categories') as Promise<CategoriesResponse>,
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: unknown) => api.post('/categories', data),
  update: (id: string, data: unknown) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const ordersApi = {
  getAll: (params?: { status?: string; page?: number; limit?: number }): Promise<OrdersResponse> => 
    api.get('/orders', { params }) as Promise<OrdersResponse>,
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: unknown) => api.post('/orders', data),
  update: (id: string, data: unknown) => api.put(`/orders/${id}`, data),
};

export const usersApi = {
  getAll: (params?: { status?: string; search?: string; page?: number; limit?: number }): Promise<UsersResponse> => 
    api.get('/users', { params }) as Promise<UsersResponse>,
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: unknown) => api.post('/users', data),
  update: (id: string, data: unknown) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export const bannersApi = {
  getAll: (): Promise<BannersResponse> => 
    api.get('/banners') as Promise<BannersResponse>,
  create: (data: unknown) => api.post('/banners', data),
  update: (id: string, data: unknown) => api.put(`/banners/${id}`, data),
  delete: (id: string) => api.delete(`/banners/${id}`),
};

export const storiesApi = {
  getAll: (params?: { status?: string; category?: string; page?: number; limit?: number }): Promise<StoriesResponse> => 
    api.get('/stories', { params }) as Promise<StoriesResponse>,
  create: (data: unknown) => api.post('/stories', data),
  update: (id: string, data: unknown) => api.put(`/stories/${id}`, data),
  delete: (id: string) => api.delete(`/stories/${id}`),
};

export const couponsApi = {
  getAll: (): Promise<CouponsResponse> => 
    api.get('/coupons') as Promise<CouponsResponse>,
  create: (data: unknown) => api.post('/coupons', data),
  update: (id: string, data: unknown) => api.put(`/coupons/${id}`, data),
  delete: (id: string) => api.delete(`/coupons/${id}`),
  validate: (code: string) => api.post('/coupons/validate', { code }),
};

export const reviewsApi = {
  getAll: (params?: { status?: string; product?: string; page?: number; limit?: number }): Promise<ReviewsResponse> => 
    api.get('/reviews', { params }) as Promise<ReviewsResponse>,
  create: (data: unknown) => api.post('/reviews', data),
  update: (id: string, data: unknown) => api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
};

export const razorpayApi = {
  createOrder: (data: { amount: number; currency?: string }) => 
    api.post('/razorpay/order', data),
  verifyPayment: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => 
    api.post('/razorpay/verify', data),
};

export interface ApiResponse<T> {
  data?: T;
  [key: string]: unknown;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  image: string;
  banner?: string;
  isActive: boolean;
  productCount?: number;
}

export interface OrdersResponse {
  orders: Order[];
}

export interface Order {
  _id?: string;
  id?: string;
  orderId?: string;
  customer: string;
  email: string;
  phone?: string;
  address?: string;
  product?: string;
  items?: {
    name: string;
    image: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }[];
  subtotal?: number;
  total?: number;
  amount?: string;
  status: string;
  date?: string;
  payment?: string;
  paymentMethod?: string;
  paymentId?: string;
}

export interface UsersResponse {
  users: User[];
}

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  joined: string;
  status: string;
  avatar: string;
}

export interface BannersResponse {
  banners: Banner[];
}

export interface Banner {
  _id?: string;
  id?: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  position: string;
  active: boolean;
}

export interface StoriesResponse {
  stories: Story[];
}

export interface Story {
  _id?: string;
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  image: string;
  category: string;
  publishedAt: string;
  status: string;
}

export interface CouponsResponse {
  coupons: Coupon[];
}

export interface Coupon {
  _id?: string;
  id?: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount?: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface ReviewsResponse {
  reviews: Review[];
}

export interface Review {
  _id?: string;
  id?: string;
  product?: string;
  productName?: string;
  productImage?: string;
  user?: string;
  userName?: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  status: string;
  isSpam?: boolean;
  isFeatured?: boolean;
  customerPhotos?: string[];
  helpfulCount?: number;
}

export interface ProductsResponse {
  products: Product[];
}

export interface Product {
  _id?: string;
  id?: string;
  sku?: string;
  name: string;
  title?: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  totalStock?: number;
  lowStockThreshold?: number;
  status: string;
  image: string;
  images?: string[];
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  stockByVariant?: { size: string; color: string; quantity: number }[];
  description?: string;
  details?: string[];
  warehouseLocation?: string;
  costPrice?: number;
  lastRestocked?: Date;
}

export const uploadApi = {
  image: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  },
  
  product: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE_URL}/upload/product`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  },
  
  category: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE_URL}/upload/category`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  },
  
  banner: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE_URL}/upload/banner`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  },
  
  story: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE_URL}/upload/story`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  },
  
  avatar: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await fetch(`${API_BASE_URL}/upload/avatar`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  },
};