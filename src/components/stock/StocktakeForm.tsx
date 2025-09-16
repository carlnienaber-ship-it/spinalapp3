import React from 'react';
import { StockCategory, StockItem } from '../../types';
import NumericInput from '../ui/NumericInput';

type StocktakeFormProps = {
  title: string;
  stockData: StockCategory[];
  onStockChange: (categoryIndex: number, itemIndex: number, field: keyof StockItem, value: number) => void;
  disabled?: boolean;
};

// A map to provide more readable keys for the StockItem properties
const headerToKeyMap: { [key: string]: keyof StockItem } = {
  'FOH': 'foh',
  'Store Room': 'storeRoom',
  'Open Bottle Weight': 'openBottleWeight',
  'Quantity': 'quantity',
};

const StocktakeForm: React.FC<StocktakeFormProps> = ({ title, stockData, onStockChange, disabled = false }) => {
  return (
    <div className={`bg-gray-800 p-6 rounded-lg shadow-lg ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h2 className="text-2xl font-bold text-gray-50 mb-6">{title}</h2>
      <div className="space-y-8">
        {stockData.map((category, categoryIndex) => (
          <div key={category.title}>
            <h3 className="text-xl font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">{category.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              {category.items.map((item, itemIndex) => (
                <div key={item.name} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200">{item.name}</label>
                  <div className="flex space-x-2">
                    {category.headers.map(header => {
                      const key = headerToKeyMap[header];
                      if (!key) return null;
                      
                      return (
                        <div key={header} className="flex-1">
                           <NumericInput
                            placeholder={header}
                            aria-label={`${item.name} - ${header}`}
                            value={item[key] || ''}
                            onChange={(e) => onStockChange(categoryIndex, itemIndex, key, parseInt(e.target.value, 10) || 0)}
                            disabled={disabled}
                           />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StocktakeForm;