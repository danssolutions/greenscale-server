import { useState, useRef, useEffect } from 'react';
import { RiArrowDropRightLine } from "react-icons/ri";

interface ViewTypeSelectorProps {
    singleDeviceId: string | null;
    onViewChange: (deviceId: string | null) => void;
    devices: Array<{ id: string }>;
}

export default function ViewTypeSelector({ singleDeviceId, onViewChange, devices }: ViewTypeSelectorProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    const handleDeviceChange = (deviceId: string | null) => {
        onViewChange(deviceId);
        setDropdownOpen(false);
    };

    const buttonClass = (isActive: boolean) =>
        `flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors w-30 ${
            isActive
                ? 'bg-emerald-400 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`;

    return (
        <div className="bg-white rounded-lg shadow p-4 m-2 w-fit mx-auto">
            <div className="flex gap-4 items-center">
                <span className="text-lg font-semibold">View:</span>
                <button
                    onClick={() => handleDeviceChange(null)}
                    className={buttonClass(singleDeviceId === null)}
                >
                    <span>All Devices</span>
                </button>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen((open) => !open)}
                        className={buttonClass(singleDeviceId !== null) + ' w-60 pr-8'}
                    >
                        <RiArrowDropRightLine className="text-3xl absolute right-2 top-1/2 -translate-y-1/2" />
                        <span className="block w-full text-center">
                            {singleDeviceId
                                ? devices.find((d) => d.id === singleDeviceId)?.id || 'One Device'
                                : 'One Device'}
                        </span>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute left-0 bottom-full mb-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg max-h-120 overflow-y-auto">
                            {devices.map((device) => (
                                <button
                                    key={device.id}
                                    onClick={() => handleDeviceChange(device.id)}
                                    className={`block w-full text-left px-4 py-2 hover:bg-emerald-100 ${
                                        singleDeviceId === device.id ? 'bg-emerald-50 font-semibold' : ''
                                    }`}
                                >
                                    {device.id}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
