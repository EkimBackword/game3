import { Injectable } from '@angular/core';

import {
    ClankCardBaseConfig,
    ClankCardConfig,
    ClankCardName,
    ClankCardPositionEnum,
    ClankDeckConfig,
    ClankDeckSpriteInfo,
    ClankSelectDeckValue,
} from '@shared/clank/clank-card.types';
import {
    ClankCardType,
    ClankDlcEnum,
    ClankDlcList,
    ClankTarget,
} from '@shared/clank/clank-info.types';

@Injectable({
    providedIn: 'root',
})
export class CardsService {

    private lastIndex = 0;

    private spriteInfo: Record<ClankDlcEnum, ClankDeckSpriteInfo> = {
        [ClankDlcEnum.clank]: {
            dlc_name: ClankDlcEnum.clank,
            url: '/assets/images/cards/clank.jpg',
            backgroundSize: '1000% 700%',
        },
        [ClankDlcEnum.clank_sunken_treasures]: {
            dlc_name: ClankDlcEnum.clank,
            url: '/assets/images/cards/clank_sunken_treasures.jpg',
            backgroundSize: '1000% 700%',
        },
        [ClankDlcEnum.clank_proklyatie_mumii]: {
            dlc_name: ClankDlcEnum.clank,
            url: '/assets/images/cards/clank_the_mummys_curse.jpg',
            backgroundSize: '1000% 700%',
        },
        [ClankDlcEnum.clank_expeditions_goldand_silk]: {
            dlc_name: ClankDlcEnum.clank,
            url: '/assets/images/cards/clank.jpg',
            backgroundSize: '1000% 700%',
        },
        [ClankDlcEnum.clank_temple_of_the_ape_lords]: {
            dlc_name: ClankDlcEnum.clank,
            url: '/assets/images/cards/clank.jpg',
            backgroundSize: '1000% 700%',
        },
        [ClankDlcEnum.clank_adventuring_party]: {
            dlc_name: ClankDlcEnum.clank,
            url: '/assets/images/cards/clank.jpg',
            backgroundSize: '1000% 700%',
        },
    };

    private reserveDecks: Partial<Record<ClankDlcEnum, {
        store: ClankCardConfig[];
        getCards: (userCount: number) => ClankCardConfig[];
    }>> = {
        [ClankDlcEnum.clank]: {
            store: this.initClankReserveCards(1, false),
            getCards: (userCount) => this.initClankReserveCards(userCount, true),
        },
    };

    private startDecks: Partial<Record<ClankDlcEnum, {
        store: ClankCardConfig[];
        getCards: (playerId: string) => ClankCardConfig[]
    }>> = {
        [ClankDlcEnum.clank]: {
            store: this.initClankStartCards('', false),
            getCards: (playerId) => this.initClankStartCards(playerId, true),
        },
    };

    private shareDecks: Partial<Record<ClankDlcEnum, {
        store: ClankCardConfig[];
        getCards: () => ClankCardConfig[]
    }>> = {
        [ClankDlcEnum.clank]: {
            store: this.initClankDeckCards(false),
            getCards: () => this.initClankDeckCards(true),
        },
    };

    constructor() { }

    getReserveDecksCards(mapDlcId: ClankDlcEnum, userCount: number) {
        const ids: ClankDlcEnum[] = mapDlcId === ClankDlcEnum.clank
            ? [ClankDlcEnum.clank]
            : [ClankDlcEnum.clank, mapDlcId];
        return ids.flatMap((id) => this.reserveDecks[id]?.getCards(userCount) ?? []);
    }

    getSelectStartDecks(): ClankSelectDeckValue[] {
        return ClankDlcList.map(dlc => ({
            ...dlc,
            value: dlc.id === ClankDlcEnum.clank,
            disabled: dlc.id === ClankDlcEnum.clank || this.startDecks[dlc.id] == null,
        }));
    }

    getStartDeckCards(id: ClankDlcEnum, playerId: string) {
        return this.startDecks[id]?.getCards(playerId) ?? [];
    }

    getSelectShareDecks(): ClankSelectDeckValue[] {
        return ClankDlcList.map(dlc => ({
            ...dlc,
            value: dlc.id === ClankDlcEnum.clank,
            disabled: dlc.id === ClankDlcEnum.clank || this.startDecks[dlc.id] == null,
        }));
    }

    getShareDecksCards(ids: ClankDlcEnum[]) {
        return ids.flatMap((id) => this.shareDecks[id]?.getCards() ?? []);
    }

