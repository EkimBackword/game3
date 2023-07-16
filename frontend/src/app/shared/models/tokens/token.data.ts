import { ClankCardName } from '@shared/clank/clank-card.types';
import {
    ClankDlcEnum,
    ClankEffect,
    ClankElementByGame,
    ClankElementByMarket,
    ClankElementByToken,
} from '@shared/clank/clank-info.types';
import {
    ClankTokenGroup,
    ClankTokenSecretTypeEnum,
    ClankTokenShortConfig,
    ClankTokenTypeEnum,
} from '@shared/clank/clank-token.types';

import { ClankElementTypeMap } from '../clank-element-types';
import { mappingTokens } from './token.types';

export const getSecretTokens = (playerCount: number, withCopy: boolean) => {
    const additionalCount = playerCount > 4 ? 1 : 0;
    const tokens: ClankTokenShortConfig[] = [
        //#region major secret
        {
            count: Math.ceil(playerCount / 2),
            name: '5 монет',
            description: 'Этот жетон считается за 5 золотых. Можете сохранить его до конца игры или потратить обычным способом',
            url: '/big_coins_5.jpg',
            isImmediatelyBenefit: true,
            isUsable: true,
            benefit: {
                coin: 5,
            },
            secret_type: ClankTokenSecretTypeEnum.major,
            element_type: ClankElementByGame.major_secret,
        },
        {
            count: Math.ceil(playerCount / 2) + 1,
            name: 'Чаша',
            description: 'Сохраните жетон — в конце игры он принесёт 7 очков. Это не артефакт.',
            url: '/big_cup.jpg',
            benefit: {
                cup: 1,
            },
            points: {
                value: 7,
            },
            secret_type: ClankTokenSecretTypeEnum.major,
            element_type: ClankElementByGame.major_secret,
        },
        {
            count: Math.ceil(playerCount / 2),
            name: 'Внезапное озарение',
            description: 'Немедленно возьмите три карты, затем верните жетон в коробку.',
            url: '/big_draw_cards.jpg',
            isImmediatelyBenefit: true,
            drawCards: 3,
            isUsable: true,
            secret_type: ClankTokenSecretTypeEnum.major,
            element_type: ClankElementByGame.major_secret,
        },
        {
            count: Math.ceil(playerCount / 2),
            name: 'Зелье великого исцеления',
            description: 'Восстановите 2 здоровья в свой ход (использовав, верните в коробку).',
            url: '/big_heal.jpg',
            isImmediatelyBenefit: false,
            isUsable: true,
            benefit: {
                heal: 2,
            },
            secret_type: ClankTokenSecretTypeEnum.major,
            element_type: ClankElementByGame.major_secret,
        },
        {
            count: Math.ceil(playerCount / 2),
            name: '5 навыков',
            description: 'Немедленно получите 5 навыков, затем верните жетон в коробку.',
            url: '/big_skill_5.jpg',
            isImmediatelyBenefit: true,
            isUsable: true,
            benefit: {
                skill: 5,
            },
            secret_type: ClankTokenSecretTypeEnum.major,
            element_type: ClankElementByGame.major_secret,
        },
        //#endregion major secret

        //#region minor secret
        {
            count: Math.ceil(playerCount / 2) + 1 + additionalCount,
            name: '2 монеты',
            description: 'Этот жетон считается за 2 золотых. Можете сохранить его до конца игры или потратить обычным способом.',
            url: '/small_coins_2.jpg',
            isImmediatelyBenefit: true,
            isUsable: true,
            benefit: {
                coin: 2,
            },
            secret_type: ClankTokenSecretTypeEnum.minor,
            element_type: ClankElementByGame.minor_secret,
        },
        {
            count: Math.ceil(playerCount / 2) + additionalCount,
            name: 'Зелье силы',
            description: 'Получите 2 меча в свой ход (использовав, верните в коробку).',
            url: '/small_attack.jpg',
            isImmediatelyBenefit: false,
            isUsable: true,
            benefit: {
                sword: 2,
            },
            secret_type: ClankTokenSecretTypeEnum.minor,
            element_type: ClankElementByGame.minor_secret,
        },
        {
            count: Math.ceil(playerCount / 2) + 1 + additionalCount,
            name: 'Драконье яйцо',
            description: 'Сохраните жетон — в конце игры он принесёт 3 очка. Продвиньте фишку дракона на одну клетку по шкале ярости.',
            url: '/small_egg.jpg',
            isImmediatelyBenefit: true,
            needIncreaseDragonRage: true,
            benefit: {
                dragon_egg: 1,
            },
            points: {
                value: 3,
            },
            secret_type: ClankTokenSecretTypeEnum.minor,
            element_type: ClankElementByGame.minor_secret,
        },
        {
            count: Math.ceil(playerCount / 2) + 1 + additionalCount,
            name: 'Зелье исцеления',
            description: 'Восстановите 1 здоровье в свой ход (использовав, верните в коробку).',
            url: '/small_heal.jpg',
            isImmediatelyBenefit: false,
            isUsable: true,
            benefit: {
                heal: 1,
            },
            secret_type: ClankTokenSecretTypeEnum.minor,
            element_type: ClankElementByGame.minor_secret,
        },
        {
            count: Math.ceil(playerCount / 2) + additionalCount,
            name: 'Зелье ускорения',
            description: 'Получите 1 сапог в свой ход (использовав, верните в коробку).',
            url: '/small_move.jpg',
            isImmediatelyBenefit: false,
            isUsable: true,
            benefit: {
                boot: 1,
            },
            secret_type: ClankTokenSecretTypeEnum.minor,
            element_type: ClankElementByGame.minor_secret,
        },
        {
            count: Math.ceil(playerCount / 2) + 1 + additionalCount,
            name: '2 навыка',
            description: 'Немедленно получите 2 навыка, затем верните жетон в коробку.',
            url: '/small_skill_2.jpg',
            isImmediatelyBenefit: true,
            isUsable: true,
            benefit: {
                skill: 2,
            },
            secret_type: ClankTokenSecretTypeEnum.minor,
            element_type: ClankElementByGame.minor_secret,
        },
        {
            count: Math.ceil(playerCount / 2) + additionalCount,
            name: 'Избавьтесь от карты',
            description: 'В конце этого хода избавьтесь от карты из своей стопки сброса или игровой зоны. Верните карту и этот жетон в коробку.',
            url: '/small_trash_card.jpg',
            isImmediatelyBenefit: true,
            isUsable: true,
            needTrashCards: [ClankCardName.All],
            secret_type: ClankTokenSecretTypeEnum.minor,
            element_type: ClankElementByGame.minor_secret,
        },
        //#endregion minor secret
    ];
    const group: ClankTokenGroup = {
        dlc_name: ClankDlcEnum.clank,
        type: ClankTokenTypeEnum.secret,
        tokens,
        url: '/assets/images/tokens/secrets',
    };
    return mappingTokens(group, withCopy);
};

