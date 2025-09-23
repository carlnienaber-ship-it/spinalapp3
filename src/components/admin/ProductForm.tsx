import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useApiClient } from '../../hooks/useApiClient';
import Button from '../ui/Button';
import NumericInput from '../ui/NumericInput';

type ProductFormProps = {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
};

const categories: Product['category'][] = ['Spirits', 'Cans and Bottles', 'Food', "Brewer's Reserve"];

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Product['category']>('Cans and Bottles');
  const [fullBottleWeight, setFullBottleWeight] = useState<number | undefined>(undefined);
  
  const { addProduct, updateProduct, loading, error } = useApiClient();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setFullBottleWeight(product.fullBottleWeight);
    } else {
      setName('');
      setCategory('Cans and Bottles');
      setFullBottleWeight(undefined);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = { name, category, fullBottleWeight: category === 'Spirits' ? fullBottleWeight : undefined };
      if (product) {
        await updateProduct({ ...productData, id: product.id, isActive: product.isActive });
      } else {
        await addProduct(productData);
      }
      onSuccess();
    } catch (err) {
      console.error("Form submission failed", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-50 mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="product-name" className="block text-sm font-medium text-gray-300">Product Name</label>
            <input
              id="product-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 px-3 py-2 text-gray-50 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="product-category" className="block text-sm font-medium text-gray-300">Category</label>
            <select
              id="product-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Product['category'])}
              required
              className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 px-3 py-2 text-gray-50 focus:border-blue-500 focus:ring-blue-500"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          {category === 'Spirits' && (
            <div>
              <label htmlFor="full-bottle-weight" className="block text-sm font-medium text-gray-300">Full Bottle Weight (g)</label>
              <NumericInput
                id="full-bottle-weight"
                value={fullBottleWeight || ''}
                onChange={(e) => setFullBottleWeight(parseInt(e.target.value, 10) || undefined)}
                placeholder="e.g., 1250"
                className="mt-1"
              />
            </div>
          )}
          {error && <p className="text-red-400">Error: {error.message}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" onClick={onClose} variant="secondary" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;