import React from 'react';
import { VarianceCategory } from '../../utils/varianceCalculator';

type VarianceReportProps = {
  reportData: VarianceCategory[];
};

const VarianceReport: React.FC<VarianceReportProps> = ({ reportData }) => {

  return (
    <div className="bg-gray-700 p-6 rounded-lg shadow-inner mt-6 space-y-6">
       <h2 className="text-2xl font-bold text-gray-50 mb-4 border-b border-gray-600 pb-2">Stock Variance Report</h2>
       {reportData.map((category) => (
        <div key={category.categoryTitle}>
            <h3 className="text-xl font-semibold text-gray-200 mb-3">{category.categoryTitle}</h3>
            <ul className="space-y-2">
                {category.items.map(item => {
                    const isLoss = item.variance > 0;
                    const isSurplus = item.variance < 0;

                    const colorClass = isLoss ? 'text-red-400' : isSurplus ? 'text-blue-400' : 'text-gray-100';
                    
                    return (
                        <li key={item.name} className="flex justify-between items-center bg-gray-800 p-3 rounded-md">
                            <span className="text-gray-300">{item.name}</span>
                            <span className={`font-bold text-lg ${colorClass}`}>
                                {isLoss ? '-' : isSurplus ? '+' : ''}{Math.abs(item.variance).toFixed(1)} {item.unit}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
       ))}
    </div>
  );
};

export default VarianceReport;