export const getMapTokens = (withCopy: boolean) => {
    const tokens: ClankTokenShortConfig[] = [
        {
            count: 1,
            name: 'Идол, который не говорит',
            description: 'Сохраните жетон — в конце игры он принесёт 5 очка.',
            url: '/idol_5_1.jpg',
            isImmediatelyBenefit: false,
            isUsable: false,
            benefit: {
                monkey_idol: 1,
            },
            points: {
                value: 5,
            },
            element_type: ClankElementByToken.monkey_idol,
        },
        {
            count: 1,
            name: 'Идол, который не видит',
            description: 'Сохраните жетон — в конце игры он принесёт 5 очка.',
            url: '/idol_5_2.jpg',
            isImmediatelyBenefit: false,
            isUsable: false,
            benefit: {
                monkey_idol: 1,
            },
            points: {
                value: 5,
            },
            element_type: ClankElementByToken.monkey_idol,
        },
        {
            count: 1,
            name: 'Идол, который не слышит',
            description: 'Сохраните жетон — в конце игры он принесёт 5 очка.',
            url: '/idol_5_3.jpg',
            isImmediatelyBenefit: false,
            isUsable: false,
            benefit: {
                monkey_idol: 1,
            },
            points: {
                value: 5,
            },
            element_type: ClankElementByToken.monkey_idol,
        },
        {
            count: 1,
            name: 'Большой идол',
            description: 'Сохраните жетон — в конце игры он принесёт 10 очка.',
            url: '/clank_proklyatie_mumii/idol_10_1.jpg',
            isImmediatelyBenefit: false,
            isUsable: false,
            benefit: {
                monkey_idol: 1,
            },
            points: {
                value: 10,
            },
            element_type: ClankElementByToken.monkey_idol,
        },
    ];

    const group: ClankTokenGroup = {
        dlc_name: ClankDlcEnum.clank,
        type: ClankTokenTypeEnum.map,
        tokens,
        url: '/assets/images/tokens/map_tokens',
    };
    return mappingTokens(group, withCopy);
};

