import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { cloneDeep } from 'lodash';
import { ClankHelpService } from 'src/app/game/clank/services/clank-help.service';

import {
    ClankCardBaseConfig,
    ClankCardBaseConfigEventInfoByType,
    ClankCardBaseConfigEvents,
    ClankCardConfig,
    ClankCardName,
    ClankCardPositionEnum,
    ClankDeckConfig,
    ClankDeckSpriteInfo,
} from '@shared/clank/clank-card.types';
import { GameInfoState } from '@shared/clank/clank-game.types';
import {
    ClankCardType,
    ClankDlcEnum,
    ClankElementByToken,
    ClankTarget,
} from '@shared/clank/clank-info.types';
import {
    ClankPlayerConfig,
    GamePlayerColorIdEnum,
} from '@shared/clank/clank-player.types';

import {
    ChooseCardEventComponent,
    ChooseCardEventComponentData,
    ChooseCardEventComponentItem,
} from '../modals/choose-card-event/choose-card-event.component';
import { ToastService } from './toast.service';

@Injectable()
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

    private store = [
        ...this.initClankReserveCards(1, false),
        ...this.initClankStartCards('', false),
        ...this.initClankDeckCards(false),
    ];

    private reserveDecks: Partial<Record<ClankDlcEnum, {
        getCards: (userCount: number) => ClankCardConfig[];
    }>> = {
        [ClankDlcEnum.clank]: {
            getCards: (userCount) => this.initClankReserveCards(userCount, true),
        },
    };

    private startDecks: Partial<Record<ClankDlcEnum, {
        getCards: (playerId: string) => ClankCardConfig[];
    }>> = {
        [ClankDlcEnum.clank]: {
            getCards: (playerId) => this.initClankStartCards(playerId, true),
        },
    };

    private shareDecks: Partial<Record<ClankDlcEnum, {
        getCards: () => ClankCardConfig[];
    }>> = {
        [ClankDlcEnum.clank]: {
            getCards: () => this.initClankDeckCards(true),
        },
    };

    constructor(
        private clankHelpService: ClankHelpService,
        private toastService: ToastService,
        private matDialog: MatDialog,
    ) { }

    getReserveDecksCards(mapDlcId: ClankDlcEnum, userCount: number) {
        const ids: ClankDlcEnum[] = mapDlcId === ClankDlcEnum.clank
            ? [ClankDlcEnum.clank]
            : [ClankDlcEnum.clank, mapDlcId];
        return ids.flatMap((id) => this.reserveDecks[id]?.getCards(userCount) ?? []);
    }

    getStartDeckCards(id: ClankDlcEnum, playerId: string) {
        return this.startDecks[id]?.getCards(playerId) ?? [];
    }

    getShareDecksCards(ids: ClankDlcEnum[]) {
        return ids.flatMap((id) => this.shareDecks[id]?.getCards() ?? []);
    }

    async onEvent(data: {
        state: GameInfoState,
        card: ClankCardConfig,
        eventName: keyof ClankCardBaseConfigEvents,
    }) {
        const cardInfo = this.getCardInfo(data.card);
        const eventInfo = cardInfo?.events?.[data.eventName];
        const state = cloneDeep(data.state);
        if (eventInfo != null) {
            const target = eventInfo.target ?? ClankTarget.current;
            for (const player of state.players) {
                const isCurrent = player.id === state.activePlayerId;
                const isCurrentUpdate = isCurrent && target !== ClankTarget.other;
                const isOtherUpdate = !isCurrent && target !== ClankTarget.current;
                if (!isCurrentUpdate && !isOtherUpdate) {
                    continue;
                }
                const isPlayerUpdate = this.clankHelpService.updateBenefitInfo({
                    player,
                    cost: eventInfo.cost,
                    benefit: eventInfo.benefit,
                });
                if (!isPlayerUpdate) {
                    return null;
                }
                const result = await eventInfo?.callback?.(state, player) ?? true;
                if (!result) {
                    return null;
                }
            }
        }
        const currentPlayer = state.players[state.activePlayerIndex];
        this.clankHelpService.addActionLogs(state, {
            text: data.eventName !== 'onArrive'
                ? `${currentPlayer.name} ${ClankCardBaseConfigEventInfoByType[data.eventName].text} ${data.card.name}`
                : `${ClankCardBaseConfigEventInfoByType[data.eventName].text} ${data.card.name}`,
            colorId: data.eventName !== 'onArrive'
                ? currentPlayer.colorId
                : GamePlayerColorIdEnum.Black,
            hideToast: true,
        });
        switch (data.eventName) {
            case 'onArrive': {
                state.dungeonRow.push(data.card);
                break;
            }
            case 'onAcquire': {
                if (data.card.count > 0) {
                    state.dungeonRow = state.dungeonRow.filter(p => p.id !== data.card.id);
                    state.reserveRow = state.reserveRow.filter(p => p.id !== data.card.id);
                    if (![
                        ClankCardType.device,
                        ClankCardType.monster,
                    ].includes(data.card.type)) {
                        currentPlayer.discard.push(data.card);
                    }
                }
                break;
            }
            case 'onUse': {
                currentPlayer.hand = currentPlayer.hand.filter(p => p.id !== data.card.id),
                currentPlayer.board.push(data.card);
                currentPlayer.benefitInfo[data.card.type] = (currentPlayer.benefitInfo[data.card.type] ?? 0) + 1;
                break;
            }
            case 'onDiscard': {
                currentPlayer.hand = currentPlayer.hand.filter(p => p.id !== data.card.id),
                currentPlayer.discard.push(data.card);
                break;
            }
        }
        return state;
    }

    getPoints(data: {
        state: GameInfoState;
        player: ClankPlayerConfig;
        card: ClankCardConfig;
    }) {
        const state = cloneDeep(data.state);
        const cardInfo = this.getCardInfo(data.card);
        return cardInfo?.events?.getPoints?.(state, data.player) ?? 0;
    }

    private getCardInfo(card: ClankCardConfig) {
        const [find_string] = card.id.split('__');
        return this.store.find(p => p.find_string === find_string);
    }

    private initClankReserveCards(userCount: number, withCopy: boolean) {
        const self = this;
        const cards: ClankCardBaseConfig[] = [
            {
                row: 0,
                column: 0,
                name: 'Исследование',
                description: 'Исследование',
                isReserve: true,
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 3,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 2,
                            boot: 1,
                        },
                    },
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
                events: {
                    onAcquire: {
                        cost: {
                            skill: 2,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 1,
                            sword: 2,
                        },
                    },
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
                events: {
                    onAcquire: {
                        cost: {
                            skill: 7,
                        },
                    },
                    getPoints(state) {
                        return 7;
                    },
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
                events: {
                    onAcquire: {
                        cost: {
                            sword: 2,
                        },
                        benefit: {
                            coin: 1,
                        },
                    },
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
        const self = this;
        const cards: ClankCardBaseConfig[] = [
            {
                row: 0,
                column: 4,
                name: ClankCardName.Burgle,
                description: ClankCardName.Burgle,
                type: ClankCardType.start,
                events: {
                    onUse: {
                        benefit: {
                            skill: 1,
                        },
                    },
                },
                count: 6,
            },
            {
                row: 0,
                column: 5,
                name: ClankCardName.Scramble,
                description: ClankCardName.Scramble,
                type: ClankCardType.start,
                events: {
                    onUse: {
                        benefit: {
                            skill: 1,
                            boot: 1,
                        },
                    },
                },
                count: 1,
            },
            {
                row: 0,
                column: 6,
                name: ClankCardName.Sidestep,
                description: ClankCardName.Sidestep,
                type: ClankCardType.start,
                events: {
                    onUse: {
                        benefit: {
                            boot: 1,
                        },
                    },
                },
                count: 1,
            },
            {
                row: 0,
                column: 7,
                name: ClankCardName.Stumble,
                description: ClankCardName.Stumble,
                type: ClankCardType.start,
                events: {
                    onUse: {
                        async callback(state, player) {
                            self.clankHelpService.addClank({
                                state,
                                player,
                                count: 1,
                            });
                            return true;
                        },
                    },
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
        const self = this;
        const cards: ClankCardBaseConfig[] = [
            {
                row: 0,
                column: 8,
                name: 'Амулет силы',
                description: 'Амулет силы',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 7,
                        },
                        benefit: {
                            heal: 1,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 4,
                        },
                    },
                    getPoints(state) {
                        return 3;
                    },
                },
                count: 1,
            },
            {
                row: 0,
                column: 9,
                name: 'Аптекарь',
                description: 'Аптекарь',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 3,
                        },
                    },
                    onUse: {
                        cost: {
                            discardCard: 1,
                        },
                        async callback(state, player) {
                            return await self.openDialogChooseCardEvent({
                                count: 1,
                                list: [
                                    {
                                        description: 'Получить одну монетку',
                                        event: () => {
                                            return self.clankHelpService.updateBenefitInfo({
                                                player,
                                                benefit: {
                                                    coin: 1,
                                                },
                                            });
                                        },
                                    },
                                    {
                                        description: 'Восстановить одно очко здоровья',
                                        event: () => {
                                            return self.clankHelpService.updateBenefitInfo({
                                                player,
                                                benefit: {
                                                    heal: 1,
                                                },
                                            });
                                        },
                                    },
                                ],
                            });
                        },
                    },
                    getPoints(state) {
                        return 2;
                    },
                },
                count: 1,
            },
            {
                row: 1,
                column: 0,
                name: 'Археолог',
                description: 'Археолог',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 2,
                        },
                    },
                    onUse: {
                        async callback(state, player) {
                            self.clankHelpService.drawCards({
                                state,
                                player,
                                count: 1,
                            });
                            if (!player.benefitInfo.monkey_idol) {
                                return true;
                            }
                            return self.clankHelpService.updateBenefitInfo({
                                player,
                                benefit: {
                                    skill: 2,
                                },
                            });
                        },
                    },
                    getPoints(state) {
                        return 1;
                    },
                },
                count: 1,
            },
            {
                row: 1,
                column: 1,
                name: 'Ботинки скорости',
                description: 'Ботинки скорости',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 5,
                        },
                        benefit: {
                            boot: 1,
                        },
                    },
                    onUse: {
                        benefit: {
                            boot: 3,
                        },
                    },
                    getPoints(state) {
                        return 3;
                    },
                },
                count: 1,
            },
            {
                row: 1,
                column: 2,
                name: 'Наручи проворности',
                description: 'Наручи проворности',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 5,
                        },
                    },
                    onUse: {
                        async callback(state, player) {
                            self.clankHelpService.drawCards({
                                state,
                                player,
                                count: 2,
                            });
                            return true;
                        },
                    },
                    getPoints(state) {
                        return 2;
                    },
                },
                count: 1,
            },
            {
                row: 1,
                column: 3,
                name: 'Гениальность',
                description: 'Гениальность',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 6,
                        },
                    },
                    onUse: {
                        async callback(state, player) {
                            self.clankHelpService.drawCards({
                                state,
                                player,
                                count: 3,
                            });
                            return true;
                        },
                    },
                },
                count: 1,
            },
            {
                row: 1,
                column: 4,
                name: 'Жрица Солнца',
                description: 'Жрица Солнца',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 3,
                        },
                        benefit: {
                            heal: 1,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 2,
                            sword: 1,
                        },
                    },
                    getPoints(state) {
                        return 1;
                    },
                },
                count: 1,
            },
            {
                row: 1,
                column: 5,
                name: 'Бежать сломя голову',
                description: 'Бежать сломя голову',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 3,
                        },
                    },
                    onUse: {
                        benefit: {
                            boot: 2,
                            ignore_crystal_cave: 1,
                        },
                        async callback(state, player) {
                            self.clankHelpService.addClank({
                                state,
                                player,
                                count: 2,
                            });
                            return true;
                        },
                    },
                },
                count: 1,
            },
            {
                row: 1,
                column: 6,
                name: 'Бриллиант',
                description: 'Бриллиант',
                type: ClankCardType.gem,
                events: {
                    onArrive: {
                        isDragonAttack: true,
                    },
                    onAcquire: {
                        cost: {
                            skill: 8,
                        },
                        async callback(state, player) {
                            self.clankHelpService.addClank({
                                state,
                                player,
                                count: 2,
                            });
                            return true;
                        },
                    },
                    onUse: {
                        async callback(state, player) {
                            self.clankHelpService.drawCards({
                                state,
                                player,
                                count: 1,
                            });
                            return true;
                        },
                    },
                    getPoints(state) {
                        return 8;
                    },
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
                events: {
                    onArrive: {
                        isDragonAttack: true,
                    },
                    onAcquire: {
                        cost: {
                            skill: 5,
                        },
                        async callback(state, player) {
                            self.clankHelpService.addClank({
                                state,
                                player,
                                count: 2,
                            });
                            return true;
                        },
                    },
                    onUse: {
                        async callback(state, player) {
                            self.clankHelpService.drawCards({
                                state,
                                player,
                                count: 1,
                            });
                            return true;
                        },
                    },
                    getPoints(state, player) {
                        return !player.benefitInfo.mastery_token
                            ? 0
                            : 10;
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
                events: {
                    onAcquire: {
                        cost: {
                            skill: 4,
                        },
                    },
                    onUse: {
                        benefit: {
                            coin: 2,
                            boot: 1,
                        },
                    },
                    getPoints(state, player) {
                        const list = [
                            ClankElementByToken.cup,
                            ClankElementByToken.dragon_egg,
                            ClankElementByToken.monkey_idol,
                        ];
                        const count = list.reduce((acc, key) => {
                            if ((player.benefitInfo[key] ?? 0) > 0) {
                                return acc + 1;
                            }
                            return acc;
                        }, 0);
                        return count > 2
                            ? 4
                            : 0;
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
                events: {
                    onAcquire: {
                        cost: {
                            skill: 4,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 1,
                            boot: 1,
                        },
                        async callback(state, player) {
                            self.clankHelpService.drawCards({
                                state,
                                player,
                                count: 1,
                            });
                            return true;
                        },
                    },
                    getPoints(state, player) {
                        return 2;
                    },
                },
                count: 1,
            },
            {
                row: 2,
                column: 0,
                name: 'Эльфийский плащ',
                description: 'Эльфийский плащ',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 4,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 1,
                        },
                        async callback(state, player) {
                            self.clankHelpService.addClank({
                                state,
                                player,
                                count: -2,
                            });
                            self.clankHelpService.drawCards({
                                state,
                                player,
                                count: 1,
                            });
                            return true;
                        },
                    },
                    getPoints(state, player) {
                        return 2;
                    },
                },
                count: 1,
            },
            {
                row: 2,
                column: 1,
                name: 'Эльфийский кинжал',
                description: 'Эльфийский кинжал',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 4,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 1,
                            sword: 1,
                        },
                        async callback(state, player) {
                            self.clankHelpService.drawCards({
                                state,
                                player,
                                count: 1,
                            });
                            return true;
                        },
                    },
                    getPoints(state, player) {
                        return 2;
                    },
                },
                count: 1,
            },
            {
                row: 2,
                column: 2,
                name: 'Изумруд',
                description: 'Изумруд',
                type: ClankCardType.gem,
                events: {
                    onArrive: {
                        isDragonAttack: true,
                    },
                    onAcquire: {
                        cost: {
                            skill: 5,
                        },
                        async callback(state, player) {
                            self.clankHelpService.addClank({
                                state,
                                player,
                                count: 2,
                            });
                            return true;
                        },
                    },
                    onUse: {
                        async callback(state, player) {
                            self.clankHelpService.drawCards({
                                state,
                                player,
                                count: 1,
                            });
                            return true;
                        },
                    },
                    getPoints(state, player) {
                        return 5;
                    },
                },
                count: 1,
            },
            {
                row: 2,
                column: 3,
                name: 'Ковёр-самолёт',
                description: 'Ковёр-самолёт',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 6,
                        },
                    },
                    onUse: {
                        benefit: {
                            boot: 2,
                            ignore_crystal_cave: 1,
                            ignore_monster: 1,
                        },
                    },
                    getPoints(state, player) {
                        return 2;
                    },
                },
                count: 1,
            },
            {
                row: 2,
                column: 4,
                name: 'Сборщик драгоценностей',
                description: 'Сборщик драгоценностей',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 4,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 2,
                            gem_cost_less: 2,
                        },
                        async callback(state, player) {
                            self.clankHelpService.addClank({
                                state,
                                player,
                                count: -2,
                            });
                            return true;
                        },
                    },
                    getPoints(state, player) {
                        return 2;
                    },
                },
                count: 1,
            },
            {
                row: 2,
                column: 5,
                name: 'Взывающий к Древним',
                description: 'Взывающий к Древним',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 4,
                        },
                    },
                    onUse: {
                        benefit: {
                            teleport: 1,
                        },
                        async callback(state, player) {
                            self.clankHelpService.addClank({
                                state,
                                player,
                                count: 2,
                            });
                            return true;
                        },
                    },
                    getPoints(state, player) {
                        return 1;
                    },
                },
                count: 1,
            },
            {
                row: 2,
                column: 6,
                name: 'Кобольд-торгаш',
                description: 'Кобольд-торгаш',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 3,
                        },
                    },
                    onUse: {
                        benefit: {
                            coin: 2,
                        },
                        async callback(state, player) {
                            if (!player.artifacts.length) {
                                return true;
                            }
                            return self.clankHelpService.updateBenefitInfo({
                                player,
                                benefit: {
                                    skill: 2,
                                },
                            });
                        },
                    },
                    getPoints(state, player) {
                        return 1;
                    },
                },
                count: 1,
            },
            {
                row: 2,
                column: 7,
                name: 'Счастливая монетка',
                description: 'Счастливая монетка',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 1,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 1,
                        },
                        async callback(state, player) {
                            self.clankHelpService.addClank({
                                state,
                                player,
                                count: 1,
                            });
                            self.clankHelpService.drawCards({
                                state,
                                player,
                                count: 1,
                            });
                            return true;
                        },
                    },
                    getPoints(state, player) {
                        return 1;
                    },
                },
                count: 1,
            },
            {
                row: 2,
                column: 8,
                name: 'Профессиональный ворюга',
                description: 'Профессиональный ворюга',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 3,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 2,
                        },
                        async callback(state, player) {
                            player.needTrashCards.push(ClankCardName.Burgle);
                            return true;
                        },
                    },
                    getPoints(state, player) {
                        return 2;
                    },
                },
                count: 1,
            },
            {
                row: 2,
                column: 9,
                name: 'Господин Усач',
                description: 'Господин Усач',
                type: ClankCardType.basiс,
                events: {
                    onArrive: {
                        isDragonAttack: true,
                    },
                    onAcquire: {
                        cost: {
                            skill: 1,
                        },
                    },
                    onUse: {
                        async callback(state, player) {
                            return await self.openDialogChooseCardEvent({
                                count: 1,
                                list: [
                                    {
                                        description: 'Дракон атакует',
                                        event: () => {
                                            self.clankHelpService.onDragonAttack(state);
                                            return true;
                                        },
                                    },
                                    {
                                        description: '-2 Бдзынь',
                                        event: () => {
                                            self.clankHelpService.addClank({
                                                state,
                                                player,
                                                count: -2,
                                            });
                                            return true;
                                        },
                                    },
                                ],
                            });
                        },
                    },
                    getPoints(state, player) {
                        return 2;
                    },
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
                events: {
                    onArrive: {
                        async callback(state, player) {
                            Array(3).fill(GamePlayerColorIdEnum.Black).forEach(colorId => {
                                state.dragonInfo.clankBag.push(colorId);
                            });
                            return true;
                        },
                    },
                    onAcquire: {
                        cost: {
                            skill: 2,
                        },
                        async callback(state, player) {
                            return await self.openDialogChooseCardEvent({
                                count: 1,
                                list: [
                                    {
                                        description: 'Получить одну монетку',
                                        event: () => {
                                            return self.clankHelpService.updateBenefitInfo({
                                                player,
                                                benefit: {
                                                    coin: 1,
                                                },
                                            });
                                        },
                                    },
                                    {
                                        description: 'Восстановить одно очко здоровья',
                                        event: () => {
                                            return self.clankHelpService.updateBenefitInfo({
                                                player,
                                                benefit: {
                                                    heal: 1,
                                                },
                                            });
                                        },
                                    },
                                ],
                            });
                        },
                    },
                },
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



    private async openDialogChooseCardEvent(data: ChooseCardEventComponentData) {
        const dialog = this.matDialog.open<
            ChooseCardEventComponent,
            ChooseCardEventComponentData,
            ChooseCardEventComponentItem[]
        >(
            ChooseCardEventComponent,
            {
                data,
                width: '500px',
            },
        );
        const list = await dialog.afterClosed().toPromise();
        return list?.every(p => p.event()) ?? false;
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
    }

}
