import React from 'react';
import MetricCard from '../components/MetricCard';
import type { Farm } from '../types/Farm';
import {AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea} from 'recharts';

interface DissolvedOxygenPage {
    currentValue: number;
    farm: Farm;
}

const data = [
    { time: '15:00', DO: 7 },
    { time: '15:02', DO: 8 },
    { time: '15:04', DO: 9 },
    { time: '15:06', DO: 9 },
    { time: '15:07', DO: 7 },
];

const DissolvedOxygenPage: React.FC<DissolvedOxygenPage> = ({ currentValue, farm }) => {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-8">Dissolved Oxygen</h1>
            <div className="relative h-96 mb-8">
                <ResponsiveContainer>
                    <AreaChart data={data}>
                        <XAxis dataKey="time" />
                        <YAxis domain={[0, 20]} />
                        <YAxis
                            orientation="right"
                            domain={[0, 20]}
                        />
                        <Tooltip formatter={(value) => `${value} mg/L`}/>
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
            </div>
            <MetricCard
                title="Dissolved Oxygen"
                value={currentValue}
                unit="mg/L"
                optimalRangeFrom={farm.do_min}
                optimalRangeTo={farm.do_max}
            />
        </div>
    );
};

export default DissolvedOxygenPage;