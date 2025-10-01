import React, { useState } from 'react';
import { useApiClient } from '../../hooks/useApiClient';
import { DetailedHoursWorkedReport, BulkHoursWorkedReport } from '../../types';
import Button from '../ui/Button';

type User = {
    name: string;
    email: string;
}

type HoursReportProps = {
    users: User[];
    shiftsLoading: boolean;
};

const ALL_USERS_VALUE = 'ALL_USERS';

const HoursReport: React.FC<HoursReportProps> = ({ users, shiftsLoading }) => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [report, setReport] = useState<DetailedHoursWorkedReport | null>(null);
  const [bulkReport, setBulkReport] = useState<BulkHoursWorkedReport | null>(null);
  const { getHoursWorkedReport, getBulkHoursWorkedReport, loading, error } = useApiClient();

  const handleGenerateReport = async () => {
    if (!selectedUserEmail || !startDate || !endDate) return;
    setReport(null);
    setBulkReport(null);
    try {
      if (selectedUserEmail === ALL_USERS_VALUE) {
        const fetchedReport = await getBulkHoursWorkedReport(startDate, endDate);
        setBulkReport(fetchedReport);
      } else {
        const fetchedReport = await getHoursWorkedReport(selectedUserEmail, startDate, endDate);
        setReport(fetchedReport);
      }
    } catch (e) {
      console.error("Failed to generate hours report", e);
    }
  };

  const handleDownloadCsv = () => {
    if (report) {
      const headers = ['Date', 'Clock In Time', 'Clock Out Time', 'Daily Hours'];
      const rows = report.shifts.map(shift => [
        new Date(shift.startTime).toLocaleDateString(),
        new Date(shift.startTime).toLocaleTimeString(),
        new Date(shift.endTime).toLocaleTimeString(),
        shift.hours.toFixed(2)
      ]);
      const totalsRow = ['', '', 'Total Hours:', report.totalHours.toFixed(2)];
      const csvContent = [
        `Report for: ${report.userName}`,
        `Period: ${startDate} to ${endDate}`,
        '',
        headers.join(','),
        ...rows.map(row => row.join(',')),
        '',
        totalsRow.join(',')
      ].join('\n');
      const safeUserName = report.userName.replace(/[^a-z0-9]/gi, '_');
      const filename = `hours_report_${safeUserName}_${startDate}_to_${endDate}.csv`;
      downloadBlob(csvContent, filename);

    } else if (bulkReport) {
      const headers = ['User Name', 'User Email', 'Total Hours'];
      const rows = bulkReport.map(user => [
        user.userName,
        user.userEmail,
        user.totalHours.toFixed(2)
      ]);
      const csvContent = [
        `Bulk Hours Report`,
        `Period: ${startDate} to ${endDate}`,
        '',
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      const filename = `bulk_hours_report_${startDate}_to_${endDate}.csv`;
      downloadBlob(csvContent, filename);
    }
  };

  const downloadBlob = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderDetailedReport = () => {
    if (!report) return null;
    if (report.shifts.length === 0) {
      return (
        <div className="text-center p-8 bg-gray-700 rounded-lg mt-8">
          <h3 className="text-xl font-semibold text-gray-200">No Shifts Found</h3>
          <p className="text-gray-300 mt-2">No completed shifts were found for <span className="font-semibold">{report.userName}</span> in the selected date range.</p>
        </div>
      );
    }

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-50">Detailed Report for: <span className="text-blue-300">{report.userName}</span></h3>
                <Button onClick={handleDownloadCsv} size="sm">Download CSV</Button>
            </div>
            <div className="overflow-x-auto bg-gray-700 rounded-lg">
                <table className="w-full text-left">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="p-3 font-semibold text-gray-200">Date</th>
                            <th className="p-3 font-semibold text-gray-200">Clock In</th>
                            <th className="p-3 font-semibold text-gray-200">Clock Out</th>
                            <th className="p-3 font-semibold text-gray-200 text-right">Hours</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                        {report.shifts.map(shift => (
                            <tr key={shift.id} className="hover:bg-gray-600">
                                <td className="p-3 text-gray-100">{new Date(shift.startTime).toLocaleDateString()}</td>
                                <td className="p-3 text-gray-100">{new Date(shift.startTime).toLocaleTimeString()}</td>
                                <td className="p-3 text-gray-100">{new Date(shift.endTime).toLocaleTimeString()}</td>
                                <td className="p-3 text-gray-100 text-right">{shift.hours.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-800">
                        <tr>
                            <td colSpan={3} className="p-3 text-right font-bold text-gray-200">Total Hours for Period:</td>
                            <td className="p-3 text-right font-bold text-lg text-emerald-400">{report.totalHours.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
  };
  
  const renderBulkReport = () => {
    if (!bulkReport) return null;
     if (bulkReport.length === 0) {
      return (
        <div className="text-center p-8 bg-gray-700 rounded-lg mt-8">
          <h3 className="text-xl font-semibold text-gray-200">No Shifts Found</h3>
          <p className="text-gray-300 mt-2">No completed shifts were found for any user in the selected date range.</p>
        </div>
      );
    }

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-50">Summary Report for All Users</h3>
                <Button onClick={handleDownloadCsv} size="sm">Download CSV</Button>
            </div>
            <div className="overflow-x-auto bg-gray-700 rounded-lg">
                <table className="w-full text-left">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="p-3 font-semibold text-gray-200">User Name</th>
                            <th className="p-3 font-semibold text-gray-200">Email</th>
                            <th className="p-3 font-semibold text-gray-200 text-right">Total Hours</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                        {bulkReport.map(user => (
                            <tr key={user.userEmail} className="hover:bg-gray-600">
                                <td className="p-3 text-gray-100">{user.userName}</td>
                                <td className="p-3 text-gray-100">{user.userEmail}</td>
                                <td className="p-3 text-gray-100 text-right font-semibold">{user.totalHours.toFixed(2)}</td>
                            </tr>
                        ))}
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
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Select a staff member and a date range to generate a detailed log of their hours.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-end justify-center max-w-3xl mx-auto">
        <div className="flex-grow">
            <label htmlFor="user-select" className="block text-sm font-medium text-gray-300 mb-1">Select User</label>
            {shiftsLoading ? <div className="bg-gray-700 p-2 rounded-md text-gray-400">Loading users...</div> :
            <select id="user-select" value={selectedUserEmail} onChange={e => setSelectedUserEmail(e.target.value)} className="w-full bg-gray-700 text-gray-200 rounded-md border-gray-600 p-2 text-base focus:ring-blue-500 focus:border-blue-500">
                <option value="" disabled>-- Please choose an option --</option>
                <option value={ALL_USERS_VALUE}>-- All Users --</option>
                {users.map(user => <option key={user.email} value={user.email}>{user.name}</option>)}
            </select>}
        </div>
        <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
            <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-gray-700 text-gray-200 rounded-md border-gray-600 p-2 text-base focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
            <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} className="w-full bg-gray-700 text-gray-200 rounded-md border-gray-600 p-2 text-base focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
            <Button onClick={handleGenerateReport} disabled={loading || shiftsLoading || !selectedUserEmail || !startDate || !endDate} size="lg">
                {loading ? 'Generating...' : 'Generate'}
            </Button>
        </div>
      </div>
      
      {error && <p className="text-red-400 text-center my-4">Error: {error.message}</p>}
      
      {report && renderDetailedReport()}
      {bulkReport && renderBulkReport()}
    </div>
  );
};

export default HoursReport;