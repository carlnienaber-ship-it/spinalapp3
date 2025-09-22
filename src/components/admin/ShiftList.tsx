import React from 'react';
import { ShiftRecord } from '../../types';

type ShiftListProps = {
  shifts: ShiftRecord[];
  selectedShiftId: string;
  onSelectShift: (shift: ShiftRecord) => void;
};

const ShiftList: React.FC<ShiftListProps> = ({ shifts, selectedShiftId, onSelectShift }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-50 mb-4 px-2">Shifts</h2>
      <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
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
              <p className="font-semibold">{shift.user?.name || 'Unknown User'}</p>
              <p className="text-sm opacity-80">
                {shift.startTime ? new Date(shift.startTime).toLocaleString() : 'No start time'}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShiftList;
