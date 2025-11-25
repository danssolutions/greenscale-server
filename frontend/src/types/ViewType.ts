export interface ViewType{
    view: view;
    deviceId?: string;
}

export type view = 'average' | 'all-devices' | 'device';
