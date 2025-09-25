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

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
  <span className="relative group inline-block ml-1 cursor-pointer align-middle">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-gray-100" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
    <div className="absolute bottom-full mb-2 w-64 bg-gray-900 text-white text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 border border-gray-600 shadow-lg -translate-x-1/2 left-1/2">
      {text}
    </div>
  </span>
);

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Product['category']>('Cans and Bottles');
  const [fullBottleWeight, setFullBottleWeight] = useState<number | undefined>(undefined);
  const [supplierName, setSupplierName] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [parLevel, setParLevel] = useState<number | undefined>(undefined);
  const [orderUnitSize, setOrderUnitSize] = useState<number | undefined>(undefined);
  const [minOrderUnits, setMinOrderUnits] = useState<number | undefined>(undefined);
  
  const { addProduct, updateProduct, loading, error } = useApiClient();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setFullBottleWeight(product.fullBottleWeight);
      setSupplierName(product.supplierName || '');
      setSupplierEmail(product.supplierEmail || '');
      setParLevel(product.parLevel);
      setOrderUnitSize(product.orderUnitSize);
      setMinOrderUnits(product.minOrderUnits);
    } else {
      // Reset form for new product
      setName('');
      setCategory('Cans and Bottles');
      setFullBottleWeight(undefined);
      setSupplierName('');
      setSupplierEmail('');
      setParLevel(undefined);
      setOrderUnitSize(undefined);
      setMinOrderUnits(undefined);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = { 
        name, 
        category, 
        fullBottleWeight: category === 'Spirits' ? fullBottleWeight : undefined,
        supplierName: supplierName || undefined,
        supplierEmail: supplierEmail || undefined,
        parLevel,
        orderUnitSize,
        minOrderUnits,
      };
      if (product) {
        await updateProduct({ ...product, ...productData });
      } else {
        // The type for addProduct expects Omit<Product, 'id' | 'isActive'>
        // so we don't need to spread product here.
        await addProduct(productData);
      }
      onSuccess();
    } catch (err) {
      console.error("Form submission failed", err);
    }
  };

  const parseNumber = (value: string) => parseInt(value, 10) || undefined;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg max-h-full overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-50 mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Core Details */}
          <div className="p-4 border border-gray-700 rounded-md">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Core Details</h3>
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
            <div className="mt-4">
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
              <div className="mt-4">
                <label htmlFor="full-bottle-weight" className="block text-sm font-medium text-gray-300">Full Bottle Weight (g)</label>
                <NumericInput
                  id="full-bottle-weight"
                  value={fullBottleWeight || ''}
                  onChange={(e) => setFullBottleWeight(parseNumber(e.target.value))}
                  placeholder="e.g., 1250"
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {/* Inventory & Supplier Details */}
          <div className="p-4 border border-gray-700 rounded-md">
             <h3 className="text-lg font-semibold text-gray-200 mb-3">Inventory & Supplier</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="supplier-name" className="block text-sm font-medium text-gray-300">Supplier Name</label>
                <input id="supplier-name" type="text" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} placeholder="e.g., Mega-Bev" className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 px-3 py-2 text-gray-50 focus:border-blue-500 focus:ring-blue-500"/>
              </div>
              <div>
                <label htmlFor="supplier-email" className="block text-sm font-medium text-gray-300">Supplier Email</label>
                <input id="supplier-email" type="email" value={supplierEmail} onChange={(e) => setSupplierEmail(e.target.value)} placeholder="orders@mega-bev.com" className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 px-3 py-2 text-gray-50 focus:border-blue-500 focus:ring-blue-500"/>
              </div>
              <div>
                <label htmlFor="par-level" className="block text-sm font-medium text-gray-300">PAR Level</label>
                <NumericInput id="par-level" value={parLevel || ''} onChange={(e) => setParLevel(parseNumber(e.target.value))} placeholder="e.g., 6" className="mt-1"/>
              </div>
               <div>
                <label htmlFor="order-unit-size" className="block text-sm font-medium text-gray-300">
                  Order Unit Size
                  <InfoTooltip text="The number of individual items in a single orderable unit. E.g., a case of Coke has a size of 24, a single bottle of whiskey has a size of 1." />
                </label>
                <NumericInput id="order-unit-size" value={orderUnitSize || ''} onChange={(e) => setOrderUnitSize(parseNumber(e.target.value))} placeholder="e.g., 24" className="mt-1"/>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="min-order-units" className="block text-sm font-medium text-gray-300">
                  Minimum Order Units
                  <InfoTooltip text="The minimum quantity of order units (e.g., cases, single bottles) that must be placed in a single order. E.g., if you must order by the case, the minimum is 1." />
                </label>
                <NumericInput id="min-order-units" value={minOrderUnits || ''} onChange={(e) => setMinOrderUnits(parseNumber(e.target.value))} placeholder="e.g., 1" className="mt-1"/>
              </div>
            </div>
          </div>
          
          {error && <p className="text-red-400 mt-4">Error: {error.message}</p>}
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