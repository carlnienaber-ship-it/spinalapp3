import React from 'react';
import { ShiftRecord, Task, StockCategory, StockItem } from '../../types';

type ShiftDetailProps = {
  shift: ShiftRecord;
};

const TaskDetail: React.FC<{ title: string; tasks: Task[] }> = ({ title, tasks }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-200 mt-4 mb-2 border-b border-gray-600 pb-1">{title}</h3>
    <ul className="space-y-2 text-sm">
      {tasks.map(task => (
        <li key={task.id} className="bg-gray-700 p-2 rounded-md">
          <div className="flex justify-between items-center">
            <span className={task.completed ? 'text-gray-400 line-through' : 'text-gray-100'}>{task.text}</span>
            <span className={`font-bold text-xs px-2 py-1 rounded-full ${task.completed ? 'bg-emerald-600 text-emerald-50' : 'bg-red-600 text-red-50'}`}>
              {task.completed ? 'Done' : 'Not Done'}
            </span>
          </div>
          {task.value && <p className="text-xs text-gray-400 pl-2">Selection: {task.value}</p>}
          {task.notes && <p className="text-xs text-gray-300 pl-2 mt-1">Notes: {task.notes}</p>}
        </li>
      ))}
    </ul>
  </div>
);

const StockDetail: React.FC<{ title: string; stock: StockCategory[] }> = ({ title, stock }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-200 mt-4 mb-2 border-b border-gray-600 pb-1">{title}</h3>
    <div className="space-y-3">
      {stock.map(category => {
        const hasTotal = category.headers.includes('FOH') && category.headers.includes('Store Room');
        return (
          <div key={category.title}>
            <h4 className="font-semibold text-gray-300 text-md">{category.title}</h4>
            <table className="w-full text-sm text-left mt-1">
              <thead className="bg-gray-700 text-xs text-gray-400 uppercase">
                <tr>
                  <th className="px-4 py-2">Item</th>
                  {category.headers.map(h => <th key={h} className="px-4 py-2 text-right">{h}</th>)}
                  {hasTotal && <th className="px-4 py-2 text-right font-bold">Total</th>}
                </tr>
              </thead>
              <tbody className="bg-gray-800">
                {category.items.map(item => {
                  const total = (item.foh ?? 0) + (item.storeRoom ?? 0);
                  return (
                    <tr key={item.name} className="border-b border-gray-700">
                      <td className="px-4 py-2 font-medium text-gray-50">{item.name}</td>
                      {category.headers.includes('FOH') && <td className="px-4 py-2 text-right">{item.foh ?? 0}</td>}
                      {category.headers.includes('Store Room') && <td className="px-4 py-2 text-right">{item.storeRoom ?? 0}</td>}
                      {category.headers.includes('Open Bottle Weight') && <td className="px-4 py-2 text-right">{item.openBottleWeight ?? 0}g</td>}
                      {category.headers.includes('Quantity') && <td className="px-4 py-2 text-right">{item.quantity ?? 0}</td>}
                      {hasTotal && <td className="px-4 py-2 text-right font-bold">{total}</td>}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  </div>
);

const ShiftDetail: React.FC<ShiftDetailProps> = ({ shift }) => {
  const ratingEmoji = {
    Great: '😊',
    Normal: '😐',
    Bad: '😞',
  };

  if (!shift) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-h-[85vh] overflow-y-auto">
      <div className="border-b border-gray-600 pb-4 mb-4">
        <div className="flex items-center gap-4">
          <img src={shift.user?.picture} alt={shift.user?.name} className="w-16 h-16 rounded-full" />
          <div>
            <h2 className="text-2xl font-bold text-gray-50">{shift.user?.name}</h2>
            <p className="text-sm text-gray-400">{shift.user?.email}</p>
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-4 grid grid-cols-2 gap-2">
          <p><span className="font-semibold">Shift Start:</span> {shift.startTime ? new Date(shift.startTime).toLocaleString() : 'N/A'}</p>
          <p><span className="font-semibold">Shift End:</span> {shift.endTime ? new Date(shift.endTime).toLocaleString() : 'N/A'}</p>
        </div>
      </div>

      {shift.shiftFeedback && (
        <div className="mb-4 bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">Shift Feedback</h3>
          <div className="flex items-center gap-4">
            <span className="text-3xl">{shift.shiftFeedback.rating ? ratingEmoji[shift.shiftFeedback.rating] : '⚪'}</span>
            <p className="text-gray-300 italic">"{shift.shiftFeedback.comment || 'No comment provided.'}"</p>
          </div>
        </div>
      )}

      {shift.newStockDeliveries && shift.newStockDeliveries.length > 0 && (
        <div className="mb-4">
           <h3 className="text-lg font-semibold text-gray-200 mb-2 border-b border-gray-600 pb-1">New Deliveries</h3>
           <ul className="space-y-1 text-sm">
            {shift.newStockDeliveries.map(d => (
              <li key={d.id} className="flex justify-between bg-gray-700 p-2 rounded-md">
                <span>{d.name}</span>
                <span>Qty: {d.quantity}</span>
              </li>
            ))}
           </ul>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
        <StockDetail title="Opening Stock" stock={shift.openingStock} />
        <StockDetail title="Closing Stock" stock={shift.closingStock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 mt-4">
        <TaskDetail title="Opening Tasks" tasks={shift.openingTasks} />
        <TaskDetail title="Closing Tasks" tasks={shift.closingTasks} />
      </div>
    </div>
  );
};

export default ShiftDetail;