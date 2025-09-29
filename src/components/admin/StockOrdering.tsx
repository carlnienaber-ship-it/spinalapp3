import React, { useState } from 'react';
import { useApiClient } from '../../hooks/useApiClient';
import { LowStockReport, SupplierOrder } from '../../types';
import Button from '../ui/Button';

const StockOrdering: React.FC = () => {
  const [report, setReport] = useState<LowStockReport | null>(null);
  const [copiedSupplierId, setCopiedSupplierId] = useState<string | null>(null);
  const { getLowStockReport, loading, error } = useApiClient();

  const handleGenerateReport = async () => {
    try {
      const fetchedReport = await getLowStockReport();
      setReport(fetchedReport);
    } catch (e) {
      console.error("Failed to generate stock report", e);
    }
  };

  const handleCopyToClipboard = (supplierOrder: SupplierOrder) => {
    const orderText = [
      `Hi ${supplierOrder.supplierName},`,
      `Please may I place the following order:`,
      ...supplierOrder.items.map(item => `- ${item.productName}: ${item.recommendedOrder}`),
      `Thank you`
    ].join('\n');

    navigator.clipboard.writeText(orderText).then(() => {
      setCopiedSupplierId(supplierOrder.supplierId);
      setTimeout(() => setCopiedSupplierId(null), 2000); // Reset after 2 seconds
    });
  };

  const renderReport = () => {
    if (!report) return null;

    if (report.orders.length === 0) {
      return (
        <div className="text-center p-8 bg-gray-700 rounded-lg">
          <h3 className="text-xl font-semibold text-emerald-400">All Stock Levels OK</h3>
          <p className="text-gray-300 mt-2">Based on the last shift report from {report.lastShiftDate ? new Date(report.lastShiftDate).toLocaleDateString() : 'N/A'}, no items are at or below their PAR level.</p>
        </div>
      );
    }

    return (
        <div className="space-y-8">
            <p className="text-sm text-center text-gray-400">
                This report is based on the closing stock from the shift ending on {report.lastShiftDate ? new Date(report.lastShiftDate).toLocaleString() : 'N/A'}.
            </p>
            {report.orders.map(supplierOrder => (
                <div key={supplierOrder.supplierId} className="bg-gray-700 p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-3">
                        <div>
                            <h3 className="text-xl font-bold text-gray-50">{supplierOrder.supplierName}</h3>
                            <p className="text-sm text-blue-300">{supplierOrder.supplierEmail}</p>
                        </div>
                        <Button onClick={() => handleCopyToClipboard(supplierOrder)}>
                            {copiedSupplierId === supplierOrder.supplierId ? 'Copied!' : 'Copy Order to Clipboard'}
                        </Button>
                    </div>
                    <table className="w-full text-left table-auto">
                        <thead>
                            <tr className="border-b border-gray-600 text-sm text-gray-400">
                                <th className="py-2">Product</th>
                                <th className="py-2 text-center">Current Stock</th>
                                <th className="py-2 text-center">PAR Level</th>
                                <th className="py-2 text-center font-bold text-white">Recommended Order</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-600">
                            {supplierOrder.items.map(item => (
                                <tr key={item.productName}>
                                    <td className="py-3 pr-4 text-gray-200">{item.productName}</td>
                                    <td className="py-3 text-center text-gray-300">{item.currentStock}</td>
                                    <td className="py-3 text-center text-gray-300">{item.parLevel}</td>
                                    <td className="py-3 text-center text-lg font-bold text-emerald-400">{item.recommendedOrder}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
  };


  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-50">Stock Ordering Report</h2>
        <p className="text-gray-400 mt-2">Generate a list of items that are at or below their PAR level, based on the last completed shift.</p>
        <Button onClick={handleGenerateReport} disabled={loading} size="lg" className="mt-4">
          {loading ? 'Generating...' : "Generate Today's Order Report"}
        </Button>
      </div>

      {error && <p className="text-red-400 text-center my-4">Error: {error.message}</p>}
      
      {renderReport()}
    </div>
  );
};

export default StockOrdering;
