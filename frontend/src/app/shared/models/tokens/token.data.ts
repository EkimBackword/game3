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

export const getSecretTokens = (withCopy: boolean) => {
    const tokens: ClankTokenShortConfig[] = [
        //#region major secret
        {
            count: 2,
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
            count: 3,
            name: 'Кубок',
            url: '/big_cup.jpg',
            points: {
                value: 7,
            },
            secret_type: ClankTokenSecretTypeEnum.major,
            element_type: ClankElementByGame.major_secret,
        },
        {
            count: 2,
            name: 'Внезапное озарение',
            url: '/big_draw_cards.jpg',
            isImmediatelyBenefit: true,
            isUsable: true,
            benefit: {
                card: 3,
            },
            secret_type: ClankTokenSecretTypeEnum.major,
            element_type: ClankElementByGame.major_secret,
        },
        {
            count: 2,
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
            count: 2,
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
            count: 3,
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
            count: 2,
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
            count: 3,
            name: 'Яйцо дракона',
            url: '/small_egg.jpg',
            isImmediatelyBenefit: true,
            cost: {
                dragon_rage: 1,
            },
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
            count: 3,
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
            count: 2,
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
            count: 3,
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
            count: 2,
            name: 'Избавьтесь от карты',
            url: '/small_trash_card.jpg',
            isImmediatelyBenefit: true,
            isUsable: true,
            benefit: {
                trashCard: 1,
            },
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

export const getMarketTokens = (withCopy: boolean) => {
    const tokens: ClankTokenShortConfig[] = [
        {
            count: 2,
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
            count: 2,
            name: ClankElementTypeMap[ClankElementByMarket.key].name,
            url: ClankElementTypeMap[ClankElementByMarket.key].url,
            benefit: {
                [ClankElementByMarket.key]: 1,
            },
            cost: {
                coin: 7,
            },
            points: {
                value: 5,
            },
            element_type: ClankElementByMarket.key,
        },
        {
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
        },
        {
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
        },
        {
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
        },
    ];
    const group: ClankTokenGroup = {
        dlc_name: ClankDlcEnum.clank,
        type: ClankTokenTypeEnum.market,
        tokens,
        url: '',
        isSquare: true,
    };
    return mappingTokens(group, withCopy);
};

