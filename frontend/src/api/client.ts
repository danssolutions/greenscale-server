import axios from 'axios';
import type { TelemetryData } from '../types/Telemetry.ts';
import type {Farm} from "../types/Farm.ts";
import type {Device} from "../types/Device.ts";


const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Accept': 'application/json',
    },
});

export const telemetryService = {
    getLatestByDeviceId: async (deviceId: string): Promise<TelemetryData> => {
        const response = await api.get<TelemetryData>(`/telemetry-data/${deviceId}/latest`);
        return response.data;
    },
    getByPeriod: async (
        deviceId: string,
        start: string,
        end?: string
    ): Promise<TelemetryData[]> => {
        const params = new URLSearchParams({ start });
        if (end) params.append('end', end);
        const response = await api.get<TelemetryData[]>(
            `/telemetry-data/${deviceId}/period?${params.toString()}`
        );
        return response.data;
    },
};

export const farmService = {
    getById: async (farmId: number): Promise<Farm> => {
        const response = await api.get<Farm>(`/farms/${farmId}`);
        return response.data;
    },

    create: async (farm: Farm): Promise<Farm> => {
        const response = await api.post<Farm>('/farms', farm);
        return response.data;
    },

    update: async (farmId: number, farm: Farm): Promise<Farm> => {
        const response = await api.put<Farm>(`/farms/${farmId}/edit`, farm);
        return response.data;
    },

    delete: async (farmId: number): Promise<void> => {
        await api.delete(`/farms/${farmId}/delete`);
    },

    getDevices: async (farmId: number): Promise<Device[]> => {
        const response = await api.get<Device[]>(`/farms/${farmId}/devices`);
        return response.data;
    },
};

export const deviceService = {
    create: async (device: Device): Promise<Device> => {
        const response = await api.post<Device>('/devices', device);
        return response.data;
    },

    delete: async (deviceId: string): Promise<void> => {
        await api.delete(`/devices/${deviceId}/delete`);
    },
};
export default api;