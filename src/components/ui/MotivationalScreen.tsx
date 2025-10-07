import React from 'react';
import Button from './Button';
import { StockCategory } from '../../types';
import Toggle from './Toggle';

type ProductUsageTrackerProps = {
  stockData: StockCategory[];
  servedProducts: { [productName: string]: boolean };
  onProductToggle: (productName: string, isServed: boolean) => void;
  onNewDelivery: () => void;
  onProceed: () => void;
  disabled?: boolean;
};

const ProductUsageTracker: React.FC<ProductUsageTrackerProps> = ({ stockData, servedProducts, onProductToggle, onNewDelivery, onProceed, disabled = false }) => {
  return (
    <div className={`bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Mid-Shift Hub</h2>
        <p className="text-gray-300 mb-6">
          Toggle any product you have served during this shift. This will speed up your closing stocktake.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button onClick={onNewDelivery} size="lg" disabled={disabled} variant="secondary">
            Log New Stock Delivery
          </Button>
          <Button onClick={onProceed} size="lg" disabled={disabled}>
            Proceed to Closing Stocktake
          </Button>
        </div>
      </div>


      {/* Product List */}
      <div className="space-y-6 text-left">
        {stockData.map((category) => (
          <div key={category.title}>
            <h3 className="text-xl font-semibold text-gray-200 mb-3 border-b border-gray-700 pb-2">{category.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              {category.items.map((item) => (
                <Toggle
                  key={item.name}
                  id={`served-${item.name}`}
                  label={item.name}
                  checked={!!servedProducts[item.name]}
                  onChange={(checked) => onProductToggle(item.name, checked)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductUsageTracker;
