import React from 'react';
import { VarianceCategory } from '../../utils/varianceCalculator';
import Button from '../ui/Button';

type VarianceReportProps = {
  reportData: VarianceCategory[];
};

const VarianceReport: React.FC<VarianceReportProps> = ({ reportData }) => {
  const handleDownloadCsv = () => {
    const headers = ['Category', 'Item Name', 'Variance'];
    const rows = reportData.flatMap(category =>
      category.items.map(item => {
        let displayVariance: string;
        const fixedVariance = Math.abs(item.variance).toFixed(1);

        if (item.variance > 0) { // Loss
          displayVariance = `-${fixedVariance} ${item.unit}`;
        } else if (item.variance < 0) { // Surplus
          displayVariance = `+${fixedVariance} ${item.unit}`;
        } else { // Neutral
          displayVariance = `${fixedVariance} ${item.unit}`;
        }

        return [category.categoryTitle, item.name, displayVariance];
      })
    );

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(',')) // Handle quotes in fields
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const date = new Date().toISOString().split('T')[0];
    link.href = URL.createObjectURL(blob);
    link.download = `variance_report_${date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-700 p-6 rounded-lg shadow-inner mt-6 space-y-6">
       <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-4">
        <h2 className="text-2xl font-bold text-gray-50">Stock Variance Report</h2>
        <Button onClick={handleDownloadCsv} size="sm" variant="secondary">
          Download CSV
        </Button>
      </div>
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