import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApiClient } from '../../hooks/useApiClient';
import { Product } from '../../types';
import Button from '../ui/Button';
import ProductForm from './ProductForm';

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { getProducts, deactivateProduct, loading, error } = useApiClient();

  const fetchProducts = useCallback(async () => {
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (e) {
      console.error("Failed to fetch products", e);
    }
  }, [getProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeactivate = async (productId: string) => {
    if (window.confirm('Are you sure you want to deactivate this product? It will no longer appear in new stocktakes.')) {
      try {
        await deactivateProduct(productId);
        fetchProducts(); // Refresh the list
      } catch (e) {
        console.error("Failed to deactivate product", e);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };
  
  const handleFormSuccess = () => {
    handleFormClose();
    fetchProducts();
  };

  const groupedProducts = useMemo(() => {
    const groups: { [key: string]: Product[] } = {
      'Spirits': [],
      'Cans and Bottles': [],
      'Food': [],
      "Brewer's Reserve": [],
    };
    products.forEach(p => {
      if (groups[p.category]) {
        groups[p.category].push(p);
      }
    });
    return groups;
  }, [products]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-50">Product List</h2>
        <Button onClick={handleAddNew}>Add New Product</Button>
      </div>

      {loading && products.length === 0 && <p>Loading products...</p>}
      {error && <p className="text-red-400">Error: {error.message}</p>}

      <div className="space-y-6">
        {Object.entries(groupedProducts).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-xl font-semibold text-gray-200 mb-3 border-b border-gray-700 pb-2">{category}</h3>
            {items.length > 0 ? (
              <ul className="space-y-2">
                {items.map(product => (
                  <li key={product.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                    <span className="text-gray-200">{product.name}</span>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEdit(product)} size="sm" variant="secondary">Edit</Button>
                      <Button onClick={() => handleDeactivate(product.id)} size="sm" variant="destructive">Deactivate</Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No products in this category.</p>
            )}
          </div>
        ))}
      </div>

      {isFormOpen && (
        <ProductForm 
          product={editingProduct} 
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default ProductManager;