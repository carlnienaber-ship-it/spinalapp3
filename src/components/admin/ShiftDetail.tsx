import React from 'react';
import { ShiftRecord, Task, StockItem, NewStockDeliveryItem } from '../../types';
import TaskList from '../tasks/TaskList';
import StocktakeForm from '../stock/StocktakeForm';
import Feedback from '../ui/Feedback';
import NewStockDelivery from '../stock/NewStockDelivery';

type ShiftDetailProps = {
  shift: ShiftRecord;
};

const ShiftDetail: React.FC<ShiftDetailProps> = ({ shift }) => {
  const {
    user,
    startTime,
    endTime,
    shiftFeedback,
    openingTasks,
    closingTasks,
    openingStock,
    closingStock,
    newStockDeliveries,
  } = shift;

  // Mock handlers as components are disabled and don't need to function.
  const mockTaskChange = (updatedTask: Task) => {};
  const mockStockChange = (categoryIndex: number, itemIndex: number, field: keyof StockItem, value: number) => {};
  const mockFeedbackChange = (rating: 'Great' | 'Normal' | 'Bad' | null, comment: string) => {};
  const mockDeliveryAdd = (item: NewStockDeliveryItem) => {};
  const mockDeliveryRemove = (id: string) => {};

  // This logic is required by the NewStockDelivery component to populate the dropdown.
  const allStockItems = React.useMemo(() => {
    const itemSet = new Set<string>();
    shift.openingStock.forEach(category => {
      category.items.forEach(item => {
        itemSet.add(item.name);
      });
    });
    return Array.from(itemSet).sort();
  }, [shift.openingStock]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-8 max-h-[80vh] overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-50 mb-4">Shift Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-900 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-400">Employee</p>
            <div className="flex items-center mt-1">
              {user?.picture && <img src={user.picture} alt={user.name || 'avatar'} className="w-8 h-8 rounded-full mr-3" />}
              <p className="font-semibold text-gray-50">{user?.name || 'N/A'}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="font-semibold text-gray-50 mt-1">{user?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Shift Start</p>
            <p className="font-semibold text-gray-50 mt-1">{startTime ? new Date(startTime).toLocaleString() : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Shift End</p>
            <p className="font-semibold text-gray-50 mt-1">{endTime ? new Date(endTime).toLocaleString() : 'N/A'}</p>
          </div>
        </div>
      </div>
      
      <Feedback 
        feedback={shiftFeedback} 
        onFeedbackChange={mockFeedbackChange} 
        disabled 
      />
      
      <NewStockDelivery
        deliveries={newStockDeliveries}
        stockItems={allStockItems}
        onAdd={mockDeliveryAdd}
        onRemove={mockDeliveryRemove}
        disabled
      />
      
      <TaskList
        title="Opening Tasks"
        tasks={openingTasks}
        onTaskChange={mockTaskChange}
        disabled
      />
      
      <StocktakeForm
        title="Opening Stocktake"
        stockData={openingStock}
        onStockChange={mockStockChange}
        disabled
      />
      
      <TaskList
        title="Closing Tasks"
        tasks={closingTasks}
        onTaskChange={mockTaskChange}
        disabled
      />
      
      <StocktakeForm
        title="Closing Stocktake"
        stockData={closingStock}
        onStockChange={mockStockChange}
        disabled
      />
    </div>
  );
};

export default ShiftDetail;
