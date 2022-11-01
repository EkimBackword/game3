import { ClankCard } from 'src/app/shared/models/cards/card.class';

import {
    ClankDlcEnum,
    ClankEffect,
    ClankTarget,
} from '../clank.types';
import {
    ClankCardConfig,
    ClankCardName,
    ClankCardType,
} from './cards.types';

export const mappingCards = ({
    cards,
    dlc_name,
    url,
}: {
    cards: ClankCardConfig[];
    dlc_name: ClankDlcEnum;
    url: string;
    player_id?: string;
}) => {
    return cards.flatMap((card, index) => {
        const copyCount = Math.abs(card.count);
        return Array(copyCount).fill(1).map((_, copy_index) => {
            return new ClankCard(
                card,
                index,
                copy_index,
                dlc_name,
                url,
            );
        });
    });
};

export const getClankReserveCards = (userCount: number) => {
    const cards: ClankCardConfig[] = [
        {
            row: 0,
            column: 0,
            name: 'Исследование',
            isReserve: true,
            type: ClankCardType.basiс,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 3,
                        },
                    },
                ],
            },
            benefit: {
                skill: 2,
                boot: 1,
            },
            count: (userCount * 4) - 1,
        },
        {
            row: 0,
            column: 1,
            name: 'Гоблин',
            isReserve: true,
            type: ClankCardType.monster,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            sword: 2,
                        },
                        benefit: {
                            coin: 1,
                        },
                    },
                ],
            },
            count: -1,
        },
        {
            row: 0,
            column: 2,
            name: 'Наёмник',
            isReserve: true,
            type: ClankCardType.basiс,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 2,
                        },
                    },
                ],
            },
            benefit: {
                skill: 1,
                sword: 2,
            },
            count: (userCount * 4) - 1,
        },
        {
            row: 0,
            column: 3,
            name: 'Книга тайн',
            isReserve: true,
            type: ClankCardType.basiс,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 7,
                        },
                    },
                ],
            },
            points: {
                value: 7,
            },
            count: (userCount * 4) - 1,
        },
    ];
    return mappingCards({
        cards,
        dlc_name: ClankDlcEnum.clank,
        url: '/assets/images/cards/clank.jpg',
    });
};

export const getClankStartCards = () => {
    const cards: ClankCardConfig[] = [
        {
            row: 0,
            column: 4,
            name: ClankCardName.Burgle,
            type: ClankCardType.start,
            benefit: {
                skill: 1,
            },
            count: 6,
        },
        {
            row: 0,
            column: 5,
            name: ClankCardName.Scramble,
            type: ClankCardType.start,
            benefit: {
                skill: 1,
                boot: 1,
            },
            count: 1,
        },
        {
            row: 0,
            column: 6,
            name: ClankCardName.Sidestep,
            type: ClankCardType.start,
            benefit: {
                boot: 1,
            },
            count: 1,
        },
        {
            row: 0,
            column: 7,
            name: ClankCardName.Stumble,
            type: ClankCardType.start,
            benefit: {
                clank: 1,
            },
            count: 2,
        },
    ];
    return mappingCards({
        cards,
        dlc_name: ClankDlcEnum.clank,
        url: '/assets/images/cards/clank.jpg',
    });
};

