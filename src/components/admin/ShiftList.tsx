import React from 'react';
import { ShiftRecord } from '../../types';

type ShiftListProps = {
  shifts: ShiftRecord[];
  selectedShiftId: string;
  onSelectShift: (shift: ShiftRecord) => void;
};

const ShiftList: React.FC<ShiftListProps> = ({ shifts, selectedShiftId, onSelectShift }) => {
  if (shifts.length === 0) {
    return <p className="text-center text-gray-400 p-4">No shifts to display.</p>;
  }
  
  return (
    <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
      {shifts.map((shift) => (
        <li key={shift.id}>
          <button
            onClick={() => onSelectShift(shift)}
            className={`w-full text-left p-3 rounded-md transition-colors ${
              selectedShiftId === shift.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            <p className="font-semibold">{shift.user?.name || shift.user?.email || 'Unknown User'}</p>
            <p className="text-sm opacity-80">
              {shift.startTime ? new Date(shift.startTime).toLocaleString() : 'No start time'}
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ShiftList;