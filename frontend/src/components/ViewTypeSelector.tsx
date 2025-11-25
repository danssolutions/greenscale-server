import { useState, useRef, useEffect } from 'react';
import { RiArrowDropRightLine } from "react-icons/ri";
import type { ViewType } from "../types/ViewType";
import type {Device} from "../types/Device.ts";

interface ViewTypeSelectorProps {
    viewType?: ViewType;
    devices: Device[];
    onViewChange: (viewType: ViewType) => void;
}

export default function ViewTypeSelector({ viewType, devices, onViewChange }: ViewTypeSelectorProps) {
    const [localDeviceId, setLocalDeviceId] = useState(viewType?.deviceId || '');
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

    const handleViewChange = (view: ViewType) => {
        if (view.view === 'device' && localDeviceId) {
            onViewChange(view);
        } else {
            onViewChange(view);
        }
    };

    const handleDeviceChange = (deviceId: string) => {
        setLocalDeviceId(deviceId);
        onViewChange({ view: 'device', deviceId });
        setDropdownOpen(false);
    };

    const buttonClass = (view: ViewType) =>
        `flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors w-30 ${
            viewType?.view === view.view
                ? 'bg-emerald-400 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`;

    return (
        <div className="bg-white rounded-lg shadow p-4 m-2 w-fit mx-auto">
            <div className="flex gap-4 items-center">
                <span className="text-lg font-semibold">View:</span>
                <button
                    onClick={() => handleViewChange({ view: 'average' })}
                    className={buttonClass({ view: 'average' })}
                >
                    <span>Average</span>
                </button>
                <button
                    onClick={() => handleViewChange({ view: 'all-devices' })}
                    className={buttonClass({ view: 'all-devices' })}
                >
                    <span>All Devices</span>
                </button>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => {
                            handleViewChange({view: 'device'});
                            setDropdownOpen((open) => !open);
                        }}
                        className={buttonClass({view: 'device'}) + ' w-60' + ' pr-8'}
                    >
                        <RiArrowDropRightLine className="text-3xl absolute right-2 top-1/2 -translate-y-1/2" />
                        <span className="block w-full text-center">
                            {viewType?.view === 'device' && localDeviceId
                                ? devices.find((d) => d.id === localDeviceId)?.id || 'One Device'
                                : 'One Device'}
                        </span>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute left-0 bottom-full mb-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg max-h-120 overflow-y-auto">
                            {devices.map((device) => (
                                <button
                                    key={device.id}
                                    onClick={() => device.id && handleDeviceChange(device.id)}
                                    className={`block w-full text-left px-4 py-2 hover:bg-emerald-100 ${
                                        localDeviceId === device.id ? 'bg-emerald-50 font-semibold' : ''
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
