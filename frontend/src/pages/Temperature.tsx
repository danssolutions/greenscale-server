import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import MetricCard from "../components/MetricCard.tsx";
import type { Farm } from "../types/Farm.ts";

interface TemperaturePage {
    currentValue: number;
    farm: Farm;
}

const TemperaturePage: React.FC<TemperaturePage> = ({ currentValue, farm }) => {
    const data = [
        { time: '6:00', temperature: 18 },
        { time: '7:00', temperature: 19 },
        { time: '8:00', temperature: 20 },
        { time: '9:00', temperature: 21 },
        { time: '10:00', temperature: 23 },
        { time: '11:00', temperature: 22 },
        { time: '12:00', temperature: 24 },
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-8">Temperature</h1>

            <div className="relative h-96 mb-8">
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <XAxis dataKey="time" />
                        <YAxis
                            orientation="right"
                            domain={[10, 30]}
                            tickFormatter={(value) => `${value}°`}
                        />
                        <Tooltip formatter={(value) => `${value}°`} />
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
            </div>
            <MetricCard
                title="Temperature"
                value={currentValue}
                unitSymbol="°"
                optimalRangeFrom={farm.temperature_min}
                optimalRangeTo={farm.temperature_max}
            />
        </div>
    );
};

export default TemperaturePage;
