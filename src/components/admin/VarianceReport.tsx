import React from 'react';
import { VarianceCategory, StockOnHand } from '../../utils/varianceCalculator';
import Button from '../ui/Button';

type VarianceReportProps = {
  reportData: VarianceCategory[];
};

const formatSOH = (soh: StockOnHand): string => {
    if (typeof soh.quantity === 'number') {
      return `${soh.quantity} units`;
    }
    if (typeof soh.bottles === 'number') {
      return `${soh.bottles} bottles, ${soh.weight || 0}g`;
    }
    return 'N/A';
};

const VarianceReport: React.FC<VarianceReportProps> = ({ reportData }) => {
  const handleDownloadCsv = () => {
    const headers = [
      'Category', 
      'Item Name', 
      'Variance', 
      'Unit', 
      'Opening Bottles', 
      'Opening Weight (g)',
      'Opening Quantity',
      'Closing Bottles',
      'Closing Weight (g)',
      'Closing Quantity'
    ];
    const rows = reportData.flatMap(category =>
      category.items.map(item => {
        // A positive variance from the calculator means a loss (opening > closing),
        // so we represent it as a negative number for typical reporting.
        // A negative variance (surplus) is represented as a positive number.
        const reportVariance = -item.variance;
        
        return [
          category.categoryTitle, 
          item.name, 
          reportVariance.toFixed(2),
          item.unit,
          item.openingSOH.bottles ?? '',
          item.openingSOH.weight ?? '',
          item.openingSOH.quantity ?? '',
          item.closingSOH.bottles ?? '',
          item.closingSOH.weight ?? '',
          item.closingSOH.quantity ?? '',
        ];
      })
    );

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')) // Handle quotes in fields
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
        <Button onClick={handleDownloadCsv} size="sm">
          Download CSV
        </Button>
      </div>
       {reportData.map((category) => (
        <div key={category.categoryTitle}>
            <h3 className="text-xl font-semibold text-gray-200 mb-3">{category.categoryTitle}</h3>
            <ul className="space-y-3">
                {category.items.map(item => {
                    const isLoss = item.variance > 0;
                    const isSurplus = item.variance < 0;

                    const colorClass = isLoss ? 'text-red-400' : isSurplus ? 'text-blue-400' : 'text-gray-100';
                    
                    return (
                        <li key={item.name} className="bg-gray-800 p-3 rounded-md space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-100">{item.name}</span>
                                <div className="text-right">
                                    <p className="font-bold text-lg">
                                        <span className={colorClass}>
                                            {isLoss ? '-' : isSurplus ? '+' : ''}{Math.abs(item.variance).toFixed(1)} {item.unit}
                                        </span>
                                    </p>
                                    <p className="text-xs text-gray-400">Variance</p>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 border-t border-gray-700 pt-2">
                                <span>Opening SOH: <strong className="text-gray-300 font-normal">{formatSOH(item.openingSOH)}</strong></span>
                                <span>Closing SOH: <strong className="text-gray-300 font-normal">{formatSOH(item.closingSOH)}</strong></span>
                            </div>
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