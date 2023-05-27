import {
    ClankCardType,
    ClankCardTypeList,
    ClankEffect,
    ClankEffectList,
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
    swordOrHealth = 'swordOrHealth',
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
    swordOrHealth: [
        [
            ClankElementTypeEnum.heal,
        ],
        [
            ClankElementTypeEnum.sword,
        ],
    ],
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
        url: '/assets/images/teleport.png',
    },
    [ClankElementByTurn.clank]: {
        name: 'Бдзынь',
        url: '/assets/images/clank.png',
    },
    // ClankElementByGame
    [ClankElementByGame.heal]: {
        name: 'Здоровье',
        url: '/assets/images/heal.png',
    },
    [ClankElementByGame.curse]: {
        name: 'Проклятие',
        url: '/assets/images/tokens/map_tokens/clank_proklyatie_mumii/curse.jpg',
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
    [ClankElementByMarket.key_token]: {
        name: 'Отмычка',
        url: '/assets/images/tokens/market/key_token.jpg',
    },
    [ClankElementByMarket.crown]: {
        name: 'Корона',
        url: '/assets/images/tokens/market/crown_token.jpg',
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