export const getMarketTokens = (playerCount: number, withCopy: boolean) => {
    const tokens: ClankTokenShortConfig[] = [
        {
            count: Math.ceil(playerCount / 2),
            name: ClankElementTypeMap[ClankElementByMarket.backpack].name,
            description: 'Позволяет переносить дополнительный артефакт (также приносит 5 очков в конце игры).',
            url: ClankElementTypeMap[ClankElementByMarket.backpack].url,
            benefit: {
                [ClankElementByMarket.backpack]: 1,
            },
            cost: {
                coin: 7,
            },
            points: {
                value: 5,
            },
            element_type: ClankElementByMarket.backpack,
        },
        {
            count: Math.ceil(playerCount / 2),
            name: ClankElementTypeMap[ClankElementByMarket.key_token].name,
            description: 'Позволяет использовать туннели со значком замка (также приносит 5 очков в конце игры).',
            url: ClankElementTypeMap[ClankElementByMarket.key_token].url,
            benefit: {
                [ClankElementByMarket.key_token]: 1,
            },
            cost: {
                coin: 7,
            },
            points: {
                value: 5,
            },
            element_type: ClankElementByMarket.key_token,
        },
        {
            count: Math.ceil(playerCount / 2),
            name: 'Плащ-невидимка',
            description: 'Плащ позволяет вам перемещаться по туннелям, игнорируя чудовищ, а в конце игры он принесёт 5 очков.',
            url: '/assets/images/tokens/market/clank_adventuring_party/token_1.png',
            benefit: {
                [ClankEffect.ignore_monster]: 1,
            },
            cost: {
                coin: 7,
            },
            points: {
                value: 5,
            },
            element_type: ClankEffect.ignore_monster,
        },
        {
            count: Math.ceil(playerCount / 2),
            name: 'Анх',
            description: 'Приобретая его, восстановите 1 здоровье. В конце игры он приносит 7 очков',
            url: '/assets/images/tokens/market/clank_proklyatie_mumii/token_1.png',
            benefit: {
                heal: 1,
            },
            cost: {
                coin: 7,
            },
            points: {
                value: 7,
            },
            element_type: ClankElementByMarket.ankh,
        },
    ];
    const crownDescription = 'Приносит указанное количество очков (покупая корону, игрок берёт самую ценную из доступных).';
    if (playerCount > 3) {
        tokens.push({
            count: 1,
            name: ClankElementTypeMap[ClankElementByMarket.crown].name,
            description: crownDescription,
            url: '/assets/images/tokens/market/crown_token_8.jpg',
            benefit: {
                [ClankElementByMarket.crown]: 1,
            },
            cost: {
                coin: 7,
            },
            points: {
                value: 8,
            },
            element_type: ClankElementByMarket.crown,
        });
    }
    if (playerCount > 2) {
        tokens.push({
            count: 1,
            name: ClankElementTypeMap[ClankElementByMarket.crown].name,
            description: crownDescription,
            url: '/assets/images/tokens/market/crown_token_9.jpg',
            benefit: {
                [ClankElementByMarket.crown]: 1,
            },
            cost: {
                coin: 7,
            },
            points: {
                value: 9,
            },
            element_type: ClankElementByMarket.crown,
        });
    }
    tokens.push({
        count: 1,
        name: ClankElementTypeMap[ClankElementByMarket.crown].name,
        description: crownDescription,
        url: '/assets/images/tokens/market/crown_token_10.jpg',
        benefit: {
            [ClankElementByMarket.crown]: 1,
        },
        cost: {
            coin: 7,
        },
        points: {
            value: 10,
        },
        element_type: ClankElementByMarket.crown,
    });
    const group: ClankTokenGroup = {
        dlc_name: ClankDlcEnum.clank,
        type: ClankTokenTypeEnum.market,
        tokens,
        url: '',
        isSquare: true,
    };
    return mappingTokens(group, withCopy);
};

