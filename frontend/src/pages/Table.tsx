import React, { useEffect, useState } from 'react';
import { telemetryService } from '../api/client';
import type { TelemetryData } from '../types/Telemetry';

interface TablePageProps {
    deviceId: string | null;
}

const TablePage: React.FC<TablePageProps> = ({ deviceId }) => {
    const [telemetryData, setTelemetryData] = useState<TelemetryData[]>([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const downloadCSV = () => {
        if (telemetryData.length === 0) return;

        // Define headers (excluding id, version, device_id as per requirements)
        const headers = [
            'Date',
            'Time',
            'Online',
            'Uptime',
            'Temperature',
            'pH',
            'DO',
            'Turbidity',
            'Turbidity(cam)',
            'Color(cam)'
        ];

        // Convert data to CSV rows
        const rows = telemetryData.map(data => [
            new Date(data.timestamp).toLocaleString('da-DK', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }),
            data.online ? 'Online' : 'Offline',
            data.uptime_sec,
            data.temperature_c.toFixed(1),
            data.ph.toFixed(2),
            data.do_mg_per_l.toFixed(2),
            data.turbidity_sensor_v.toFixed(3),
            data.turbidity_index.toFixed(2),
            data.avg_color_hex
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${deviceId} ${startDate} ${endDate}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    useEffect(() => {
        const end = new Date();
        end.setMinutes(end.getMinutes() - end.getTimezoneOffset());
        const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);

        setStartDate(start.toISOString().slice(0, 16));
        setEndDate(end.toISOString().slice(0, 16));
    }, []);

    useEffect(() => {
        if (!deviceId || !startDate) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await telemetryService.getByPeriod(
                    deviceId,
                    new Date(startDate).toISOString(),
                    endDate ? new Date(endDate).toISOString() : undefined
                );
                setTelemetryData(data.sort((a, b) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                ));
            } catch (error) {
                console.error('Failed to fetch telemetry data:', error);
                setTelemetryData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [deviceId, startDate, endDate]);

    if (!deviceId) {
        return (
            <div className="flex items-center justify-center h-full">
                Please select a device
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-center mb-6">{deviceId}</h1>

                <div className="bg-white p-6 rounded-xl border-2 border-gray-300 mb-6">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                &nbsp;
                            </label>
                            <button
                                onClick={downloadCSV}
                                disabled={telemetryData.length === 0}
                                className="px-3 py-2 border-2 border-emerald-400 bg-emerald-400 text-white rounded-md hover:bg-emerald-500 hover:border-emerald-500 disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                Save CSV
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        Loading...
                    </div>
                ) : telemetryData.length === 0 ? (
                    <div className="flex items-center justify-center py-12 bg-white rounded-xl border-2 border-gray-300">
                        No data available for selected period
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border-2 border-gray-300 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Timestamp
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Online
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Uptime (sec)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Temperature (°C)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        pH
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        DO (mg/L)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Turbidity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Turbidity (cam)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Avg Color (cam)
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {telemetryData.map((data) => (
                                    <tr key={data.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(data.timestamp).toLocaleString('da-DK', {
                                                dateStyle: 'short',
                                                timeStyle: 'medium'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    data.online ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {data.online ? 'Online' : 'Offline'}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {data.uptime_sec.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {data.temperature_c.toFixed(1)}°
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {data.ph.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {data.do_mg_per_l.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {data.turbidity_sensor_v.toFixed(3)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {data.turbidity_index.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-6 h-6 rounded border border-gray-300"
                                                    style={{ backgroundColor: data.avg_color_hex }}
                                                />
                                                <span className="font-mono text-xs">{data.avg_color_hex}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500 border-t border-gray-200">
                            Total records: {telemetryData.length}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TablePage;
