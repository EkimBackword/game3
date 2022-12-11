import {
    ClankCardType,
    ClankCardTypeList,
    ClankEffect,
    ClankEffectList,
    ClankElementByActions,
    ClankElementByGame,
    ClankElementByGameList,
    ClankElementByMarket,
    ClankElementByToken,
    ClankElementByTurn,
    ClankElementByTurnList,
    ClankElementType,
    ClankElementTypeEnum,
    ClankElementTypeList,
} from '@shared/clank/clank-info.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';

export interface ClankElementTypeInfo {
    name: string;
    url: string;
}

export enum ClankCostInfoType {
    all = 'all',
    gameInfo = 'gameInfo',
    turnInfo = 'turnInfo',
    marketInfo = 'marketInfo',
    cardsInfo = 'cardsInfo',
    effectsInfo = 'effectsInfo',
}

export const ClankCostInfoKeysByType: Record<ClankCostInfoType, ClankElementType[][]> = {
    all: [ClankElementTypeList],
    gameInfo: [ClankElementByGameList],
    turnInfo: [ClankElementByTurnList],
    marketInfo: [
        [
            ClankElementTypeEnum.skill,
            ClankElementTypeEnum.sword,
            ClankElementTypeEnum.coin,
        ],
    ],
    cardsInfo: [ClankCardTypeList],
    effectsInfo: [ClankEffectList],
};

export const ClankOneTurnInfo = [
    ...ClankElementByTurnList,
    ...ClankCardTypeList,
    ...ClankEffectList,
];

export const ClankElementTypeMap: Record<string, ClankElementTypeInfo> = {
    // ClankCardType
    [ClankCardType.start]: {
        name: 'Стартовая карта',
        url: '/assets/images/cards/start.png',
    },
    [ClankCardType.basiс]: {
        name: 'Базовая карта',
        url: '/assets/images/cards/basiс.png',
    },
    [ClankCardType.device]: {
        name: 'Устройство',
        url: '/assets/images/cards/device.png',
    },
    [ClankCardType.monster]: {
        name: 'Монстр',
        url: '/assets/images/cards/monster.png',
    },
    [ClankCardType.companion]: {
        name: 'Компаньон',
        url: '/assets/images/cards/companion.png',
    },
    [ClankCardType.gem]: {
        name: 'Самоцвет',
        url: '/assets/images/cards/gem.png',
    },
    // ClankElementByTurn
    [ClankElementByTurn.skill]: {
        name: 'Навык',
        url: '/assets/images/skill.png',
    },
    [ClankElementByTurn.sword]: {
        name: 'Меч',
        url: '/assets/images/sword.png',
    },
    [ClankElementByTurn.boot]: {
        name: 'Ботинок',
        url: '/assets/images/boot.png',
    },
    [ClankElementByTurn.teleport]: {
        name: 'Телепорт',
        url: '/assets/images//teleport.png',
    },
    // ClankElementByGame
    [ClankElementByGame.heal]: {
        name: 'Здоровье',
        url: '/assets/images/heal.png',
    },
    [ClankElementByGame.curse]: {
        name: 'Проклятие',
        url: '/assets/images/tokens/map_tokens/clank_proklyatie_mumii/token.jpg',
    },
    [ClankElementByGame.coin]: {
        name: 'Монета',
        url: '/assets/images/coins/coins.png',
    },
    [ClankElementByGame.mastery_token]: {
        name: 'Жетон мастерства',
        url: '/assets/images/tokens/bonus/master.png',
    },
    [ClankElementByGame.minor_secret]: {
        name: 'Маленький секрет',
        url: '/assets/images/tokens/secrets/small_back.jpg',
    },
    [ClankElementByGame.major_secret]: {
        name: 'Большой секрет',
        url: '/assets/images/tokens/secrets/big_back.jpg',
    },
    [ClankElementByGame.artefact]: {
        name: 'Артефакт',
        url: '/assets/images/artefact.png',
    },
    // ClankElementByToken
    [ClankElementByToken.monkey_idol]: {
        name: 'Обезьяний идол',
        url: '/assets/images/tokens/map_tokens/idol_5_1.jpg',
    },
    [ClankElementByToken.dragon_egg]: {
        name: 'Драконье яйцо',
        url: '/assets/images/tokens/secrets/small_egg.jpg',
    },
    [ClankElementByToken.cup]: {
        name: 'Кубок',
        url: '/assets/images/tokens/secrets/big_cup.jpg',
    },
    // ClankElementByMarket
    [ClankElementByMarket.backpack]: {
        name: 'Рюкзак',
        url: '/assets/images/tokens/market/backpack_token.jpg',
    },
    [ClankElementByMarket.key]: {
        name: 'Отмычка',
        url: '/assets/images/tokens/market/key_token.jpg',
    },
    [ClankElementByMarket.crown]: {
        name: 'Корона',
        url: '/assets/images/tokens/market/crown_token.jpg',
    },
    // ClankElementByActions
    [ClankElementByActions.dragon_rage]: {
        name: 'Карта',
        url: '/assets/images/cards/dragon.jpg',
    },
    [ClankElementByActions.card]: {
        name: 'Карта',
        url: '/assets/images/cards/cards_back.jpg',
    },
    [ClankElementByActions.trashCard]: {
        name: 'Карта',
        url: '/assets/images/cards/trash_card.jpg',
    },
    [ClankElementByActions.pyramid_dice]: {
        name: 'Кубик пирамиды',
        url: '/assets/images/pyramid_dice.png',
    },
    [ClankElementByActions.clank]: {
        name: 'Шум',
        url: '/assets/images/clank.png',
    },
    // ClankEffect
    [ClankEffect.ignore_crystal_cave]: {
        name: 'Игнорирование кристальных пещер',
        url: '/assets/images/clank.png',
    },
    [ClankEffect.ignore_monster]: {
        name: 'Игнорирование монстров',
        url: '/assets/images/clank.png',
    },
    [ClankEffect.gem_cost_less]: {
        name: 'Самоцветы стоят дешевле',
        url: '/assets/images/clank.png',
    },

};

export interface CheckCostResult {
    success: boolean;
    message: string | null;
}

export const checkCost = (data: {
    cost: Partial<Record<ClankElementType, number>>;
    player: ClankPlayerConfig;
    isMove?: boolean;
}): CheckCostResult => {
    for (const key in data.cost) {
        if (Object.prototype.hasOwnProperty.call(data.cost, key)) {
            const type = key as ClankElementType;
            const costInfo = ClankElementTypeMap[type];
            const costPoints = data.cost[type] ?? 0;
            const userPoints = data.player.benefitInfo[type] ?? 0;
            const healthPoints = data.player.benefitInfo.heal ?? 0;
            const isIgnoreMonster = (data.player.benefitInfo.ignore_monster ?? 0) > 0;
            if (data.isMove && key === ClankElementByTurn.sword && (
                isIgnoreMonster
                || (userPoints + healthPoints) < costPoints
            )) {
                return {
                    success: false,
                    message: `Требуется ${costInfo.name}: ${costPoints} (У вас есть ${costInfo.name}: ${userPoints} | Здоровя: ${healthPoints})`,
                };
            }
            if (userPoints < costPoints) {
                return {
                    success: false,
                    message: `Требуется ${costInfo.name}: ${costPoints} (У вас есть ${costInfo.name}: ${userPoints})`,
                };
            }
        }
    }
    return {
        success: true,
        message: null,
    };
};
