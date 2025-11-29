import { useState } from 'react';
import { deviceService } from '../api/client';
import type { Device } from '../types/Device';

interface DeviceManagementCardProps {
    farmId: number;
    devices: Device[];
    onDevicesChange: (devices: Device[]) => void;
}

function DeviceManagementCard({ farmId, devices, onDevicesChange }: DeviceManagementCardProps) {
    const [newDeviceId, setNewDeviceId] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [deletingDeviceId, setDeletingDeviceId] = useState<string | null>(null);
    const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null);

    const handleAddDevice = async () => {
        if (!newDeviceId.trim()) return;

        setIsAdding(true);
        try {
            const newDevice = await deviceService.create({
                id: newDeviceId.trim(),
                farm_id: farmId
            });
            onDevicesChange([...devices, newDevice]);
            setNewDeviceId('');
        } catch (error) {
            console.error('Failed to add device:', error);
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteDevice = async (deviceId: string) => {
        setDeletingDeviceId(deviceId);
        try {
            await deviceService.delete(deviceId);
            onDevicesChange(devices.filter(d => d.id !== deviceId));
            setDeviceToDelete(null);
        } catch (error) {
            console.error('Failed to delete device:', error);
        } finally {
            setDeletingDeviceId(null);
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl border-2 border-gray-300 p-6">
                <h2 className="text-xl font-semibold mb-4 text-center">Device Management</h2>

                <div className="space-y-2">
                    {devices.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No devices found</p>
                    ) : (
                        devices.map((device) => (
                            <div
                                key={device.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <span className="font-medium">{device.id}</span>
                                <button
                                    onClick={() => setDeviceToDelete(device.id)}
                                    disabled={deletingDeviceId === device.id}
                                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newDeviceId}
                            onChange={(e) => setNewDeviceId(e.target.value)}
                            placeholder="Enter device ID"
                            className="flex-1 px-3 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            disabled={isAdding}
                        />
                        <button
                            onClick={handleAddDevice}
                            disabled={isAdding || !newDeviceId.trim()}
                            className="px-4 py-2 bg-emerald-400 text-white rounded-lg hover:bg-emerald-500 transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isAdding ? 'Adding...' : 'Add Device'}
                        </button>
                    </div>
                </div>
            </div>

            {deviceToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 min-h-screen">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete device <strong>{deviceToDelete}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeviceToDelete(null)}
                                disabled={deletingDeviceId !== null}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteDevice(deviceToDelete)}
                                disabled={deletingDeviceId !== null}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {deletingDeviceId === deviceToDelete ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default DeviceManagementCard;
