import {StrictMode, useEffect, useState} from 'react';
import OverviewPage from './pages/Overview.tsx';
import TemperaturePage from './pages/Temperature.tsx';
import PhLevelPage from './pages/PhLevel.tsx';
import DissolvedOxygen from './pages/DissolvedOxygen.tsx';
import TurbidityPage from './pages/Turbidity.tsx';
import {FiHome, FiThermometer, FiEye, FiSettings} from 'react-icons/fi';
import {BiTestTube, BiWater} from "react-icons/bi";
import { HiOutlineViewGrid } from "react-icons/hi";
import {farmService, telemetryService} from './api/client';
import type {TelemetryData} from "./types/Telemetry.ts";
import type {Farm} from "./types/Farm.ts";
import SettingsPage from "./pages/Settings.tsx";
import ViewTypeSelector from './components/ViewTypeSelector.tsx';
import type { ViewType } from './types/ViewType';
import type {Device} from "./types/Device.ts";

function App() {
    const [activeTab, setActiveTab] = useState('Overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [latestTelemetry, setLatestTelemetry] = useState<TelemetryData | null>(null);
    const [farm, setFarm] = useState<Farm | null>(null);
    const [viewType, setViewType] = useState<ViewType>({ view: 'average' });
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('greenscale-edge');
    const [showViewTypeSelector, setShowViewTypeSelector] = useState(true);
    const [devices, setDevices] = useState<Device[]>([{ id: 'no devices found'}]);
    const handleViewChange = (view: ViewType, deviceId?: string) => {
        setViewType(view);
        if (deviceId) {
            setSelectedDeviceId(deviceId);
        }
    };

    useEffect(() => {
        const fetchFarmData = async () => {
            try {
                const farmData = await farmService.getById(1);
                setFarm(farmData);
            } catch (error) {
                console.error('Failed to fetch farm data:', error);
            }
        };

        const fetchDevices = async () => {
            try {
                const devicesData = await farmService.getDevices(1);
                setDevices(devicesData);
            } catch (error) {
                console.error('Failed to fetch devices:', error);
            }
        };
        const fetchTelemetryData = async () => {
            try {
                const telemetryData = await telemetryService.getLatestByDeviceId('greenscale-edge');
                setLatestTelemetry(telemetryData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFarmData().catch(error => console.error('Failed to fetch farm data:', error));
        fetchTelemetryData().catch(error => console.error('Failed to fetch telemetry data:', error));
        fetchDevices().catch(error => console.error('Failed to fetch devices:', error));

        const interval = setInterval(() => {
            fetchTelemetryData().catch(error => console.error('Failed to fetch telemetry data:', error));
        }, 30000);

        return () => clearInterval(interval);
    }, []);


    const menuItems = [
        {
            key: 'Overview',
            label: 'Overview',
            icon: <FiHome size={32} />,
            onClick: () => setActiveTab('Overview')
        },
        {
            key: 'Temperature',
            label: 'Temperature',
            icon: <FiThermometer size={32} />,
            onClick: () => setActiveTab('Temperature')
        },
        {
            key: 'pH Level',
            label: 'pH Level',
            icon: <BiTestTube size={32} />,
            onClick: () => setActiveTab('pH Level')
        },
        {
            key: 'Dissolved Oxygen',
            label: 'Dissolved Oxygen',
            icon: <BiWater size={32} />,
            onClick: () => setActiveTab('Dissolved Oxygen')
        },
        {
            key: 'Turbidity',
            label: 'Turbidity',
            icon: <FiEye size={32} />,
            onClick: () => setActiveTab('Turbidity')
        }
    ];

    const renderPage = () => {
        if (!latestTelemetry || !farm) {
            return <div className="flex items-center justify-center h-full">Loading...</div>;
        }

        const viewProps = { viewType };

        switch (activeTab) {
            case 'Overview':
                return <OverviewPage farm={farm} latestTelemetry={latestTelemetry} onEditRanges={() => setActiveTab('Settings')} {...viewProps} />;
            case 'Temperature':
                return <TemperaturePage currentValue={latestTelemetry.temperature_c} farm={farm}/>;
            case 'pH Level':
                return <PhLevelPage currentValue={latestTelemetry.ph} farm={farm}/>;
            case 'Dissolved Oxygen':
                return <DissolvedOxygen currentValue={latestTelemetry.do_mg_per_l} farm={farm}/>;
            case 'Turbidity':
                return <TurbidityPage currentValue={latestTelemetry.turbidity_sensor_v} farm={farm}/>;
            case 'Settings':
                return <SettingsPage farm={farm} onSave={(updatedFarm) => setFarm(updatedFarm)} />;
            default:
                return <OverviewPage farm={farm} latestTelemetry={latestTelemetry} onEditRanges={() => setActiveTab('Settings')} />;
        }
    };

    return (
        <StrictMode>
            <div className="height-screen bg-gray-100 flex">
                <div className={`${sidebarOpen ? 'w-64' : 'w-18'} h-screen overflow-hidden bg-slate-900 border-r flex flex-col fixed`}>
                    <div className="mt-3 px-2">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={`flex items-center gap-3 px-1 py-3 rounded-lg cursor-pointer transition-colors w-full text-white hover:bg-slate-700 justify-center h-14`}>
                            {sidebarOpen && <span className="text-2xl font-semibold">FishWise</span>}
                            <img src="/icon.png" alt="App Icon" width={48} height={48} className="text-emerald-500" />
                        </button>
                    </div>
                    <nav className="flex-1 space-y-3 px-2 mt-3">
                        {menuItems.map((item) => (
                            <div
                                key={item.key}
                                onClick={item.onClick}
                                className={`flex items-center gap-3 px-2 py-3 rounded-lg cursor-pointer transition-colors ${sidebarOpen ? '' : 'justify-center'} ${activeTab === item.key ? 'bg-emerald-500 text-white' : 'text-white hover:bg-slate-700'}`}>
                                {item.icon}
                                {sidebarOpen && <span>{item.label}</span>}
                            </div>
                        ))}
                    </nav>
                    <div className="mt-auto px-2 sapce-y-3 mb-3">
                        <button className={`flex items-center gap-3 px-2 py-3 rounded-lg cursor-pointer transition-colors w-full ${sidebarOpen ? '' : 'justify-center'} ${showViewTypeSelector ? 'bg-slate-600 text-white' : 'text-white hover:bg-slate-700'}`} onClick={() => setShowViewTypeSelector(!showViewTypeSelector)}>
                            <HiOutlineViewGrid size={32}/>
                            {sidebarOpen && <span>View Selector</span>}
                        </button>
                    </div>
                    <div className="mt-auto px-2 sapce-y-3 mb-3">
                        <button className={`flex items-center gap-3 px-2 py-3 rounded-lg cursor-pointer transition-colors w-full ${sidebarOpen ? '' : 'justify-center'} ${activeTab === "Settings" ? 'bg-emerald-500 text-white' : 'text-white hover:bg-slate-700'}`} onClick={() => setActiveTab('Settings')}>
                            <FiSettings size={32}/>
                            {sidebarOpen && <span>Settings</span>}
                        </button>
                    </div>
                </div>
                <div className="flex-1 h-screen overflow-auto relative" style={{ marginLeft: sidebarOpen ? '16rem' : '4.5rem' }}>
                    {showViewTypeSelector && (
                        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50" style={{ marginLeft: sidebarOpen ? '8rem' : '2.25rem' }}>
                            <ViewTypeSelector
                                viewType={viewType}
                                devices={devices}
                                onViewChange={handleViewChange}
                            />
                        </div>
                    )}
                    {renderPage()}
                </div>
            </div>
        </StrictMode>
    );
}

export default App;
