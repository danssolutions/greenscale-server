export interface TelemetryData {
    id: number;
    version: number;
    device_id: string;
    timestamp: string;
    online: boolean;
    uptime_sec: number;
    temperature_c: number;
    ph: number;
    do_mg_per_l: number;
    turbidity_sensor_v: number;
    turbidity_index: number;
    avg_color_hex: string;
}
