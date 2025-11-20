import React from 'react';
import MetricCard from '../components/MetricCard';
import type { Farm } from '../types/Farm';
import {Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

interface TurbidityPage {
    currentValue: number;
    farm: Farm;
}


const TurbidityPage: React.FC<TurbidityPage> = ({ currentValue, farm }) => {
    const data = [
        { time: '6:00',turbidity: 1 },
        { time: '7:00',turbidity: 2 },
        { time: '8:00',turbidity: 3 },
        { time: '9:00', turbidity: 1 },
        { time: '10:00',turbidity: 2 },
        { time: '11:00', turbidity: 2 },
        { time: '12:00', turbidity: 2 },
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-8">Turbidity</h1>
            <div className="relative h-96 mb-8">
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <XAxis dataKey="time" />
                        <YAxis
                            orientation="right"
                            domain={[0, 10]}
                        />
                        <Tooltip formatter={(value) => `${value}`} />
                        <ReferenceArea
                            y1={farm.turbidity_min}
                            y2={farm.turbidity_max}
                            fill="#86efac"
                            fillOpacity={0.5}
                        />
                        <Line
                            type="monotone"
                            dataKey="turbidity"
                            stroke="#ef4444"
                            strokeWidth={4}
                            dot={false}
                            animationDuration={800}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <MetricCard
                title="Turbidity"
                value={currentValue}
                optimalRangeFrom={farm.turbidity_min}
                optimalRangeTo={farm.turbidity_max}
            />
        </div>
    );
};

export default TurbidityPage;