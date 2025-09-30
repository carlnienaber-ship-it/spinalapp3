import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApiClient } from '../../hooks/useApiClient';
import { ShiftRecord, Product, Supplier } from '../../types';
import ShiftList from './ShiftList';
import ShiftDetail from './ShiftDetail';
import Header from '../ui/Header';
import Button from '../ui/Button';
import ProductManager from './ProductManager';
import SupplierManager from './SupplierManager';
import StockOrdering from './StockOrdering';
import HoursReport from './HoursReport';

type AdminDashboardProps = {
  products: Product[];
  productsLoading: boolean;
  onProductsChange: () => Promise<void>;
  onBack: () => void;
};

type View = 'shifts' | 'products' | 'suppliers' | 'ordering' | 'hours';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, productsLoading, onProductsChange, onBack }) => {
  const [shifts, setShifts] = useState<ShiftRecord[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedShift, setSelectedShift] = useState<ShiftRecord | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentView, setCurrentView] = useState<View>('shifts');
  const { getShifts, getSuppliers, loading, error } = useApiClient();

  const fetchShifts = useCallback(async () => {
    try {
      const fetchedShifts = await getShifts();
      setShifts(fetchedShifts);
    } catch (e) {
      console.error("Failed to load shifts", e);
    }
  }, [getShifts]);
  
  const fetchSuppliers = useCallback(async () => {
    try {
      const fetchedSuppliers = await getSuppliers();
      setSuppliers(fetchedSuppliers);
    } catch (e) {
      console.error("Failed to load suppliers", e);
    }
  }, [getSuppliers]);

  useEffect(() => {
    if (currentView === 'shifts' || currentView === 'ordering' || currentView === 'hours') {
      fetchShifts();
    }
    if (currentView === 'suppliers' || currentView === 'products' || currentView === 'ordering') {
      fetchSuppliers();
    }
  }, [currentView, fetchShifts, fetchSuppliers]);

  const filteredShifts = useMemo(() => {
    if (selectedDate) {
      return shifts.filter(shift => {
        if (!shift.startTime) return false;
        const shiftDate = new Date(shift.startTime).toISOString().split('T')[0];
        return shiftDate === selectedDate;
      });
    }
    return shifts.slice(0, 10); // Show more recent shifts by default
  }, [shifts, selectedDate]);

  const uniqueUsers = useMemo(() => {
    const users = new Map<string, { name: string, email: string }>();
    shifts.forEach(shift => {
      if (shift.user?.email && !users.has(shift.user.email)) {
        users.set(shift.user.email, {
          email: shift.user.email,
          name: shift.user.name || shift.user.email,
        });
      }
    });
    return Array.from(users.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [shifts]);

  useEffect(() => {
    if (filteredShifts.length > 0) {
      setSelectedShift(filteredShifts[0]);
    } else {
      setSelectedShift(null);
    }
  }, [filteredShifts]);

  if (loading && currentView === 'shifts' && shifts.length === 0) {
    return <div className="text-center p-8"><p>Loading shift reports...</p></div>;
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-900 text-red-100 rounded-lg">
        <p className="font-bold">Error:</p>
        <p>{error.message}</p>
        <Button onClick={onBack} className="mt-4">Back to Welcome Screen</Button>
      </div>
    );
  }

  const renderShiftsView = () => (
    <>
      {shifts.length === 0 && !loading ? (
        <div className="text-center p-8 bg-gray-800 rounded-lg">
           <p className="text-gray-400 mb-6">No shift reports have been submitted yet.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-50 mb-4 px-2">Shifts</h2>
               <div className="mb-4 px-2">
                 <label htmlFor="date-picker" className="block text-sm font-medium text-gray-400 mb-1">Filter by date</label>
                 <input 
                  type="date"
                  id="date-picker"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-gray-700 text-gray-200 rounded-md border-gray-600 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                 />
                 {selectedDate && <Button size="sm" variant="secondary" onClick={() => setSelectedDate('')} className="mt-2 w-full">Clear Filter</Button>}
               </div>
              <ShiftList
                shifts={filteredShifts}
                selectedShiftId={selectedShift?.id || ''}
                onSelectShift={setSelectedShift}
              />
            </div>
          </div>
          <div className="w-full md:w-2/3 lg:w-3/4">
            {selectedShift ? (
              <ShiftDetail shift={selectedShift} />
            ) : (
              <div className="bg-gray-800 p-8 rounded-lg text-center">
                <p className="text-gray-300">
                  {selectedDate ? 'No shifts found for the selected date.' : 'Select a shift to view its details.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div>
      <Header title="Admin Dashboard" subtitle={`Review submitted shift handovers`} />
      
      <div className="flex justify-center flex-wrap gap-4 mb-8 border-b border-gray-700 pb-6">
        <Button onClick={() => setCurrentView('shifts')} variant={currentView === 'shifts' ? 'primary' : 'secondary'}>
          View Shifts
        </Button>
        <Button onClick={() => setCurrentView('products')} variant={currentView === 'products' ? 'primary' : 'secondary'}>
          Manage Products
        </Button>
        <Button onClick={() => setCurrentView('suppliers')} variant={currentView === 'suppliers' ? 'primary' : 'secondary'}>
          Manage Suppliers
        </Button>
        <Button onClick={() => setCurrentView('ordering')} variant={currentView === 'ordering' ? 'primary' : 'secondary'}>
          Stock Ordering
        </Button>
        <Button onClick={() => setCurrentView('hours')} variant={currentView === 'hours' ? 'primary' : 'secondary'}>
          Hours Report
        </Button>
        <Button onClick={onBack} variant="secondary">
          Back to Welcome
        </Button>
      </div>

      {currentView === 'shifts' && renderShiftsView()}
      {currentView === 'products' && (
        <ProductManager 
          products={products}
          suppliers={suppliers}
          isLoading={productsLoading || (loading && suppliers.length === 0)}
          onProductsChange={onProductsChange}
        />
      )}
      {currentView === 'suppliers' && (
        <SupplierManager 
          products={products}
          suppliers={suppliers}
          isLoading={loading && suppliers.length === 0}
          onSuppliersChange={fetchSuppliers}
        />
      )}
      {currentView === 'ordering' && (
        <StockOrdering 
          shifts={shifts}
          shiftsLoading={loading && shifts.length === 0}
        />
      )}
      {currentView === 'hours' && <HoursReport users={uniqueUsers} shiftsLoading={loading && shifts.length === 0}/>}
    </div>
  );
};

export default AdminDashboard;