import React, { useState, useEffect } from 'react';
import { useApiClient } from '../../hooks/useApiClient';
import { ShiftRecord } from '../../types';
import ShiftList from './ShiftList';
import ShiftDetail from './ShiftDetail';
import Header from '../ui/Header';
import Button from '../ui/Button';

// FIX: Update props to only accept `onBack` for navigation.
type AdminDashboardProps = {
  onBack: () => void;
};

// FIX: Refactor component to fetch its own data.
const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [shifts, setShifts] = useState<ShiftRecord[]>([]);
  const [selectedShift, setSelectedShift] = useState<ShiftRecord | null>(null);
  const { getShifts, loading, error } = useApiClient();

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const fetchedShifts = await getShifts();
        setShifts(fetchedShifts);
      } catch (e) {
        // error is handled by useApiClient hook and displayed below
        console.error("Failed to load shifts", e);
      }
    };

    fetchShifts();
  }, [getShifts]);

  useEffect(() => {
    // When shifts data changes, select the first one by default
    if (shifts.length > 0) {
      setSelectedShift(shifts[0]);
    } else {
      setSelectedShift(null);
    }
  }, [shifts]);


  if (loading && shifts.length === 0) {
    return (
      <div className="text-center p-8">
        <p>Loading shift reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-900 text-red-100 rounded-lg">
        <p className="font-bold">Error loading shifts:</p>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Header title="Admin Dashboard" subtitle="Review submitted shift handovers" />
      
      {shifts.length === 0 ? (
        <div className="text-center p-8 bg-gray-800 rounded-lg">
           <p className="text-gray-400 mb-6">No shift reports have been submitted yet.</p>
           <Button onClick={onBack} variant="secondary">Back to Welcome Screen</Button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <ShiftList
              shifts={shifts}
              selectedShiftId={selectedShift?.id || ''}
              onSelectShift={setSelectedShift}
            />
             <Button onClick={onBack} variant="secondary" className="w-full mt-4">Back to Welcome Screen</Button>
          </div>
          <div className="w-full md:w-2/3 lg:w-3/4">
            {selectedShift ? (
              <ShiftDetail shift={selectedShift} />
            ) : (
              <div className="bg-gray-800 p-8 rounded-lg text-center">
                <p>Select a shift to view its details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
