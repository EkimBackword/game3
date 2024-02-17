export const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
    return value !== null && value !== undefined;
};

export function assertNotNullOrUndefined<TValue>(value: TValue): asserts value is NonNullable<TValue> {
    if (!notEmpty(value)) {
        throw new Error(`cannot be undefined or null.`);
    }
}

export interface NameValue<
    NameType = string,
    ValueType = string,
> {
    name: NameType;
    value: ValueType
}
