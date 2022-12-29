import {
    ClankCostInfo,
    ClankElementType,
} from '@shared/clank/clank-info.types';
import {
    ClankPlayerConfig,
    GamePlayerColorInfo,
} from '@shared/clank/clank-player.types';

export interface PlayerPointsResult {
    name: string;
    config: ClankPlayerConfig;
    colorInfo: GamePlayerColorInfo;
    coins: number;
    tokens: number;
    artifacts: number;
    master: number;
    cards: number;
    total: number;
}

export const updateBenefitInfo = (data: {
    benefit: ClankCostInfo,
    cost: ClankCostInfo,
    isBenefit: boolean,
}) => {
    return (Object.keys(data.cost) as ClankElementType[]).reduce((acc, key) => {
        const prevValue = acc[key] ?? 0;
        const nextValue = data.cost?.[key] ?? 0;
        acc[key] = data.isBenefit
            ? prevValue + nextValue
            : prevValue - nextValue;
        return acc;
    }, data.benefit);
};
