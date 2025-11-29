import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import MetricCard from "../components/MetricCard.tsx";
import type { Farm } from "../types/Farm.ts";
import type { TelemetryData } from "../types/Telemetry.ts";

interface DissolvedOxygenPageProps {
    farm: Farm;
    historicalData: TelemetryData[];
    latestTelemetry: TelemetryData[];
}

const DissolvedOxygenPage: React.FC<DissolvedOxygenPageProps> = ({ farm, historicalData, latestTelemetry }) => {
    const domainMin = Math.floor(farm.do_min - farm.do_max / 2);
    const domainMax = Math.ceil(farm.do_max / 2) * 3;

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
                        time: new Date(item.timestamp).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                        DO: item.do_mg_per_l
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
                                        <AreaChart data={chartData}>
                                            <XAxis dataKey="time" />
                                            <YAxis
                                                orientation="right"
                                                domain={[domainMin, domainMax]}
                                                tickFormatter={(value) => `${value} mg/L`}
                                            />
                                            <Tooltip
                                                formatter={(value) => `${value} mg/L`}
                                                labelFormatter={(label) => `time: ${label}`}
                                            />
                                            <ReferenceArea
                                                y1={farm.do_min}
                                                y2={farm.do_max}
                                                fill="#86efac"
                                                fillOpacity={0.5}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="DO"
                                                stroke="#3bb3bd"
                                                strokeWidth={4}
                                                fill="#b2e6e9"
                                                fillOpacity={0.5}
                                                animationDuration={800}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No data available for the last 24 hours
                                    </div>
                                )}
                            </div>

                            <MetricCard
                                title="Dissolved Oxygen"
                                value={telemetry.do_mg_per_l}
                                unit="mg/L"
                                optimalRangeFrom={farm.do_min}
                                optimalRangeTo={farm.do_max}
                            />
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default DissolvedOxygenPage;
