import React from 'react';
import { ShiftRecord } from '../../types';
import TaskList from '../tasks/TaskList';
import StocktakeForm from '../stock/StocktakeForm';
import Feedback from '../ui/Feedback';
import NewStockDelivery from '../stock/NewStockDelivery';

type ShiftDetailProps = {
  shift: ShiftRecord;
};

const ShiftDetail: React.FC<ShiftDetailProps> = ({ shift }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // The on*Change props are no-ops as the components are disabled.
  const noOp = () => {};

  return (
    <div className="space-y-6 h-full max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-50 mb-4 border-b border-gray-700 pb-2">Shift Summary</h2>
        <div className="flex items-center space-x-4">
          {shift.user?.picture && <img src={shift.user.picture} alt={shift.user.name || 'User'} className="w-16 h-16 rounded-full" />}
          <div>
            <p className="text-lg font-semibold text-gray-100">{shift.user?.name || 'Unknown User'}</p>
            <p className="text-sm text-gray-400">{shift.user?.email}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-300">Shift Start:</p>
            <p className="text-gray-400">{formatDate(shift.startTime)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-300">Shift End:</p>
            <p className="text-gray-400">{formatDate(shift.endTime)}</p>
          </div>
        </div>
      </div>

      <TaskList
        title="Opening Tasks"
        tasks={shift.openingTasks || []}
        onTaskChange={noOp}
        disabled
      />
      <StocktakeForm
        title="Opening Stocktake"
        stockData={shift.openingStock || []}
        onStockChange={noOp}
        disabled
      />
      
      <NewStockDelivery
        deliveries={shift.newStockDeliveries || []}
        stockItems={[]}
        onAdd={noOp}
        onRemove={noOp}
        disabled
      />

      <TaskList
        title="Closing Tasks"
        tasks={shift.closingTasks || []}
        onTaskChange={noOp}
        disabled
      />
      <StocktakeForm
        title="Closing Stocktake"
        stockData={shift.closingStock || []}
        onStockChange={noOp}
        disabled
      />
      
      {shift.shiftFeedback?.rating && (
         <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
             <Feedback feedback={shift.shiftFeedback} onFeedbackChange={noOp} disabled />
         </div>
      )}
    </div>
  );
};

export default ShiftDetail;