export const getClankDeckCards = () => {
    const cards: ClankCardConfig[] = [
        {
            row: 0,
            column: 8,
            name: 'Амулет силы',
            type: ClankCardType.basiс,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 7,
                        },
                        benefit: {
                            heal: 1,
                        },
                    },
                ],
            },
            benefit: {
                clank: 4,
            },
            points: {
                value: 3,
            },
            count: 1,
        },
        {
            row: 0,
            column: 9,
            name: 'Аптекарь',
            type: ClankCardType.companion,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 3,
                        },
                    },
                ],
            },
            actions: {
                type: 'some',
                count: 1,
                cost: {
                    card: 1,
                },
                list: [
                    {
                        target: ClankTarget.current,
                        benefit: {
                            sword: 3,
                        },
                    },
                    {
                        target: ClankTarget.current,
                        benefit: {
                            coin: 2,
                        },
                    },
                    {
                        target: ClankTarget.current,
                        benefit: {
                            heal: 1,
                        },
                    },
                ],
            },
            points: {
                value: 2,
            },
            count: 1,
        },
        {
            row: 1,
            column: 0,
            name: 'Археолог',
            type: ClankCardType.companion,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 2,
                        },
                    },
                ],
            },
            actions: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        benefit: {
                            card: 1,
                        },
                    },
                    {
                        target: ClankTarget.current,
                        has: {
                            monkey_idol: 1,
                        },
                        benefit: {
                            skill: 2,
                        },
                    },
                ],
            },
            points: {
                value: 1,
            },
            count: 1,
        },
        {
            row: 1,
            column: 1,
            name: 'Ботинки скорости',
            type: ClankCardType.basiс,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 5,
                        },
                        benefit: {
                            boot: 1,
                        },
                    },
                ],
            },
            benefit: {
                boot: 3,
            },
            points: {
                value: 3,
            },
            count: 1,
        },
        {
            row: 1,
            column: 2,
            name: 'Наручи проворности',
            type: ClankCardType.basiс,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 5,
                        },
                    },
                ],
            },
            actions: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        benefit: {
                            card: 2,
                        },
                    },
                ],
            },
            points: {
                value: 2,
            },
            count: 1,
        },
        {
            row: 1,
            column: 3,
            name: 'Гениальность',
            type: ClankCardType.basiс,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 6,
                        },
                    },
                ],
            },
            actions: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        benefit: {
                            card: 3,
                        },
                    },
                ],
            },
            count: 1,
        },
        {
            row: 1,
            column: 4,
            name: 'Жрица Солнца',
            type: ClankCardType.companion,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 3,
                        },
                        benefit: {
                            heal: 1,
                        },
                    },
                ],
            },
            benefit: {
                skill: 2,
                sword: 1,
            },
            points: {
                value: 1,
            },
            count: 1,
        },
        {
            row: 1,
            column: 5,
            name: 'Бежать сломя голову',
            type: ClankCardType.basiс,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 3,
                        },
                    },
                ],
            },
            benefit: {
                boot: 2,
            },
            actions: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            clank: 2,
                        },
                        effect: [
                            ClankEffect.ignore_crystal_cave,
                        ],
                    },
                ],
            },
            count: 1,
        },
        {
            row: 1,
            column: 6,
            name: 'Бриллиант',
            type: ClankCardType.gem,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 8,
                            clank: 2,
                        },
                    },
                ],
            },
            benefit: {
                card: 1,
            },
            arrive: {
                isDragonAttack: true,
            },
            points: {
                value: 8,
            },
            count: 1,
        },
        {
            row: 1,
            column: 7,
            name: 'Драконье око',
            type: ClankCardType.gem,
            onlyDepthsArea: true,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 5,
                            clank: 2,
                        },
                    },
                ],
            },
            benefit: {
                card: 1,
            },
            arrive: {
                isDragonAttack: true,
            },
            points: {
                value: 10,
                has: {
                    cost: {
                        mastery_token: 1,
                    },
                    count: 1,
                },
            },
            count: 1,
        },
        {
            row: 1,
            column: 8,
            name: 'Дварф-лоточник',
            type: ClankCardType.companion,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 4,
                        },
                    },
                ],
            },
            benefit: {
                coin: 2,
            },
            points: {
                value: 4,
                has: {
                    cost: {
                        cup: 1,
                        dragon_egg: 1,
                        monkey_idol: 1,
                    },
                    count: 2,
                },
            },
            count: 1,
        },
        {
            row: 1,
            column: 9,
            name: 'Эльфийские сапоги',
            type: ClankCardType.basiс,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 4,
                        },
                    },
                ],
            },
            benefit: {
                skill: 1,
                boot: 1,
                card: 1,
            },
            points: {
                value: 2,
            },
            count: 1,
        },
        {
            row: 2,
            column: 0,
            name: 'Эльфийский плащ',
            type: ClankCardType.basiс,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 4,
                        },
                    },
                ],
            },
            benefit: {
                skill: 1,
                clank: -2,
                card: 1,
            },
            points: {
                value: 2,
            },
            count: 1,
        },
        {
            row: 2,
            column: 1,
            name: 'Эльфийский кинжал',
            type: ClankCardType.basiс,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 4,
                        },
                    },
                ],
            },
            benefit: {
                skill: 1,
                sword: 1,
                card: 1,
            },
            points: {
                value: 2,
            },
            count: 1,
        },
        {
            row: 2,
            column: 2,
            name: 'Изумруд',
            type: ClankCardType.gem,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 5,
                            clank: 2,
                        },
                    },
                ],
            },
            benefit: {
                card: 1,
            },
            arrive: {
                isDragonAttack: true,
            },
            points: {
                value: 5,
            },
            count: 1,
        },
        {
            row: 2,
            column: 3,
            name: 'Ковёр-самолёт',
            type: ClankCardType.basiс,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 6,
                        },
                    },
                ],
            },
            benefit: {
                boot: 2,
            },
            actions: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        effect: [
                            ClankEffect.ignore_crystal_cave,
                            ClankEffect.ignore_monster,
                        ],
                    },
                ],
            },
            points: {
                value: 2,
            },
            count: 1,
        },
        {
            row: 2,
            column: 4,
            name: 'Сборщик драгоценностей',
            type: ClankCardType.companion,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 4,
                        },
                    },
                ],
            },
            benefit: {
                skill: 2,
                clank: -2,
            },
            actions: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        effect: [
                            ClankEffect.gem_cost_less_2,
                        ],
                    },
                ],
            },
            points: {
                value: 2,
            },
            count: 1,
        },
        {
            row: 2,
            column: 5,
            name: 'Взывающий к Древним',
            type: ClankCardType.companion,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 4,
                        },
                    },
                ],
            },
            benefit: {
                teleport: 1,
                clank: 1,
            },
            points: {
                value: 1,
            },
            count: 1,
        },
        {
            row: 2,
            column: 6,
            name: 'Кобольд-торгаш',
            type: ClankCardType.companion,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 3,
                        },
                    },
                ],
            },
            benefit: {
                coin: 2,
            },
            actions: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        has: {
                            artefact: 1,
                        },
                        benefit: {
                            skill: 2,
                        },
                    },
                ],
            },
            points: {
                value: 1,
            },
            count: 1,
        },
        {
            row: 2,
            column: 7,
            name: 'Счастливая монетка',
            type: ClankCardType.basiс,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 1,
                        },
                    },
                ],
            },
            benefit: {
                skill: 1,
                clank: 1,
                card: 1,
            },
            points: {
                value: 1,
            },
            count: 1,
        },
        {
            row: 2,
            column: 8,
            name: 'Профессиональный ворюга',
            type: ClankCardType.basiс,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 3,
                        },
                    },
                ],
            },
            benefit: {
                skill: 2,
            },
            actions: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        trash: [ClankCardName.Burgle],
                    },
                ],
            },
            points: {
                value: 2,
            },
            count: 1,
        },
        {
            row: 2,
            column: 9,
            name: 'Господин Усач',
            type: ClankCardType.basiс,
            acquire: {
                type: 'every',
                list: [
                    {
                        target: ClankTarget.current,
                        cost: {
                            skill: 1,
                        },
                    },
                ],
            },
            actions: {
                type: 'some',
                list: [
                    {
                        target: ClankTarget.current,
                        benefit: {
                            clank: -2,
                        },
                    },
                    {
                        target: ClankTarget.all,
                        isDragonAttack: true,
                    },
                ],
            },
            arrive: {
                isDragonAttack: true,
            },
            points: {
                value: 2,
            },
            count: 1,
        },
    ];
    return mappingCards({
        cards,
        dlc_name: ClankDlcEnum.clank,
        url: '/assets/images/cards/clank.jpg',
    });
};
