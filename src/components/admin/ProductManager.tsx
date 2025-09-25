import React, { useState } from 'react';
import { useApiClient } from '../../hooks/useApiClient';
import { Product } from '../../types';
import Button from '../ui/Button';
import ProductForm from './ProductForm';

type ProductManagerProps = {
  products: Product[];
  isLoading: boolean;
  onProductsChange: () => Promise<void>;
};

const ProductManager: React.FC<ProductManagerProps> = ({ products, isLoading, onProductsChange }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { deactivateProduct, deleteProduct, seedProducts, loading: mutationLoading, error } = useApiClient();

  const handleDeactivate = async (productId: string) => {
    if (window.confirm('Are you sure you want to deactivate this product? It will no longer appear in new stocktakes.')) {
      try {
        await deactivateProduct(productId);
        onProductsChange(); // Refresh the list
      } catch (e) {
        console.error("Failed to deactivate product", e);
      }
    }
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (window.confirm(`Are you absolutely sure you want to permanently delete "${productName}"? This action is irreversible and cannot be undone.`)) {
      try {
        await deleteProduct(productId);
        onProductsChange();
      } catch (e) {
        console.error("Failed to delete product", e);
        alert(`Error deleting product: ${(e as Error).message}`);
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
    onProductsChange();
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedProducts();
      await onProductsChange();
    } catch (e) {
      console.error("Failed to seed products", e);
      alert(`Error seeding products: ${(e as Error).message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  const groupedProducts = React.useMemo(() => {
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
    // Sort products alphabetically within each group
    for (const category in groups) {
        groups[category].sort((a, b) => a.name.localeCompare(b.name));
    }
    return groups;
  }, [products]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-50">Product List</h2>
        <Button onClick={handleAddNew}>Add New Product</Button>
      </div>

      {isLoading && products.length === 0 && <p>Loading products...</p>}
      {error && <p className="text-red-400">Error: {error.message}</p>}

      {!isLoading && products.length === 0 && (
         <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-200">Your product list is empty.</h3>
            <p className="text-gray-400 mt-2 mb-4">You can add products manually or import the original default product list.</p>
            <Button onClick={handleSeed} disabled={isSeeding || mutationLoading}>
            {isSeeding ? 'Importing...' : 'Import Default Products'}
            </Button>
        </div>
      )}

      {products.length > 0 && (
        <div className="space-y-6">
            {Object.entries(groupedProducts).map(([category, items]) => {
            if (items.length === 0) return null;
            return (
                <div key={category}>
                <h3 className="text-xl font-semibold text-gray-200 mb-3 border-b border-gray-700 pb-2">{category}</h3>
                <ul className="space-y-2">
                    {items.map(product => (
                    <li key={product.id} className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-700 p-3 rounded-md">
                        <div>
                          <span className="font-semibold text-gray-100">{product.name}</span>
                          <p className="text-xs text-gray-400 mt-1">
                            Supplier: {product.supplierName || 'N/A'} | PAR Level: {product.parLevel ?? 'N/A'}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0 flex-shrink-0">
                          <Button onClick={() => handleEdit(product)} size="sm" variant="secondary" disabled={mutationLoading}>Edit</Button>
                          <Button onClick={() => handleDeactivate(product.id)} size="sm" variant="destructive" disabled={mutationLoading}>Deactivate</Button>
                          <Button onClick={() => handleDelete(product.id, product.name)} size="sm" variant="destructive" disabled={mutationLoading}>Delete</Button>
                        </div>
                    </li>
                    ))}
                </ul>
                </div>
            );
            })}
        </div>
      )}

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