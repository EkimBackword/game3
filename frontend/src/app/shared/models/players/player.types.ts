import { ClankArtifactConfig } from '@shared/clank/clank-artifact.types';
import { ClankCardConfig } from '@shared/clank/clank-card.types';
import {
    ClankCostInfo,
    ClankElementByMarket,
    ClankElementByMarketList,
    ClankElementType,
} from '@shared/clank/clank-info.types';
import {
    ClankPlayerConfig,
    GamePlayerColorInfo,
} from '@shared/clank/clank-player.types';
import { ClankTokenConfig } from '@shared/clank/clank-token.types';

export interface PlayerPointsResult {
    name: string;
    config: ClankPlayerConfig;
    colorInfo: GamePlayerColorInfo;
    coins: number;
    tokens: {
        points: number;
        list: ClankTokenConfig[];
    };
    artifacts: {
        points: number;
        list: ClankArtifactConfig[];
    };
    cards: {
        points: number;
        list: ClankCardConfig[];
    };
    master: number;
    total: number;
}

export const updateBenefitInfo = (data: {
    benefit: ClankCostInfo,
    cost: ClankCostInfo,
    isBenefit: boolean,
}) => {
    return (Object.keys(data.cost) as ClankElementType[]).reduce((acc, key) => {
        /**
         * Жетоны с маркета можно только получить, при необходимости потратить проверяется только их наличие
         * @description Например, при перемещении по туннелям проверяться только наличие Отмычки.
         */
        if (!data.isBenefit && ClankElementByMarketList.includes(key as ClankElementByMarket)) {
            return acc;
        }
        const prevValue = acc[key] ?? 0;
        const nextValue = data.cost?.[key] ?? 0;
        acc[key] = data.isBenefit
            ? prevValue + nextValue
            : prevValue - nextValue;
        return acc;
    }, data.benefit);
};
