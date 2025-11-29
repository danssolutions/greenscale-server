import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import MetricCard from "../components/MetricCard.tsx";
import type { Farm } from "../types/Farm.ts";
import type { TelemetryData } from "../types/Telemetry.ts";

interface TemperaturePageProps {
    farm: Farm;
    historicalData: TelemetryData[];
    latestTelemetry: TelemetryData[];
}

const TemperaturePage: React.FC<TemperaturePageProps> = ({ farm, historicalData, latestTelemetry }) => {
    const domainMin = Math.floor(farm.temperature_min - farm.temperature_max / 2);
    const domainMax = Math.ceil(farm.temperature_max / 2) * 3;
    // Group historical data by device
    const deviceGroups = historicalData.reduce((acc, item) => {
        if (!acc[item.device_id]) {
            acc[item.device_id] = [];
        }
        acc[item.device_id].push(item);
        return acc;
    }, {} as Record<string, TelemetryData[]>);

    return (
        <div className="flex flex-wrap gap-10 p-8 justify-center">
            {latestTelemetry.length === 0 ? (
                <div className="flex items-center justify-center h-full">No data available</div>
            ) : (
                latestTelemetry.map((telemetry) => {
                    const chartData = (deviceGroups[telemetry.device_id] || []).map(item => ({
                        time: new Date(item.timestamp).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' , second: '2-digit' }),
                        temperature: item.temperature_c
                    }));

                    const hasHistoricalData = chartData.length > 0;

                    return (
                        <div key={telemetry.device_id} className="w-3xl p-4 rounded-xl">
                            <h1 className="text-2xl font-bold text-center">{telemetry.device_id}</h1>
                            <span className="block text-right text-sm text-gray-600">
                                {new Date(telemetry.timestamp).toLocaleString('da-DK', { dateStyle: 'short', timeStyle: 'short' })}
                            </span>

                            <div className="relative h-96 mb-8 bg-white p-4 rounded-xl border-2 border-gray-300">
                                {hasHistoricalData ? (
                                    <ResponsiveContainer>
                                        <LineChart data={chartData}>
                                            <XAxis dataKey="time" />
                                            <YAxis
                                                orientation="right"
                                                domain={[domainMin, domainMax]}
                                                tickFormatter={(value) => `${value}°`}
                                            />
                                            <Tooltip
                                                formatter={(value) => `${value}°`}
                                                labelFormatter={(label) => `time: ${label}`}
                                            />
                                            <ReferenceArea
                                                y1={farm.temperature_min}
                                                y2={farm.temperature_max}
                                                fill="#86efac"
                                                fillOpacity={0.5}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="temperature"
                                                stroke="#ef4444"
                                                strokeWidth={4}
                                                dot={false}
                                                animationDuration={800}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No data available for the last 24 hours
                                    </div>
                                )}
                            </div>

                            <MetricCard
                                title="Temperature"
                                value={telemetry.temperature_c}
                                unitSymbol="°"
                                optimalRangeFrom={farm.temperature_min}
                                optimalRangeTo={farm.temperature_max}
                            />
                        </div>
                    );
                })
            )}
        </div>
    );
};


export default TemperaturePage;
