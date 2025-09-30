import React, { useState, useMemo } from 'react';
import { useApiClient } from '../../hooks/useApiClient';
import { HoursWorkedReport, UserHours } from '../../types';
import Button from '../ui/Button';

const HoursReport: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [report, setReport] = useState<HoursWorkedReport | null>(null);
  const { getHoursWorkedReport, loading, error } = useApiClient();

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) return;
    setReport(null);
    try {
      const fetchedReport = await getHoursWorkedReport(startDate, endDate);
      setReport(fetchedReport);
    } catch (e) {
      console.error("Failed to generate hours report", e);
    }
  };
  
  const dateHeaders = useMemo(() => {
    if (!report || !startDate || !endDate) return [];
    const dates = new Set<string>();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Ensure we capture all possible dates from the data within the range
    report.forEach(user => {
        user.dailyBreakdown.forEach(day => dates.add(day.date));
    });

    // Also fill in the range from start to end date to ensure empty days are shown
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        dates.add(new Date(d).toISOString().split('T')[0]);
    }

    return Array.from(dates).sort();
  }, [report, startDate, endDate]);

  const handleDownloadCsv = () => {
    if (!report) return;
    
    const headers = ['User', ...dateHeaders, 'Total Hours'];
    const rows = report.map(user => {
        const dailyMap = new Map(user.dailyBreakdown.map(d => [d.date, d.hours]));
        const row = [
            user.userName,
            ...dateHeaders.map(date => (dailyMap.get(date) || 0).toFixed(2)),
            user.totalHours.toFixed(2)
        ];
        return row;
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `hours_report_${startDate}_to_${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderReportTable = () => {
    if (!report) return null;
    if (report.length === 0) {
      return (
        <div className="text-center p-8 bg-gray-700 rounded-lg mt-8">
          <h3 className="text-xl font-semibold text-gray-200">No Data Found</h3>
          <p className="text-gray-300 mt-2">No completed shifts were found for the selected date range.</p>
        </div>
      );
    }

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-50">Report Results</h3>
                <Button onClick={handleDownloadCsv} size="sm">Download CSV</Button>
            </div>
            <div className="overflow-x-auto bg-gray-700 rounded-lg">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="p-3 font-semibold text-gray-200">User</th>
                            {dateHeaders.map(date => <th key={date} className="p-3 font-semibold text-gray-300 text-center">{new Date(date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</th>)}
                            <th className="p-3 font-semibold text-gray-200 text-center">Total Hours</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                        {report.map(user => {
                            const dailyMap = new Map(user.dailyBreakdown.map(d => [d.date, d.hours]));
                            return (
                                <tr key={user.userEmail} className="hover:bg-gray-600">
                                    <td className="p-3 text-gray-100 font-medium">{user.userName}</td>
                                    {dateHeaders.map(date => {
                                        const hours = dailyMap.get(date) || 0;
                                        return <td key={date} className={`p-3 text-center ${hours > 0 ? 'text-white' : 'text-gray-400'}`}>{hours > 0 ? hours.toFixed(2) : '-'}</td>;
                                    })}
                                    <td className="p-3 text-center font-bold text-emerald-400">{user.totalHours.toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-50">User Hours Worked Report</h2>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Select a date range to generate a report of hours worked by each staff member.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-xl mx-auto">
        <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
            <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-gray-700 text-gray-200 rounded-md border-gray-600 p-2 text-base focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
            <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} className="w-full bg-gray-700 text-gray-200 rounded-md border-gray-600 p-2 text-base focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div className="self-end">
            <Button onClick={handleGenerateReport} disabled={loading || !startDate || !endDate} size="lg">
                {loading ? 'Generating...' : 'Generate Report'}
            </Button>
        </div>
      </div>
      
      {error && <p className="text-red-400 text-center my-4">Error: {error.message}</p>}
      
      {renderReportTable()}
    </div>
  );
};

export default HoursReport;