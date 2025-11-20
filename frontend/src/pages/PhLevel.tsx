import React from 'react';
import MetricCard from '../components/MetricCard';
import type {Farm} from "../types/Farm.ts";
import {Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

interface PhLevelPage {
    currentValue: number;
    farm: Farm;
}

const PhLevelPage: React.FC<PhLevelPage> = ({ currentValue, farm }) => {
    const data = [
        { time: '6:00', pH: 8 },
        { time: '7:00', pH: 9 },
        { time: '8:00', pH: 5 },
        { time: '9:00', pH: 8 },
        { time: '10:00', pH: 10 },
        { time: '11:00', pH: 10 },
        { time: '12:00', pH: 11 },
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-8">pH Level</h1>

            <div className="relative h-96 mb-8">
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <XAxis dataKey="time" />
                        <YAxis
                            orientation="right"
                            domain={[0, 14]}
                        />
                        <Tooltip/>
                        <ReferenceArea
                            y1={farm.ph_min}
                            y2={farm.ph_max}
                            fill="#86efac"
                            fillOpacity={0.5}
                        />
                        <Line
                            type="monotone"
                            dataKey="pH"
                            stroke="#ef4444"
                            strokeWidth={4}
                            dot={false}
                            animationDuration={800}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
                <MetricCard
                    title="pH Level"
                    value={currentValue}
                    optimalRangeFrom={farm.ph_min}
                    optimalRangeTo={farm.ph_max}
                />
        </div>
    );
};

export default PhLevelPage;