import React from 'react';
import { StockCategory } from '../../types';

type AdminStockDisplayProps = {
  title: string;
  stockData: StockCategory[];
};

const AdminStockDisplay: React.FC<AdminStockDisplayProps> = ({ title, stockData }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-50 mb-6">{title}</h2>
      <div className="space-y-8">
        {stockData.map((category) => {
          if (category.items.length === 0) return null;

          // Determine which columns to display based on the data shape
          const hasTotal = category.headers.includes('FOH');
          const hasWeight = category.headers.includes('Open Bottle Weight');
          const hasQuantity = category.headers.includes('Quantity');

          return (
            <div key={category.title}>
              <h3 className="text-xl font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">{category.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((item) => {
                  const total = (item.foh || 0) + (item.storeRoom || 0);
                  
                  return (
                    <div key={item.name} className="bg-gray-700 p-3 rounded-md shadow">
                      <p className="font-semibold text-gray-100 truncate">{item.name}</p>
                      <div className="flex justify-between items-center mt-2 text-sm text-gray-300">
                        {hasTotal && (
                          <div className="text-center">
                            <span className="text-xs text-gray-400">Total Bottles</span>
                            <p className="font-bold text-lg text-white">{total}</p>
                          </div>
                        )}
                        {hasWeight && (
                          <div className="text-center">
                             <span className="text-xs text-gray-400">Open Weight</span>
                            <p className="font-bold text-lg text-white">{item.openBottleWeight || 0}g</p>
                          </div>
                        )}
                        {hasQuantity && (
                           <div className="text-center">
                             <span className="text-xs text-gray-400">Quantity</span>
                            <p className="font-bold text-lg text-white">{item.quantity || 0}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminStockDisplay;