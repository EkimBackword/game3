import { ClankCardName } from '@shared/clank/clank-card.types';
import {
    ClankDlcEnum,
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
            name: 'Кубок',
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
            name: 'Яйцо дракона',
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
    ];
    if (playerCount > 3) {
        tokens.push({
            count: 1,
            name: ClankElementTypeMap[ClankElementByMarket.crown].name,
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

