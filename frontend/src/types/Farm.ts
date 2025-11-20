export interface Farm {
    id: number;
    name: string;
    temperature_min: number;
    temperature_max: number;
    ph_min: number;
    ph_max: number;
    do_min: number;
    do_max: number;
    turbidity_min: number;
    turbidity_max: number;
}