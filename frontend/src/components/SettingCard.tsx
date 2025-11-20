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
        <div className="bg-gray-50 p-4 rounded-lg">
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

export default SettingCard;