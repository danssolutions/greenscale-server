import React from 'react';
import MetricCard from '../components/MetricCard';
import type {TelemetryData} from "../types/Telemetry.ts";
import type {Farm} from "../types/Farm.ts";

interface OverviewPageProps {
    farm: Farm;
    latestTelemetry: TelemetryData[];
}

const OverviewPage: React.FC<OverviewPageProps> = ({ farm, latestTelemetry }) => {
    return (
        <div className="flex flex-wrap gap-10 p-8 justify-center">
            {latestTelemetry.length === 0 ? (
                <div className="flex items-center justify-center h-full">No data available</div>
            ) : (
                latestTelemetry.map((telemetry, idx) => (
                    <div key={telemetry.device_id ?? idx} className="w-3xl p-4 rounded-xl ">
                        <h1 className="text-2xl font-bold text-center">{telemetry.device_id}</h1>
                        <span className="block text-right text-sm text-gray-600">    {new Date(telemetry.timestamp).toLocaleString('da-DK', { dateStyle: 'short', timeStyle: 'short' })}</span>
                        <div className="clear-both">
                            <MetricCard
                                title="Temperature"
                                value={telemetry.temperature_c}
                                unitSymbol="°"
                                optimalRangeFrom={farm.temperature_min}
                                optimalRangeTo={farm.temperature_max}
                            />
                            <MetricCard
                                title="pH Level"
                                value={telemetry.ph}
                                optimalRangeFrom={farm.ph_min}
                                optimalRangeTo={farm.ph_max}
                            />
                            <MetricCard
                                title="Dissolved Oxygen"
                                value={telemetry.do_mg_per_l}
                                unit="mg/L"
                                optimalRangeFrom={farm.do_min}
                                optimalRangeTo={farm.do_max}
                            />
                            <MetricCard
                                title="Turbidity"
                                value={telemetry.turbidity_sensor_v}
                                optimalRangeFrom={farm.turbidity_min}
                                optimalRangeTo={farm.turbidity_max}
                            />
                            <div className="border-2 rounded-xl p-5 border-emerald-400 bg-white">
                                <h3 className="text-base text-gray-700 mb-2 font-medium">
                                    Camera (turbidity, average color)
                                </h3>
                                <div className="flex">
                                    <div className="flex-1 text-5xl font-bold rounded-xl p-1 text-emerald-400">
                                        {telemetry.turbidity_index}
                                    </div>
                                    <div
                                        className="flex-1 flex items-center rounded-full p-1 text-white pl-6"
                                        style={{ backgroundColor: telemetry.avg_color_hex }}
                                    >
                                        {telemetry.avg_color_hex}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default OverviewPage;
