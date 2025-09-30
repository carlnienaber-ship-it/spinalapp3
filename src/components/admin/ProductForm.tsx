import React, { useState, useEffect } from 'react';
import { Product, Supplier } from '../../types';
import { useApiClient } from '../../hooks/useApiClient';
import Button from '../ui/Button';
import NumericInput from '../ui/NumericInput';

type ProductFormProps = {
  product: Product | null;
  suppliers: Supplier[];
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

const ProductForm: React.FC<ProductFormProps> = ({ product, suppliers, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Product['category']>('Cans and Bottles');
  const [fullBottleWeight, setFullBottleWeight] = useState<number | undefined>(undefined);
  const [parLevel, setParLevel] = useState<number | undefined>(undefined);
  const [orderUnitSize, setOrderUnitSize] = useState<number | undefined>(undefined);
  const [minOrderQuantity, setMinOrderQuantity] = useState<number | undefined>(undefined);
  const [reorderQuantity, setReorderQuantity] = useState<number | undefined>(undefined);
  const [primarySupplierId, setPrimarySupplierId] = useState<string>('');
  const [secondarySupplierId, setSecondarySupplierId] = useState<string>('');
  const [tertiarySupplierId, setTertiarySupplierId] = useState<string>('');
  
  const { addProduct, updateProduct, loading, error } = useApiClient();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setFullBottleWeight(product.fullBottleWeight);
      setParLevel(product.parLevel);
      setOrderUnitSize(product.orderUnitSize);
      setMinOrderQuantity(product.minOrderQuantity);
      setReorderQuantity(product.reorderQuantity);
      setPrimarySupplierId(product.primarySupplierId || '');
      setSecondarySupplierId(product.secondarySupplierId || '');
      setTertiarySupplierId(product.tertiarySupplierId || '');
    } else {
      // Reset form for new product
      setName('');
      setCategory('Cans and Bottles');
      setFullBottleWeight(undefined);
      setParLevel(undefined);
      setOrderUnitSize(undefined);
      setMinOrderQuantity(undefined);
      setReorderQuantity(undefined);
      setPrimarySupplierId('');
      setSecondarySupplierId('');
      setTertiarySupplierId('');
    }
  }, [product]);
  
  // Effect for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
      // 'Enter' key for submission is handled by the form's default `onSubmit` behavior.
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = { 
        name, 
        category, 
        fullBottleWeight: category === 'Spirits' ? fullBottleWeight : undefined,
        parLevel,
        orderUnitSize,
        minOrderQuantity,
        reorderQuantity,
        primarySupplierId: primarySupplierId || undefined,
        secondarySupplierId: secondarySupplierId || undefined,
        tertiarySupplierId: tertiarySupplierId || undefined,
      };
      if (product) {
        await updateProduct({ ...product, ...productData });
      } else {
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

          {/* Supplier Assignment */}
          <div className="p-4 border border-gray-700 rounded-md">
             <h3 className="text-lg font-semibold text-gray-200 mb-3">Supplier Assignment</h3>
             <div className="space-y-4">
                <div>
                    <label htmlFor="primary-supplier" className="block text-sm font-medium text-gray-300">Primary Supplier</label>
                    <select id="primary-supplier" value={primarySupplierId} onChange={(e) => setPrimarySupplierId(e.target.value)} className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 px-3 py-2 text-gray-50 focus:border-blue-500 focus:ring-blue-500">
                        <option value="">-- None --</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.supplierName}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="secondary-supplier" className="block text-sm font-medium text-gray-300">Secondary Supplier (Optional)</label>
                    <select id="secondary-supplier" value={secondarySupplierId} onChange={(e) => setSecondarySupplierId(e.target.value)} className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 px-3 py-2 text-gray-50 focus:border-blue-500 focus:ring-blue-500">
                        <option value="">-- None --</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.supplierName}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="tertiary-supplier" className="block text-sm font-medium text-gray-300">Tertiary Supplier (Optional)</label>
                    <select id="tertiary-supplier" value={tertiarySupplierId} onChange={(e) => setTertiarySupplierId(e.target.value)} className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 px-3 py-2 text-gray-50 focus:border-blue-500 focus:ring-blue-500">
                        <option value="">-- None --</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.supplierName}</option>)}
                    </select>
                </div>
             </div>
          </div>


          {/* Inventory Details */}
          <div className="p-4 border border-gray-700 rounded-md">
             <h3 className="text-lg font-semibold text-gray-200 mb-3">Inventory Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="par-level" className="block text-sm font-medium text-gray-300">PAR Level</label>
                <NumericInput id="par-level" value={parLevel || ''} onChange={(e) => setParLevel(parseNumber(e.target.value))} placeholder="e.g., 6" className="mt-1"/>
              </div>
               <div>
                <label htmlFor="reorderQuantity" className="block text-sm font-medium text-gray-300">Reorder Quantity</label>
                <NumericInput id="reorderQuantity" value={reorderQuantity || ''} onChange={(e) => setReorderQuantity(parseNumber(e.target.value))} placeholder="e.g., 12" className="mt-1"/>
              </div>
              <div>
                <label htmlFor="order-unit-size" className="block text-sm font-medium text-gray-300">
                  Order Unit Size
                  <InfoTooltip text="The number of individual items in a single orderable unit. E.g., a case of Coke has a size of 24, a single bottle of whiskey has a size of 1." />
                </label>
                <NumericInput id="order-unit-size" value={orderUnitSize || ''} onChange={(e) => setOrderUnitSize(parseNumber(e.target.value))} placeholder="e.g., 24" className="mt-1"/>
              </div>
              <div>
                <label htmlFor="minOrderQuantity" className="block text-sm font-medium text-gray-300">
                  Minimum Order Quantity (MOQ)
                  <InfoTooltip text="The minimum quantity of order units (e.g., cases, single bottles) that must be placed in a single order. E.g., if you must order by the case, the minimum is 1." />
                </label>
                <NumericInput id="minOrderQuantity" value={minOrderQuantity || ''} onChange={(e) => setMinOrderQuantity(parseNumber(e.target.value))} placeholder="e.g., 1" className="mt-1"/>
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