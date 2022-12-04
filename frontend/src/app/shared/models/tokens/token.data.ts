import {
    ClankDlcEnum,
    ClankElementByGame,
    ClankElementByMarket,
} from '@shared/clank/clank-info.types';
import {
    ClankTokenGroup,
    ClankTokenSecretTypeEnum,
    ClankTokenShortConfig,
    ClankTokenTypeEnum,
} from '@shared/clank/clank-token.types';

import { mappingTokens } from './token.types';

export const getSecretTokens = (withCopy: boolean) => {
    const tokens: ClankTokenShortConfig[] = [
        //#region major secret
        {
            index: 1,
            count: 2,
            name: '5 монет',
            url: '/big_coins_5.jpg',
            isImmediatelyBenefit: true,
            benefit: {
                coin: 5,
            },
            secret_type: ClankTokenSecretTypeEnum.major,
            element_type: ClankElementByGame.major_secret,
        },
        {
            index: 2,
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
            index: 3,
            count: 2,
            name: 'Внезапное озарение',
            url: '/big_draw_cards.jpg',
            isImmediatelyBenefit: true,
            benefit: {
                card: 3,
            },
            secret_type: ClankTokenSecretTypeEnum.major,
            element_type: ClankElementByGame.major_secret,
        },
        {
            index: 4,
            count: 2,
            name: 'Зелье великого исцеления',
            url: '/big_heal.jpg',
            isImmediatelyBenefit: false,
            benefit: {
                heal: 2,
            },
            secret_type: ClankTokenSecretTypeEnum.major,
            element_type: ClankElementByGame.major_secret,
        },
        {
            index: 5,
            count: 2,
            name: '5 навыков',
            url: '/big_skill_5.jpg',
            isImmediatelyBenefit: true,
            benefit: {
                skill: 5,
            },
            secret_type: ClankTokenSecretTypeEnum.major,
            element_type: ClankElementByGame.major_secret,
        },
        //#endregion major secret

        //#region minor secret
        {
            index: 6,
            count: 3,
            name: '2 монеты',
            url: '/small_coins_2.jpg',
            isImmediatelyBenefit: true,
            benefit: {
                coin: 2,
            },
            secret_type: ClankTokenSecretTypeEnum.minor,
            element_type: ClankElementByGame.minor_secret,
        },
        {
            index: 7,
            count: 2,
            name: 'Зелье силы',
            url: '/small_attack.jpg',
            isImmediatelyBenefit: false,
            benefit: {
                sword: 2,
            },
            secret_type: ClankTokenSecretTypeEnum.minor,
            element_type: ClankElementByGame.minor_secret,
        },
        {
            index: 8,
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
            index: 9,
            count: 3,
            name: 'Зелье исцеления',
            url: '/small_heal.jpg',
            isImmediatelyBenefit: false,
            benefit: {
                heal: 1,
            },
            secret_type: ClankTokenSecretTypeEnum.minor,
            element_type: ClankElementByGame.minor_secret,
        },
        {
            index: 10,
            count: 2,
            name: 'Зелье ускорения',
            url: '/small_move.jpg',
            isImmediatelyBenefit: false,
            benefit: {
                boot: 1,
            },
            secret_type: ClankTokenSecretTypeEnum.minor,
            element_type: ClankElementByGame.minor_secret,
        },
        {
            index: 11,
            count: 3,
            name: '2 навыка',
            url: '/small_skill_2.jpg',
            isImmediatelyBenefit: true,
            benefit: {
                skill: 2,
            },
            secret_type: ClankTokenSecretTypeEnum.minor,
            element_type: ClankElementByGame.minor_secret,
        },
        {
            index: 12,
            count: 2,
            name: 'Избавьтесь от карты',
            url: '/small_trash_card.jpg',
            isImmediatelyBenefit: true,
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

export const getMarketTokens = (withCopy: boolean) => {
    const tokens: ClankTokenShortConfig[] = [
        {
            index: 1,
            count: 2,
            name: 'Рюкзак',
            url: '/backpack_token.jpg',
            points: {
                value: 5,
            },
            element_type: ClankElementByMarket.backpack,
        },
    ];
    const group: ClankTokenGroup = {
        dlc_name: ClankDlcEnum.clank,
        type: ClankTokenTypeEnum.market,
        tokens,
        url: '/assets/images/tokens/market',
    };
    return mappingTokens(group, withCopy);
};

