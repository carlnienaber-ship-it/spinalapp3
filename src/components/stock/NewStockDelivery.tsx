// FIX: Implemented the NewStockDelivery component to log new stock.
import React, { useState } from 'react';
import { NewStockDeliveryItem } from '../../types';
import Button from '../ui/Button';
import NumericInput from '../ui/NumericInput';

type NewStockDeliveryProps = {
  deliveries: NewStockDeliveryItem[];
  onAdd: (item: NewStockDeliveryItem) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
};

const NewStockDelivery: React.FC<NewStockDeliveryProps> = ({ deliveries, onAdd, onRemove, disabled = false }) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleAddItem = () => {
    if (itemName.trim() && quantity > 0) {
      onAdd({
        id: new Date().toISOString(), // simple unique id
        name: itemName.trim(),
        quantity,
      });
      setItemName('');
      setQuantity(1);
    }
  };

  return (
    <div className={`bg-gray-800 p-6 rounded-lg shadow-lg ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h2 className="text-2xl font-bold text-gray-50 mb-6">New Stock Deliveries</h2>
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-200">Add New Item</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="flex-grow rounded-md bg-gray-900 border-gray-600 px-4 py-2 text-gray-50 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
            disabled={disabled}
          />
          <NumericInput
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            min={1}
            className="w-full sm:w-32"
            disabled={disabled}
          />
          <Button onClick={handleAddItem} disabled={disabled || !itemName.trim() || quantity <= 0}>
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
