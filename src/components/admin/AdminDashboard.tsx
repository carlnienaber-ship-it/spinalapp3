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
import AdminSidebar, { View } from './AdminSidebar';

type AdminDashboardProps = {
  products: Product[];
  productsLoading: boolean;
  onProductsChange: () => Promise<void>;
  onBack: () => void;
};

const viewTitles: Record<View, string> = {
  shifts: 'Shift Reports',
  products: 'Product Management',
  suppliers: 'Supplier Management',
  ordering: 'Stock Ordering Report',
  hours: 'Hours Worked Report',
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, productsLoading, onProductsChange, onBack }) => {
  const [shifts, setShifts] = useState<ShiftRecord[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedShift, setSelectedShift] = useState<ShiftRecord | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentView, setCurrentView] = useState<View>('shifts');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    // Fetch data based on the current view to be efficient
    if (currentView === 'shifts' || currentView === 'ordering' || currentView === 'hours') {
      fetchShifts();
    }
    if (currentView === 'suppliers' || currentView === 'products' || currentView === 'ordering') {
      fetchSuppliers();
    }
  }, [currentView, fetchShifts, fetchSuppliers]);
  
  const handleNavigate = (view: View) => {
    setCurrentView(view);
    setIsSidebarOpen(false); // Close sidebar on navigation
  };

  const filteredShifts = useMemo(() => {
    if (selectedDate) {
      return shifts.filter(shift => {
        if (!shift.startTime) return false;
        const shiftDate = new Date(shift.startTime).toISOString().split('T')[0];
        return shiftDate === selectedDate;
      });
    }
    return shifts.slice(0, 20); // Show more recent shifts by default
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

  const renderShiftsView = () => (
    <>
      {loading && shifts.length === 0 ? (
         <div className="text-center p-8"><p>Loading shift reports...</p></div>
      ) : shifts.length === 0 ? (
        <div className="text-center p-8 bg-gray-800 rounded-lg">
           <p className="text-gray-400 mb-6">No shift reports have been submitted yet.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-50 mb-4 px-2">Recent Shifts</h2>
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
              <ShiftDetail shift={selectedShift} products={products} />
            ) : (
              <div className="bg-gray-800 p-8 rounded-lg text-center h-full flex items-center justify-center">
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

  const renderContent = () => {
    if (error) {
        return (
          <div className="text-center p-8 bg-red-900 text-red-100 rounded-lg">
            <p className="font-bold">Error:</p>
            <p>{error.message}</p>
          </div>
        );
    }

    switch(currentView) {
        case 'shifts':
            return renderShiftsView();
        case 'products':
            return (
              <ProductManager 
                products={products}
                suppliers={suppliers}
                isLoading={productsLoading || (loading && suppliers.length === 0)}
                onProductsChange={onProductsChange}
              />
            );
        case 'suppliers':
            return (
              <SupplierManager 
                products={products}
                suppliers={suppliers}
                isLoading={loading && suppliers.length === 0}
                onSuppliersChange={fetchSuppliers}
              />
            );
        case 'ordering':
            return (
              <StockOrdering 
                shifts={shifts}
                shiftsLoading={loading && shifts.length === 0}
              />
            );
        case 'hours':
            return <HoursReport users={uniqueUsers} shiftsLoading={loading && shifts.length === 0}/>;
        default:
            return <p>Select a view</p>;
    }
  };

  return (
    <div className="relative md:flex min-h-[calc(100vh-200px)]">
      <AdminSidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        onBack={onBack}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex-grow bg-gray-900">
         <header className="md:hidden bg-gray-800 p-4 flex items-center border-b border-gray-700">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-label="Open sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-white ml-4">{viewTitles[currentView]}</h1>
         </header>
         <main className="p-4 sm:p-8">
            <div className="hidden md:block">
              <Header title={viewTitles[currentView]} />
            </div>
            {renderContent()}
         </main>
      </div>
    </div>
  );
};

export default AdminDashboard;