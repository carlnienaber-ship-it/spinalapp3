// FIX: Implemented the NewStockDelivery component to log new stock.
import React, { useState } from 'react';
import { NewStockDeliveryItem } from '../../types';
import Button from '../ui/Button';
import NumericInput from '../ui/NumericInput';

type NewStockDeliveryProps = {
  deliveries: NewStockDeliveryItem[];
  stockItems: string[];
  onAdd: (item: NewStockDeliveryItem) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
};

const NewStockDelivery: React.FC<NewStockDeliveryProps> = ({ deliveries, stockItems, onAdd, onRemove, disabled = false }) => {
  const [itemName, setItemName] = useState(stockItems[0] || '');
  const [quantity, setQuantity] = useState('1');

  const handleAddItem = () => {
    const numQuantity = parseInt(quantity, 10);
    if (itemName.trim() && !isNaN(numQuantity) && numQuantity > 0) {
      onAdd({
        id: new Date().toISOString(), // simple unique id
        name: itemName.trim(),
        quantity: numQuantity,
      });
      setItemName(stockItems[0] || '');
      setQuantity('1');
    }
  };

  return (
    <div className={`bg-gray-800 p-6 rounded-lg shadow-lg ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h2 className="text-2xl font-bold text-gray-50 mb-6">New Stock Deliveries</h2>
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-200">Add New Item</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="flex-grow rounded-md bg-gray-900 border border-gray-700 px-4 py-2 text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
            disabled={disabled}
            aria-label="Select stock item"
          >
            {stockItems.map(item => (
                <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <NumericInput
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min={1}
            className="w-full sm:w-32"
            disabled={disabled}
          />
          <Button onClick={handleAddItem} disabled={disabled || !itemName.trim() || !(parseInt(quantity, 10) > 0)}>
            Add
          </Button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Logged Deliveries</h3>
        {deliveries.length === 0 ? (
          <p className="text-gray-400">No deliveries logged for this shift.</p>
        ) : (
          <ul className="space-y-3">
            {deliveries.map((item) => (
              <li key={item.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                <span className="text-gray-50">{item.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-gray-300">Quantity: {item.quantity}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemove(item.id)}
                    disabled={disabled}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NewStockDelivery;