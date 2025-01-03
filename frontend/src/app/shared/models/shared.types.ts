export const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
    return value !== null && value !== undefined;
};

export function assertNotNullOrUndefined<TValue>(value: TValue): asserts value is NonNullable<TValue> {
    if (!notEmpty(value)) {
        throw new Error(`cannot be undefined or null.`);
    }
}

export function recordKeys<T extends Record<any, any>>(record: T): (keyof T)[] {
    return Object.keys(record) as (keyof T)[];
}

export function isKeyInRecord<T extends Record<any, any>>(key: any, record: T): key is keyof T {
    return key in record;
}

export interface NameValue<
    NameType = string,
    ValueType = string,
> {
    name: NameType;
    value: ValueType
}

export function mergeByDefault<T extends Record<any, any>>(data: any, defaultData: T): T {
    return recordKeys(defaultData).reduce<T>((acc, key) => {
        acc[key] = data?.[key] ?? defaultData[key];
        return acc;
    }, {} as T);
};
