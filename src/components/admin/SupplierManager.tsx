import React, { useState, useMemo } from 'react';
import { useApiClient } from '../../hooks/useApiClient';
import { Supplier, Product } from '../../types';
import Button from '../ui/Button';
import SupplierForm from './SupplierForm';

type SupplierManagerProps = {
  suppliers: Supplier[];
  products: Product[];
  isLoading: boolean;
  onSuppliersChange: () => Promise<void>;
};

const SupplierManager: React.FC<SupplierManagerProps> = ({ suppliers, products, isLoading, onSuppliersChange }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const { deactivateSupplier, loading: mutationLoading, error } = useApiClient();

  const handleDeactivate = async (supplierId: string) => {
    if (window.confirm('Are you sure you want to deactivate this supplier?')) {
      try {
        await deactivateSupplier(supplierId);
        onSuppliersChange();
        setSelectedSupplier(null);
      } catch (e) {
        console.error("Failed to deactivate supplier", e);
      }
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsFormOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingSupplier(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingSupplier(null);
  };
  
  const handleFormSuccess = () => {
    handleFormClose();
    onSuppliersChange();
  };

  const downloadTxtFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const formatSupplierForTxt = (supplier: Supplier): string => {
    return [
      `Supplier Name: ${supplier.supplierName}`,
      `Email: ${supplier.supplierEmail}`,
      `Contact Person: ${supplier.contactPerson || 'N/A'}`,
      `Telephone: ${supplier.telephone || 'N/A'}`,
      `Address: ${supplier.address || 'N/A'}`,
      `Liquor License: ${supplier.liquorLicenseNumber || 'N/A'}`,
      `Bank Details:\n${supplier.bankDetails || 'N/A'}`,
    ].join('\n');
  };

  const handleDownloadAll = () => {
    const allSuppliersText = suppliers
      .map(s => formatSupplierForTxt(s))
      .join('\n\n----------------------------------------\n\n');
    downloadTxtFile(allSuppliersText, 'all_suppliers.txt');
  };

  const handleDownloadSingle = (supplier: Supplier) => {
    const supplierText = formatSupplierForTxt(supplier);
    downloadTxtFile(supplierText, `supplier_${supplier.supplierName.replace(/\s+/g, '_')}.txt`);
  };

  const productsBySupplier = useMemo(() => {
    if (!selectedSupplier) return [];
    return products.filter(p => 
      p.primarySupplierId === selectedSupplier.id ||
      p.secondarySupplierId === selectedSupplier.id ||
      p.tertiarySupplierId === selectedSupplier.id
    ).sort((a,b) => a.name.localeCompare(b.name));
  }, [products, selectedSupplier]);

  const sortedSuppliers = useMemo(() => 
    [...suppliers].sort((a, b) => a.supplierName.localeCompare(b.supplierName)),
  [suppliers]);


  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-50">Supplier Management</h2>
        <div className="flex gap-2">
            <Button onClick={handleDownloadAll} variant="secondary" disabled={suppliers.length === 0}>Download All (.txt)</Button>
            <Button onClick={handleAddNew}>Add New Supplier</Button>
        </div>
      </div>

      {isLoading && suppliers.length === 0 && <p>Loading suppliers...</p>}
      {error && <p className="text-red-400">Error: {error.message}</p>}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Supplier List */}
        <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-gray-100 mb-4">Suppliers</h3>
                {sortedSuppliers.length > 0 ? (
                    <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
                        {sortedSuppliers.map(supplier => (
                            <li key={supplier.id}>
                                <button
                                    onClick={() => setSelectedSupplier(supplier)}
                                    className={`w-full text-left p-3 rounded-md transition-colors ${
                                    selectedSupplier?.id === supplier.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    }`}
                                >
                                    <p className="font-semibold">{supplier.supplierName}</p>
                                    <p className="text-sm opacity-80">{supplier.supplierEmail}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">No suppliers found.</p>
                )}
            </div>
        </div>

        {/* Supplier Details */}
        <div className="w-full md:w-2/3 lg:w-3/4">
            {selectedSupplier ? (
                <div className="bg-gray-900 p-6 rounded-lg max-h-[70vh] overflow-y-auto">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-2xl font-bold text-white">{selectedSupplier.supplierName}</h3>
                            <p className="text-blue-300">{selectedSupplier.supplierEmail}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                            <Button onClick={() => handleDownloadSingle(selectedSupplier)} size="sm" variant="secondary">Download Info</Button>
                            <Button onClick={() => handleEdit(selectedSupplier)} size="sm" variant="secondary" disabled={mutationLoading}>Edit</Button>
                            <Button onClick={() => handleDeactivate(selectedSupplier.id)} size="sm" variant="destructive" disabled={mutationLoading}>Deactivate</Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                        <div><strong className="text-gray-400">Contact:</strong> <span className="text-gray-200">{selectedSupplier.contactPerson || 'N/A'}</span></div>
                        <div><strong className="text-gray-400">Telephone:</strong> <span className="text-gray-200">{selectedSupplier.telephone || 'N/A'}</span></div>
                        <div className="md:col-span-2"><strong className="text-gray-400">Address:</strong> <span className="text-gray-200">{selectedSupplier.address || 'N/A'}</span></div>
                        <div className="md:col-span-2"><strong className="text-gray-400">Liquor License:</strong> <span className="text-gray-200">{selectedSupplier.liquorLicenseNumber || 'N/A'}</span></div>
                        <div className="md:col-span-2"><strong className="text-gray-400">Bank Details:</strong><br/><pre className="font-sans whitespace-pre-wrap text-gray-200 bg-gray-800 p-2 rounded mt-1">{selectedSupplier.bankDetails || 'N/A'}</pre></div>
                    </div>
                    
                    <h4 className="text-xl font-semibold text-gray-100 mt-6 border-t border-gray-700 pt-4">Assigned Products</h4>
                     {productsBySupplier.length > 0 ? (
                        <ul className="mt-4 space-y-2">
                           {productsBySupplier.map(p => (
                            <li key={p.id} className="bg-gray-800 p-3 rounded">
                                <span className="text-gray-200">{p.name}</span>
                                <span className="text-xs text-gray-400 ml-2">({p.category})</span>
                            </li>
                           ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 mt-4">No products are assigned to this supplier.</p>
                    )}
                </div>
            ) : (
                <div className="bg-gray-900 p-8 rounded-lg text-center h-full flex items-center justify-center">
                    <p className="text-gray-300">Select a supplier to view their details and assigned products.</p>
                </div>
            )}
        </div>
      </div>

      {isFormOpen && (
        <SupplierForm 
          supplier={editingSupplier} 
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default SupplierManager;