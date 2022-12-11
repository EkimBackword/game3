import {
    ClankCardConfig,
    ClankDeckConfig,
} from '@shared/clank/clank-card.types';

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

let lastIndex = 0;

export const mappingDeckCards = (data: ClankDeckConfig, withCopy: boolean) => {
    const {cards, ...config} = data;
    return cards.flatMap((card, index) => {
        const copyCount = withCopy ? Math.abs(card.count) : 1;
        return Array(copyCount).fill(1).map((_, copy_index) => {
            lastIndex++;
            if (lastIndex > 1000000) {
                lastIndex = 0;
            }
            const find_string = `${config.dlc_name}_${index}_${config.position}`;
            const cardConfig: ClankCardConfig = {
                ...card,
                ...config,
                id: `${find_string}__${copy_index}_${config.player_id}`,
                find_string,
                index,
                copy_index,
                initIndex: lastIndex,
            };
            return cardConfig;
        });
    });
};
