import React, { useState, useEffect } from 'react';
import { Supplier } from '../../types';
import { useApiClient } from '../../hooks/useApiClient';
import Button from '../ui/Button';

type SupplierFormProps = {
  supplier: Supplier | null;
  onClose: () => void;
  onSuccess: () => void;
};

const SupplierForm: React.FC<SupplierFormProps> = ({ supplier, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierEmail: '',
    contactPerson: '',
    telephone: '',
    address: '',
    liquorLicenseNumber: '',
    bankDetails: '',
  });
  
  const { addSupplier, updateSupplier, loading, error } = useApiClient();

  useEffect(() => {
    if (supplier) {
      setFormData({
        supplierName: supplier.supplierName,
        supplierEmail: supplier.supplierEmail,
        contactPerson: supplier.contactPerson || '',
        telephone: supplier.telephone || '',
        address: supplier.address || '',
        liquorLicenseNumber: supplier.liquorLicenseNumber || '',
        bankDetails: supplier.bankDetails || '',
      });
    } else {
      setFormData({
        supplierName: '',
        supplierEmail: '',
        contactPerson: '',
        telephone: '',
        address: '',
        liquorLicenseNumber: '',
        bankDetails: '',
      });
    }
  }, [supplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
          ...formData,
          // Ensure optional fields are sent as undefined if empty, so they can be saved as null
          contactPerson: formData.contactPerson || undefined,
          telephone: formData.telephone || undefined,
          address: formData.address || undefined,
          liquorLicenseNumber: formData.liquorLicenseNumber || undefined,
          bankDetails: formData.bankDetails || undefined,
      };

      if (supplier) {
        await updateSupplier({ ...supplier, ...payload });
      } else {
        await addSupplier(payload);
      }
      onSuccess();
    } catch (err) {
      console.error("Form submission failed", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-50 mb-6">{supplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="supplierName" className="block text-sm font-medium text-gray-300">Supplier Name *</label>
              <input id="supplierName" name="supplierName" type="text" value={formData.supplierName} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 px-3 py-2 text-gray-50 focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="supplierEmail" className="block text-sm font-medium text-gray-300">Supplier Email *</label>
              <input id="supplierEmail" name="supplierEmail" type="email" value={formData.supplierEmail} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 px-3 py-2 text-gray-50 focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-300">Contact Person</label>
              <input id="contactPerson" name="contactPerson" type="text" value={formData.contactPerson} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 px-3 py-2 text-gray-50 focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-300">Telephone</label>
              <input id="telephone" name="telephone" type="tel" value={formData.telephone} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 px-3 py-2 text-gray-50 focus:border-blue-500 focus:ring-blue-500" />
            </div>
             <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-300">Address</label>
              <input id="address" name="address" type="text" value={formData.address} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 px-3 py-2 text-gray-50 focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="liquorLicenseNumber" className="block text-sm font-medium text-gray-300">Liquor License Number</label>
              <input id="liquorLicenseNumber" name="liquorLicenseNumber" type="text" value={formData.liquorLicenseNumber} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 px-3 py-2 text-gray-50 focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="bankDetails" className="block text-sm font-medium text-gray-300">Bank Details</label>
              <textarea id="bankDetails" name="bankDetails" value={formData.bankDetails} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 px-3 py-2 text-gray-50 focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"></textarea>
            </div>
          </div>
          
          {error && <p className="text-red-400 mt-4">Error: {error.message}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" onClick={onClose} variant="secondary" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Supplier'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierForm;