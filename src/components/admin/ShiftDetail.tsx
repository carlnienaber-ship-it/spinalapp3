import React, { useState, useMemo } from 'react';
import { ShiftRecord, Product } from '../../types';
import TaskList from '../tasks/TaskList';
import NewStockDelivery from '../stock/NewStockDelivery';
import AdminStockDisplay from './AdminStockDisplay';
import Button from '../ui/Button';
import { calculateShiftVariance } from '../../utils/varianceCalculator';
import VarianceReport from './VarianceReport';


type ShiftDetailProps = {
  shift: ShiftRecord;
  products: Product[];
};

const ratingEmojis = {
  Great: '😊 Great',
  Normal: '😐 Normal',
  Bad: '😞 Bad',
};

const ShiftDetail: React.FC<ShiftDetailProps> = ({ shift, products }) => {
  const [showVariance, setShowVariance] = useState(false);
  const varianceReportData = useMemo(() => calculateShiftVariance(shift, products), [shift, products]);
  const allStockItems = Array.from(new Set(shift.openingStock.flatMap(cat => cat.items.map(item => item.name)))).sort();

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-8 max-h-[80vh] overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-50 mb-4 border-b border-gray-700 pb-2">Shift Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="md:col-span-2">
            <p className="font-semibold text-gray-400">Employee:</p>
            <p className="text-gray-100">{shift.user?.email || shift.user?.name || 'N/A'}</p>
          </div>
           <div>
            <p className="font-semibold text-gray-400">Shift Start:</p>
            <p className="text-gray-100">{shift.startTime ? new Date(shift.startTime).toLocaleString() : 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-400">Shift End:</p>
            <p className="text-gray-100">{shift.endTime ? new Date(shift.endTime).toLocaleString() : 'N/A'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="font-semibold text-gray-400">Shift Feedback:</p>
            <p className="text-gray-100 mb-1">{shift.shiftFeedback.rating ? ratingEmojis[shift.shiftFeedback.rating] : 'No rating given.'}</p>
            {shift.shiftFeedback.comment && (
               <blockquote className="text-gray-200 border-l-4 border-gray-600 pl-4 py-2 bg-gray-700 rounded-r-md whitespace-pre-wrap">
                {shift.shiftFeedback.comment}
              </blockquote>
            )}
          </div>
        </div>
      </div>

      <div>
        <Button onClick={() => setShowVariance(!showVariance)} className="w-full">
            {showVariance ? 'Hide Variance Report' : 'Calculate & View Variance Report'}
        </Button>
        {showVariance && <VarianceReport reportData={varianceReportData} />}
      </div>

      <AdminStockDisplay
        title="Opening Stocktake"
        stockData={shift.openingStock}
      />
      
      <NewStockDelivery
        deliveries={shift.newStockDeliveries}
        stockItems={allStockItems}
        onAdd={() => {}} 
        onRemove={() => {}}
        disabled={true}
      />

      <AdminStockDisplay
        title="Closing Stocktake"
        stockData={shift.closingStock}
      />
      
       <TaskList
        title="Opening Tasks"
        tasks={shift.openingTasks}
        onTaskChange={() => {}}
        disabled={true}
      />

      <TaskList
        title="Closing Tasks"
        tasks={shift.closingTasks}
        onTaskChange={() => {}}
        disabled={true}
      />
    </div>
  );
};

export default ShiftDetail;