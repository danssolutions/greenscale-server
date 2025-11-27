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
import type {Device} from "./types/Device.ts";

function App() {
    const [activeTab, setActiveTab] = useState('Overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [latestTelemetryDataDevices, setLatestTelemetryDataDevices] = useState<TelemetryData[]>([]);
    const [selectedLatestTelemetryDataDevices, setSelectedLatestTelemetryDataDevices] = useState<TelemetryData[]>([]);
    const [farm, setFarm] = useState<Farm | null>(null);
    const [singleDeviceId, setSingleDeviceId] = useState<string | null>(null);
    const [showViewTypeSelector, setShowViewTypeSelector] = useState(true);
    const [devices, setDevices] = useState<Device[]>([]);
    const [historicalTelemetryData, setHistoricalTelemetryData] = useState<TelemetryData[]>([]);


    const handleViewChange = (deviceId: string | null) => {
        setSingleDeviceId(deviceId);
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
                if (devicesData.length > 0) {
                    setSingleDeviceId(devicesData[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch devices:', error);
            }
        };

        fetchFarmData().catch(error => console.error('Failed to fetch farm data:', error));
        fetchDevices().catch(error => console.error('Failed to fetch devices:', error));
    }, []);

    useEffect(() => {
        const fetchTelemetryData = async () => {
            try {
                const results = await Promise.allSettled(
                    devices.map(device => telemetryService.getLatestByDeviceId(device.id))
                );
                const telemetryArray = results
                    .filter(result =>
                        result.status === 'fulfilled' ||
                        (result.status === 'rejected' && result.reason?.response?.status !== 404)
                    )
                    .map(result => result.status === 'fulfilled' ? result.value as TelemetryData : null)
                    .filter((item): item is TelemetryData => item !== null);
                setLatestTelemetryDataDevices(telemetryArray);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTelemetryData().catch(error => console.error('Failed to fetch telemetry data:', error));

        const interval = setInterval(() => {
            fetchTelemetryData().catch(error => console.error('Failed to fetch telemetry data:', error));
        }, 30000);

        return () => clearInterval(interval);
    }, [devices]);

    useEffect(() => {
        if (singleDeviceId === null) {
            setSelectedLatestTelemetryDataDevices(latestTelemetryDataDevices);
        } else {
            const selectedData = latestTelemetryDataDevices.filter(data => data.device_id === singleDeviceId);
            setSelectedLatestTelemetryDataDevices(selectedData);
        }
    }, [singleDeviceId, latestTelemetryDataDevices]);

    useEffect(() => {
        const fetchHistoricalData = async () => {
            if (devices.length === 0) return;

            try {
                const end = new Date();
                const start = new Date(end.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

                const results = await Promise.allSettled(
                    devices.map(device =>
                        telemetryService.getByPeriod(
                            device.id,
                            start.toISOString()
                        )
                    )
                );

                const allHistoricalData = results
                    .filter(result => result.status === 'fulfilled')
                    .flatMap(result => (result as PromiseFulfilledResult<TelemetryData[]>).value);

                setHistoricalTelemetryData(allHistoricalData);
            } catch (error) {
                console.error('Failed to fetch historical telemetry data:', error);
            }
        };

        fetchHistoricalData().catch(error => console.error('Failed to fetch historical data:', error));

        const interval = setInterval(() => {
            fetchHistoricalData().catch(error => console.error('Failed to fetch historical data:', error));
        }, 300000); // Refresh every 5 minutes

        return () => clearInterval(interval);
    }, [devices]);


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
        if (!latestTelemetryDataDevices.length || !farm) {
            return <div className="flex items-center justify-center h-full">Loading...</div>;
        }

        const currentData = selectedLatestTelemetryDataDevices[0];
        if (!currentData && activeTab !== 'Overview' && activeTab !== 'Settings') {
            return <div className="flex items-center justify-center h-full">No data available</div>;
        }

        switch (activeTab) {
            case 'Overview':
                return <OverviewPage farm={farm} latestTelemetry={selectedLatestTelemetryDataDevices}/>;
            case 'Temperature':
                return <TemperaturePage farm={farm} historicalData={historicalTelemetryData} latestTelemetry={selectedLatestTelemetryDataDevices}/>;
            case 'pH Level':
                return <PhLevelPage farm={farm} historicalData={historicalTelemetryData} latestTelemetry={selectedLatestTelemetryDataDevices}/>;
            case 'Dissolved Oxygen':
                return <DissolvedOxygen farm={farm} historicalData={historicalTelemetryData} latestTelemetry={selectedLatestTelemetryDataDevices}/>;
            case 'Turbidity':
                return <TurbidityPage farm={farm} historicalData={historicalTelemetryData} latestTelemetry={selectedLatestTelemetryDataDevices}/>;
            case 'Settings':
                return <SettingsPage farm={farm} onSave={(updatedFarm) => setFarm(updatedFarm)} />;
            default:
                return <OverviewPage farm={farm} latestTelemetry={latestTelemetryDataDevices}/>;
        }
    };

    return (
        <StrictMode>
            <div className="h-screen bg-gray-100 flex">
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
                    <div className="mt-auto px-2 mb-3">
                        <button className={`flex items-center gap-3 px-2 py-3 rounded-lg cursor-pointer transition-colors w-full ${sidebarOpen ? '' : 'justify-center'} ${showViewTypeSelector ? 'bg-slate-600 text-white' : 'text-white hover:bg-slate-700'}`} onClick={() => setShowViewTypeSelector(!showViewTypeSelector)}>
                            <HiOutlineViewGrid size={32}/>
                            {sidebarOpen && <span>View Selector</span>}
                        </button>
                    </div>
                    <div className="mt-auto px-2 space-y-3 mb-3">
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
                                singleDeviceId={singleDeviceId}
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
