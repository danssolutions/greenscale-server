import { useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { farmService } from '../api/client';
import type { Farm } from '../types/Farm';
import SettingCard from "../components/SettingCard.tsx";

interface SettingsPageProps {
    farm: Farm;
    onSave: (values: Farm) => void;
}

function SettingsPage({ farm, onSave }: SettingsPageProps) {
    const [values, setValues] = useState<Farm>(farm);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (field: keyof Farm, value: number) => {
        setValues(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!values.id) return;

        setIsSaving(true);
        try {
            const updatedFarm = await farmService.update(values.id, values);
            onSave(updatedFarm);
        } catch (error) {
            console.error('Failed to save farm settings:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-8">Settings</h1>
            <div className="max-w-4xl mx-auto">
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SettingCard<Farm>
                            title="Temperature (°C)"
                            minValue={values.temperature_min}
                            maxValue={values.temperature_max}
                            minField="temperature_min"
                            maxField="temperature_max"
                            onChange={handleChange}
                        />
                        <SettingCard<Farm>
                            title="pH Level"
                            minValue={values.ph_min}
                            maxValue={values.ph_max}
                            minField="ph_min"
                            maxField="ph_max"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SettingCard<Farm>
                            title="Dissolved Oxygen (mg/L)"
                            minValue={values.do_min}
                            maxValue={values.do_max}
                            minField="do_min"
                            maxField="do_max"
                            onChange={handleChange}
                        />
                        <SettingCard<Farm>
                            title="Turbidity (V)"
                            minValue={values.turbidity_min}
                            maxValue={values.turbidity_max}
                            minField="turbidity_min"
                            maxField="turbidity_max"
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="ps-6">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full px-2 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiSave size={20} />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                </div>
            </div>
        </div>

    );
}

export default SettingsPage;
