import React from 'react';

interface MetricCardProps {
    title: string;
    value: number;
    unitSymbol?: string;
    unit?: string;
    optimalRangeFrom: number;
    optimalRangeTo: number;
}

function isInIdealRange(value: number, from: number, to: number): boolean {
    return value >= from && value <= to;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unitSymbol, unit, optimalRangeFrom, optimalRangeTo }) => {
    const status = isInIdealRange(value, optimalRangeFrom, optimalRangeTo);
    return (
        <div className={`border-2 rounded-xl p-5 mb-5 bg-white ${
            status ? 'border-emerald-400' : 'border-red-500'
        }`}>
            <h3 className="text-base text-gray-700 mb-2 font-medium">
                {title}
            </h3>
            <div className="flex justify-between items-center">
                <div className={`text-5xl font-bold ${
                    status ? 'text-emerald-400' : 'text-red-500'
                }`}>
                    {value}{unitSymbol}<span className="text-3xl">{unit}</span>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">
                        {`Optimal range:`}
                    </div>
                    <div className="text-3xl font-bold text-gray-700">
                        {optimalRangeFrom.toFixed(1)}{unitSymbol} - {optimalRangeTo.toFixed(1)}{unitSymbol}
                        <a className="text-xl"> {unit}</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetricCard
