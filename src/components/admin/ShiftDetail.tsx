import React from 'react';
import { ShiftRecord, NewStockDeliveryItem } from '../../types';
import TaskList from '../tasks/TaskList';
import StocktakeForm from '../stock/StocktakeForm';

type ShiftDetailProps = {
  shift: ShiftRecord;
};

const UserInfo: React.FC<{ user: ShiftRecord['user'], startTime: string | null, endTime: string | null }> = ({ user, startTime, endTime }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
        {user?.picture && <img src={user.picture} alt={user.name || 'User'} className="w-16 h-16 rounded-full" />}
        <div>
            <p className="font-bold text-lg text-white">{user?.name || 'Unknown User'}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <p className="text-sm text-gray-400 mt-1">
                Shift: {startTime ? new Date(startTime).toLocaleString() : 'N/A'} - {endTime ? new Date(endTime).toLocaleString() : 'N/A'}
            </p>
        </div>
    </div>
);

const FeedbackDisplay: React.FC<{ feedback: ShiftRecord['shiftFeedback'] }> = ({ feedback }) => {
    const ratingEmojis: { [key in 'Great' | 'Normal' | 'Bad']: string } = { Great: '😊', Normal: '😐', Bad: '😞' };
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-50 mb-4">Shift Feedback</h2>
            <p className="font-semibold text-gray-200">
                Rating: {feedback.rating ? `${ratingEmojis[feedback.rating]} ${feedback.rating}` : 'Not provided'}
            </p>
            {feedback.comment && (
                <div className="mt-2">
                    <p className="font-semibold text-gray-200">Comment:</p>
                    <blockquote className="mt-1 pl-4 border-l-4 border-gray-600 text-gray-300 bg-gray-700 p-2 rounded-r-md">
                        {feedback.comment}
                    </blockquote>
                </div>
            )}
        </div>
    );
};

const DeliveriesDisplay: React.FC<{ deliveries: NewStockDeliveryItem[] }> = ({ deliveries }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-50 mb-4">New Stock Deliveries</h2>
        {deliveries.length > 0 ? (
            <ul className="space-y-2">
                {deliveries.map(item => (
                    <li key={item.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                        <span className="text-gray-50">{item.name}</span>
                        <span className="text-gray-300">Quantity: {item.quantity}</span>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-gray-400">No new deliveries were logged.</p>
        )}
    </div>
);


const ShiftDetail: React.FC<ShiftDetailProps> = ({ shift }) => {
  // A dummy function for the disabled components
  const noop = () => {};

  return (
    <div className="space-y-8 max-h-[80vh] overflow-y-auto pr-2">
      <UserInfo user={shift.user} startTime={shift.startTime} endTime={shift.endTime} />
      
      <FeedbackDisplay feedback={shift.shiftFeedback} />
      
      <DeliveriesDisplay deliveries={shift.newStockDeliveries} />

      <TaskList title="Opening Tasks" tasks={shift.openingTasks} onTaskChange={noop} disabled={true} />
      
      <StocktakeForm title="Opening Stocktake" stockData={shift.openingStock} onStockChange={noop} disabled={true} />
      
      <TaskList title="Closing Tasks" tasks={shift.closingTasks} onTaskChange={noop} disabled={true} />

      <StocktakeForm title="Closing Stocktake" stockData={shift.closingStock} onStockChange={noop} disabled={true} />
    </div>
  );
};

export default ShiftDetail;
