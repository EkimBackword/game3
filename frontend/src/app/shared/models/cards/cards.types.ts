export enum UseCardType {
    use = 'use',
    buy = 'buy',
}

export const UseCardInfoByType: Record<UseCardType, {
    text: string,
}> = {
    [UseCardType.use]: {
        text: 'использовал карту',
    },
    [UseCardType.buy]: {
        text: 'купил карту',
    },
};
