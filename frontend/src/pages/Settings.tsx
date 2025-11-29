import type { Farm } from '../types/Farm';
import type { Device } from '../types/Device';
import DeviceManagementCard from "../components/DeviceManagementCard.tsx";
import OptimalRangeSettingsCard from "../components/OptimalRangeSettingsCard.tsx";

interface SettingsPageProps {
    farm: Farm;
    devices: Device[];
    onSave: (values: Farm) => void;
    onDevicesChange: (devices: Device[]) => void;
}

function SettingsPage({ farm, devices, onSave, onDevicesChange }: SettingsPageProps) {
    return (
        <div className="gap-10 p-12 max-w-4xl mx-auto pb-25">
            <h1 className="text-2xl font-bold text-center">Settings</h1>
            <div className="p-6 space-y-6">
                <OptimalRangeSettingsCard
                    farm={farm}
                    onSave={onSave}
                />
                <DeviceManagementCard
                    farmId={farm.id!}
                    devices={devices}
                    onDevicesChange={onDevicesChange}
                />
            </div>
        </div>
    );
}

export default SettingsPage;
