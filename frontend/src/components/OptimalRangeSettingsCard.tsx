import type {Farm} from "../types/Farm.ts";
import {FiSave} from "react-icons/fi";
import {useState} from "react";
import {farmService} from "../api/client.ts";

interface OptimalRangeSettingsCardProps {
    farm: Farm;
    onSave: (values: Farm) => void;
}
function OptimalRangeSettingsCard({ farm, onSave }: OptimalRangeSettingsCardProps) {
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
        <div className="p-2 bg-white rounded-xl border-2 border-gray-300">
            <h2 className="text-xl font-semibold p-4 text-center">Optimal Ranges</h2>
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
            <div className="p-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full px-2 py-3 bg-emerald-400 text-white rounded-lg hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiSave size={20} />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}

export default OptimalRangeSettingsCard;

interface SettingCardProps<T> {
    title: string;
    minValue: number;
    maxValue: number;
    minField: keyof T;
    maxField: keyof T;
    onChange: (field: keyof T, value: number) => void;
}

function SettingCard<T>({ title, minValue, maxValue, minField, maxField, onChange }: SettingCardProps<T>) {
    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Minimum</label>
                    <input
                        type="number"
                        step="0.1"
                        value={minValue}
                        onChange={(e) => onChange(minField, parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Maximum</label>
                    <input
                        type="number"
                        step="0.1"
                        value={maxValue}
                        onChange={(e) => onChange(maxField, parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>
            </div>
        </div>
    );
}