    private initClankReserveCards(userCount: number, withCopy: boolean) {
        const cards: ClankCardBaseConfig[] = [
            {
                row: 0,
                column: 0,
                name: 'Исследование',
                description: 'Исследование',
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
                column: 2,
                name: 'Наёмник',
                description: 'Наёмник',
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
                description: 'Книга тайн',
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
            {
                row: 0,
                column: 1,
                name: 'Гоблин',
                description: 'Гоблин',
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
        ];
        const shareReserveConfig: ClankDeckConfig = {
            ...this.spriteInfo.clank,
            cards,
            position: ClankCardPositionEnum.reserveRow,
        };
        return this.mappingDeckCards(shareReserveConfig, withCopy);
    }

    private initClankStartCards(playerId: string, withCopy: boolean) {
        const cards: ClankCardBaseConfig[] = [
            {
                row: 0,
                column: 4,
                name: ClankCardName.Burgle,
                description: ClankCardName.Burgle,
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
                description: ClankCardName.Scramble,
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
                description: ClankCardName.Sidestep,
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
                description: ClankCardName.Stumble,
                type: ClankCardType.start,
                benefit: {
                    clank: 1,
                },
                count: 2,
            },
        ];
        const playerDeckConfig: ClankDeckConfig = {
            ...this.spriteInfo.clank,
            cards,
            position: ClankCardPositionEnum.playerDeck,
            player_id: playerId,
        };
        return this.mappingDeckCards(playerDeckConfig, withCopy);
    }

    private initClankDeckCards(withCopy: boolean) {
        const cards: ClankCardBaseConfig[] = [
            {
                row: 0,
                column: 8,
                name: 'Амулет силы',
                description: 'Амулет силы',
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
                    skill: 4,
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
                description: 'Аптекарь',
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
                        discardCard: 1,
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
                description: 'Археолог',
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
                                count: 1,
                                cost: {
                                    monkey_idol: 1,
                                },
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
                description: 'Ботинки скорости',
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
                description: 'Наручи проворности',
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
                benefit: {
                    card: 2,
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
                description: 'Гениальность',
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
                    card: 3,
                },
                count: 1,
            },
            {
                row: 1,
                column: 4,
                name: 'Жрица Солнца',
                description: 'Жрица Солнца',
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
                description: 'Бежать сломя голову',
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
                            benefit: {
                                clank: 2,
                                ignore_crystal_cave: 1,
                            },
                        },
                    ],
                },
                count: 1,
            },
            {
                row: 1,
                column: 6,
                name: 'Бриллиант',
                description: 'Бриллиант',
                type: ClankCardType.gem,
                acquire: {
                    type: 'every',
                    list: [
                        {
                            target: ClankTarget.current,
                            cost: {
                                skill: 8,
                            },
                            benefit: {
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
                description: 'Драконье око',
                type: ClankCardType.gem,
                onlyDepthsArea: true,
                acquire: {
                    type: 'every',
                    list: [
                        {
                            target: ClankTarget.current,
                            cost: {
                                skill: 5,
                            },
                            benefit: {
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
                description: 'Дварф-лоточник',
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
                    boot: 1,
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
                description: 'Эльфийские сапоги',
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
                description: 'Эльфийский плащ',
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
                description: 'Эльфийский кинжал',
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
                description: 'Изумруд',
                type: ClankCardType.gem,
                acquire: {
                    type: 'every',
                    list: [
                        {
                            target: ClankTarget.current,
                            cost: {
                                skill: 5,
                            },
                            benefit: {
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
                description: 'Ковёр-самолёт',
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
                            benefit: {
                                ignore_crystal_cave: 1,
                                ignore_monster: 1,
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
                row: 2,
                column: 4,
                name: 'Сборщик драгоценностей',
                description: 'Сборщик драгоценностей',
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
                            benefit: {
                                gem_cost_less: 2,
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
                row: 2,
                column: 5,
                name: 'Взывающий к Древним',
                description: 'Взывающий к Древним',
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
                description: 'Кобольд-торгаш',
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
                                count: 1,
                                cost: {
                                    artefact: 1,
                                },
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
                description: 'Счастливая монетка',
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
                description: 'Профессиональный ворюга',
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
                needTrashCards: [ClankCardName.Burgle],
                points: {
                    value: 2,
                },
                count: 1,
            },
            {
                row: 2,
                column: 9,
                name: 'Господин Усач',
                description: 'Господин Усач',
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
                    count: 1,
                    list: [
                        {
                            target: ClankTarget.current,
                            benefit: {
                                clank: -2,
                            },
                        },
                        {
                            target: ClankTarget.all,
                            benefitDescription: 'Дракон атакует',
                            benefit: {
                                dragon_attack: 1,
                            },
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
            /** test */
            {
                row: 5,
                column: 9,
                name: 'Святилище',
                description: 'Получите одну манетку или восстановите 1 очко здоровья',
                type: ClankCardType.device,
                count: 2,
            },
        ];
        const shareDeckConfig: ClankDeckConfig = {
            ...this.spriteInfo.clank,
            cards,
            position: ClankCardPositionEnum.dungeonDeck,
        };
        return this.mappingDeckCards(shareDeckConfig, withCopy);
    }

    private mappingDeckCards(data: ClankDeckConfig, withCopy: boolean) {
        const {cards, ...config} = data;
        return cards.flatMap((card, index) => {
            const copyCount = withCopy ? Math.abs(card.count) : 1;
            return Array(copyCount).fill(1).map((_, copy_index) => {
                this.lastIndex++;
                if (this.lastIndex > 1000000) {
                    this.lastIndex = 0;
                }
                const find_string = `${config.dlc_name}_${index}_${config.position}`;
                const cardConfig: ClankCardConfig = {
                    ...card,
                    ...config,
                    id: `${find_string}__${copy_index}_${config.player_id}`,
                    find_string,
                    index,
                    copy_index,
                    initIndex: this.lastIndex,
                };
                return cardConfig;
            });
        });
    };

}
