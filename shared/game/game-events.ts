export interface EventsMap {
    [event: string]: any;
}

export type EventNames<
    Map extends EventsMap,
    K extends keyof Map = keyof Map
> = K;

export type EventParams<
    Map extends EventsMap,
    Ev extends EventNames<Map>
> = Parameters<Map[Ev]>;
