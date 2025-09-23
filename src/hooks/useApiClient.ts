import { useAuth0 } from '@auth0/auth0-react';
import { useState, useCallback } from 'react';
import { ShiftState, ShiftRecord, Product } from '../types';

const API_BASE_URL = '/.netlify/functions';

type ApiClient = {
  submitShift: (shiftData: ShiftState) => Promise<{ documentId: string }>;
  getShifts: () => Promise<ShiftRecord[]>;
  getProducts: () => Promise<Product[]>;
  addProduct: (product: Omit<Product, 'id' | 'isActive'>) => Promise<Product>;
  updateProduct: (product: Product) => Promise<Product>;
  deactivateProduct: (productId: string) => Promise<{ id: string }>;
  seedProducts: () => Promise<{ message: string; count: number }>;
  loading: boolean;
  error: Error | null;
};

export function useApiClient(): ApiClient {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { getAccessTokenSilently } = useAuth0();

  const getHeaders = useCallback(async () => {
    const token = await getAccessTokenSilently();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, [getAccessTokenSilently]);
  
  const makeRequest = useCallback(async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorBody.error || `Request failed with status ${response.status}`);
      }
      
      return response.json() as Promise<T>;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  const submitShift = (shiftData: ShiftState) => makeRequest<{ documentId: string }>('submit-shift', {
    method: 'POST',
    body: JSON.stringify(shiftData),
  });

  const getShifts = () => makeRequest<ShiftRecord[]>('get-shifts');
  
  const getProducts = () => makeRequest<Product[]>('get-products');
  
  const addProduct = (product: Omit<Product, 'id' | 'isActive'>) => makeRequest<Product>('add-product', {
    method: 'POST',
    body: JSON.stringify(product),
  });

  const updateProduct = (product: Product) => makeRequest<Product>('update-product', {
    method: 'PUT',
    body: JSON.stringify(product),
  });

  const deactivateProduct = (productId: string) => makeRequest<{ id: string }>('deactivate-product', {
    method: 'PUT',
    body: JSON.stringify({ id: productId }),
  });

  const seedProducts = () => makeRequest<{ message: string; count: number }>('seed-products', {
    method: 'POST',
  });


  return { submitShift, getShifts, getProducts, addProduct, updateProduct, deactivateProduct, seedProducts, loading, error };
}