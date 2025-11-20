import React from 'react';
import MetricCard from '../components/MetricCard';
import type {TelemetryData} from "../types/Telemetry.ts";
import type {Farm} from "../types/Farm.ts";

interface OverviewPageProps {
    farm: Farm;
    latestTelemetry: TelemetryData;
    onEditRanges: () => void;
}

const OverviewPage: React.FC<OverviewPageProps> = ({ farm, latestTelemetry, onEditRanges }) => {
    return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto">
                <button className="float-right px-6 py-3 bg-emerald-400 text-white rounded-lg text-m font-medium cursor-pointer hover:bg-emerald-500 transition-colors" onClick={onEditRanges}>
                    Edit optimal ranges
                </button>
                <div className="clear-both pt-14">
                    <MetricCard
                        title="Temperature"
                        value={latestTelemetry.temperature_c}
                        unitSymbol="°"
                        optimalRangeFrom={farm.temperature_min}
                        optimalRangeTo={farm.temperature_max}
                    />
                    <MetricCard
                        title="pH Level"
                        value={latestTelemetry.ph}
                        optimalRangeFrom={farm.ph_min}
                        optimalRangeTo={farm.ph_max}
                    />
                    <MetricCard
                        title="Dissolved Oxygen"
                        value={latestTelemetry.do_mg_per_l}
                        unit="mg/L"
                        optimalRangeFrom={farm.do_min}
                        optimalRangeTo={farm.do_max}
                    />
                    <MetricCard
                        title="Turbidity"
                        value={latestTelemetry.turbidity_sensor_v}
                        optimalRangeFrom={farm.turbidity_min}
                        optimalRangeTo={farm.turbidity_max}
                    />
                </div>
            </div>
        </div>
    );
};

export default OverviewPage;
