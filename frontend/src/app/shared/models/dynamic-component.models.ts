import {
    EventEmitter,
    Injector,
    Type,
} from '@angular/core';

export type DynamicUserInputs<T extends {[K in keyof T]?: any}> = {
    [K in keyof T]?: T[K] extends (infer R) ? R : never
};
export type DynamicUserOutputs<T extends {[K in keyof T]?: any}> = {
    [K in keyof T]?: T[K] extends (EventEmitter<infer R>) ? (event: R) => void : never
};

export interface DynamicComponentData<
    ComponentType extends Record<string, any> = any
> {
    component: Type<ComponentType>;
    inputs?: DynamicUserInputs<ComponentType>;
    outputs?: DynamicUserOutputs<ComponentType>;
    injector?: Injector;
}

export class DynamicComponentData<
    ComponentType extends Record<string, any> = any
> {
    constructor(
        config: DynamicComponentData<ComponentType>,
    ) {
        Object.assign(this, config);
    }
}
