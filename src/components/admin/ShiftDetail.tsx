// FIX: Implemented the ShiftDetail component to display shift data.
import React from 'react';
import { ShiftRecord } from '../../types';
import TaskList from '../tasks/TaskList';
import StocktakeForm from '../stock/StocktakeForm';
import NewStockDelivery from '../stock/NewStockDelivery';
import Feedback from '../ui/Feedback';

type ShiftDetailProps = {
  shift: ShiftRecord;
};

const ShiftDetail: React.FC<ShiftDetailProps> = ({ shift }) => {
  // Extract all unique stock item names for the NewStockDelivery component dropdown
  const allStockItems = Array.from(new Set(shift.openingStock.flatMap(cat => cat.items.map(item => item.name)))).sort();

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-8 max-h-[80vh] overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-50 mb-4 border-b border-gray-700 pb-2">Shift Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-400">Employee:</p>
            <p className="text-gray-100">{shift.user?.name || shift.user?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-400">Shift Start:</p>
            <p className="text-gray-100">{shift.startTime ? new Date(shift.startTime).toLocaleString() : 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-400">Shift End:</p>
            <p className="text-gray-100">{shift.endTime ? new Date(shift.endTime).toLocaleString() : 'N/A'}</p>
          </div>
        </div>
      </div>

      <TaskList
        title="Opening Tasks"
        tasks={shift.openingTasks}
        onTaskChange={() => {}} // Not needed in disabled mode
        disabled={true}
      />

      <StocktakeForm
        title="Opening Stocktake"
        stockData={shift.openingStock}
        onStockChange={() => {}} // Not needed in disabled mode
        disabled={true}
      />
      
      <NewStockDelivery
        deliveries={shift.newStockDeliveries}
        stockItems={allStockItems}
        onAdd={() => {}} // Not needed in disabled mode
        onRemove={() => {}} // Not needed in disabled mode
        disabled={true}
      />

      <TaskList
        title="Closing Tasks"
        tasks={shift.closingTasks}
        onTaskChange={() => {}} // Not needed in disabled mode
        disabled={true}
      />

      <StocktakeForm
        title="Closing Stocktake"
        stockData={shift.closingStock}
        onStockChange={() => {}} // Not needed in disabled mode
        disabled={true}
      />
      
      <Feedback
        feedback={shift.shiftFeedback}
        onFeedbackChange={() => {}} // Not needed in disabled mode
        disabled={true}
      />
    </div>
  );
};

export default ShiftDetail;
