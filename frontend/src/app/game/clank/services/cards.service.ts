import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { cloneDeep } from 'lodash';
import { ClankHelpService } from 'src/app/game/clank/services/clank-help.service';
import { ClankElementTypeMap } from 'src/app/shared/models/clank-element-types';
import { preloadImage } from 'src/app/shared/models/game.types';
import { UseTokenType } from 'src/app/shared/models/tokens/token.types';
import { ToastService } from 'src/app/shared/services/toast.service';

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
} from '../../../shared/modals/choose-card-event/choose-card-event.component';

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
    ) {
        preloadImage(Object.values(this.spriteInfo).map(p => p.url));
        preloadImage(Object.values(ClankElementTypeMap).map(p => p.url));
    }

    getReserveDecksCards(mapDlcId: ClankDlcEnum, userCount: number) {
        return this.getDeckIds(mapDlcId).flatMap((id) => this.reserveDecks[id]?.getCards(userCount) ?? []);
    }

    getStartDeckCards(mapDlcId: ClankDlcEnum, playerId: string) {
        return this.getDeckIds(mapDlcId).flatMap((id) => this.startDecks[id]?.getCards(playerId) ?? []);
    }

    getShareDecksCards(mapDlcId: ClankDlcEnum) {
        return this.getDeckIds(mapDlcId).flatMap((id) => this.shareDecks[id]?.getCards() ?? []);
    }

    getCardActionName(card: ClankCardConfig, eventName: keyof ClankCardBaseConfigEvents) {
        const actionName = card.events?.[eventName]?.actionName;
        if (actionName != null) {
            return actionName;
        }
        if (eventName === 'onUse') {
            return 'Использовать';
        }
        switch (card.type) {
            case ClankCardType.monster: {
                return 'Сразиться';
            }
            case ClankCardType.device: {
                return 'Использовать';
            }
            default: {
                return 'Купить';
            }
        }
    }

    private getDeckIds(mapDlcId: ClankDlcEnum): ClankDlcEnum[] {
        return mapDlcId === ClankDlcEnum.clank
            ? [ClankDlcEnum.clank]
            : [ClankDlcEnum.clank, mapDlcId];
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
                const result = await eventInfo?.callback?.(state, player, data.card) ?? true;
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
                description: 'Получите 2 очка навыка и 1 ботинок',
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
                description: 'Получите 1 очко навыка и 2 меча',
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
                name: ClankCardName.SecretTom,
                description: 'В конце игры приносит 7 победных очков',
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
                description: 'При победе игрок получает 1 монету',
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
                description: 'Получите 1 очко навыка',
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
                description: 'Получите 1 очко навыка и 1 ботинок',
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
                description: 'Получите 1 ботинок',
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
                description: 'Получите 1 бдзынь',
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
                description: 'Получите 4 очка навыка. При покупке восстанавливает 1 очко здоровья.',
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
                description: 'Сбросьте карту, чтобы получить одно: 3 меча или 2 монетки или 1 очко здоровья',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 3,
                        },
                    },
                    onUse: {
                        async callback(state, player, card) {
                            const result = await self.clankHelpService.discard({
                                card,
                                player,
                                count: 1,
                            });
                            if (result.data == null) {
                                return result.success;
                            }
                            return await self.openDialogChooseCardEvent({
                                count: 1,
                                list: [
                                    {
                                        description: 'Получить 3 меча',
                                        event: () => {
                                            return self.clankHelpService.updateBenefitInfo({
                                                player,
                                                benefit: {
                                                    sword: 3,
                                                },
                                            });
                                        },
                                    },
                                    {
                                        description: 'Получить 2 монеты',
                                        event: () => {
                                            return self.clankHelpService.updateBenefitInfo({
                                                player,
                                                benefit: {
                                                    coin: 2,
                                                },
                                            });
                                        },
                                    },
                                    {
                                        description: 'Восстановить 1 очко здоровья',
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
                description: 'Возьмите 1 карту. Если у вас есть обезьяна-идол, колучите 2 очка навыка',
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
                count: 2,
            },
            {
                row: 1,
                column: 1,
                name: 'Ботинки скорости',
                description: 'Получите 3 ботинка. При покупке игрок получает 1 ботинок.',
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
                description: 'Возьмите 2 карты',
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
                count: 2,
            },
            {
                row: 1,
                column: 3,
                name: 'Гениальность',
                description: 'Возьмите 3 карты',
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
                description: 'Получите 2 очка навыка и 1 меч. При покупке восстанавливает 1 очко здоровья.',
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
                count: 2,
            },
            {
                row: 1,
                column: 5,
                name: 'Бежать сломя голову',
                description: 'Получите 2 ботинка и 2 бдзынь! Вы не обязаны останавливаться в Кристальных пещерах в этот ход',
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
                count: 2,
            },
            {
                row: 1,
                column: 6,
                name: 'Бриллиант',
                description: 'Возьмите 1 карты. При покупке получите 2 бдзынь',
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
                description: 'Можно купить только в Глубинах. Возьмите 1 карту. Приносит 10 победных очков, если у вас есть жетон мастерства.',
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
                description: 'Получите 2 монетки и 1 ботинок. Приносит 4 очка, если у вас есть 2 предмета из списка: Кубок, драконье яйцо и обезьяна-идол.',
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
                description: 'Возьмите 1 карту. Получите 1 очко навыка и 1 ботинок.',
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
                description: 'Получите 1 очко навыка. Уберите 2 бдзынь. Возьмите 1 карту.',
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
                description: 'Получите 1 очко навыка и 1 меч. Возьмите карту.',
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
                description: 'Возьмите 1 карту. При покупке получите 2 бдзынь.',
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
                count: 2,
            },
            {
                row: 2,
                column: 3,
                name: 'Ковёр-самолёт',
                description: 'Получите 2 ботинка. В этот ход играрируйте монстров в туннелях, и вы не обязаны останавливаться в Кристальных пещерах',
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
            // Вернуть карту после реализации gem_cost_less
            // {
            //     row: 2,
            //     column: 4,
            //     name: 'Сборщик драгоценностей',
            //     description: 'Получите 2 очка навыка. Уберите 2 бдзынь. В этот ход драгоценности стоят на 2 меньше',
            //     type: ClankCardType.companion,
            //     events: {
            //         onAcquire: {
            //             cost: {
            //                 skill: 4,
            //             },
            //         },
            //         onUse: {
            //             benefit: {
            //                 skill: 2,
            //                 // TODO: Уменьшить gem стоимоть на 2
            //                 gem_cost_less: 2,
            //             },
            //             async callback(state, player) {
            //                 self.clankHelpService.addClank({
            //                     state,
            //                     player,
            //                     count: -2,
            //                 });
            //                 return true;
            //             },
            //         },
            //         getPoints(state, player) {
            //             return 2;
            //         },
            //     },
            //     count: 1,
            // },
            {
                row: 2,
                column: 5,
                name: 'Взывающий к Древним',
                description: 'Получите 1 бдзынь. Телепортируйтесь в соседнюю комнату',
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
                column: 6,
                name: 'Кобольд-торгаш',
                description: 'Получите 2 монетки. Если у вас есть артефакт, получите 2 навыка',
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
                description: 'Получите 1 очко навыка и 1 бдзынь. Возьмите 1 карту',
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
                count: 2,
            },
            {
                row: 2,
                column: 8,
                name: 'Профессиональный ворюга',
                description: 'Получите 2 очка навыка. В конце хода уничтожте свою карту "Взломать сундук", сыгранную или лежащую в сбросе.',
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
                count: 2,
            },
            {
                row: 2,
                column: 9,
                name: 'Господин Усач',
                description: 'Выберите: дракон атакует или -2 бдзынь',
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
                                        description: '-2 бдзынь',
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

            //#region 30
            {
                row: 3,
                column: 0,
                name: 'Робомартышка 3000',
                description: 'Получите 3 бдзынь. Возьмите 3 карты.',
                type: ClankCardType.companion,
                events: {
                    onArrive: {
                        isDragonAttack: true,
                    },
                    onAcquire: {
                        cost: {
                            skill: 5,
                        },
                    },
                    onUse: {
                        async callback(state, player) {
                            self.clankHelpService.addClank({
                                state,
                                player,
                                count: 3,
                            });
                            self.clankHelpService.drawCards({
                                state,
                                player,
                                count: 3,
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
                row: 3,
                column: 1,
                name: 'Двигаться бесшумно',
                description: 'Получите 2 ботинка и уберите 2 бдзынь',
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
                },
                count: 2,
            },
            {
                row: 3,
                column: 2,
                name: 'Кирка',
                description: 'Получите 2 меча и 2 монеты',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 4,
                        },
                    },
                    onUse: {
                        benefit: {
                            sword: 2,
                            coin: 2,
                        },
                    },
                    getPoints(state, player) {
                        return 2;
                    },
                },
                count: 1,
            },
            {
                row: 3,
                column: 3,
                name: 'Мятежный капитан',
                description: 'Получите 2 очка навыка. Если у вас сыгран хотя бы 1 компаньон, возьмите 1 карту',
                type: ClankCardType.companion,
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
                            if (!player.benefitInfo.companion) {
                                return true;
                            }
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
                row: 3,
                column: 4,
                name: 'Мятежный шахтёр',
                description: 'Получите 2 монетки. Если у вас сыгран хотя бы 1 компаньон, возьмите 1 карту',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 2,
                        },
                    },
                    onUse: {
                        benefit: {
                            coin: 2,
                        },
                        async callback(state, player) {
                            if (!player.benefitInfo.companion) {
                                return true;
                            }
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
                row: 3,
                column: 5,
                name: 'Разведчик-мятежник',
                description: 'Получите 2 ботинка. Если у вас сыгран хотя бы 1 компаньон, возьмите 1 карту',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 3,
                        },
                    },
                    onUse: {
                        benefit: {
                            boot: 2,
                        },
                        async callback(state, player) {
                            if (!player.benefitInfo.companion) {
                                return true;
                            }
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
                row: 3,
                column: 6,
                name: 'Солдат-мятежник',
                description: 'Получите 2 меча. Если у вас сыгран хотя бы 1 компаньон, возьмите 1 карту',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 2,
                        },
                    },
                    onUse: {
                        benefit: {
                            sword: 2,
                        },
                        async callback(state, player) {
                            if (!player.benefitInfo.companion) {
                                return true;
                            }
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
                row: 3,
                column: 7,
                name: 'Рубин',
                description: 'Возьмите 1 карту. При покупке получите 2 бдзынь',
                type: ClankCardType.gem,
                events: {
                    onArrive: {
                        isDragonAttack: true,
                    },
                    onAcquire: {
                        cost: {
                            skill: 6,
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
                        return 6;
                    },
                },
                count: 2,
            },
            {
                row: 3,
                column: 8,
                name: 'Сапфир',
                description: 'Возьмите 1 карту. При покупке получите 2 бдзынь',
                type: ClankCardType.gem,
                events: {
                    onArrive: {
                        isDragonAttack: true,
                    },
                    onAcquire: {
                        cost: {
                            skill: 4,
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
                        return 4;
                    },
                },
                count: 3,
            },
            {
                row: 3,
                column: 9,
                name: 'Скипетр повелителя обезьян',
                description: 'Получите 3 очка навыка и 3 бдзынь',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 3,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 3,
                        },
                        async callback(state, player) {
                            self.clankHelpService.addClank({
                                state,
                                player,
                                count: 3,
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
            //#endregion 30

            //#region 40
            {
                row: 4,
                column: 0,
                name: 'Обыск',
                description: 'Получите 2 очка навыка и ботинок. Каждый раз, когда вы в этот ход получаете золото, получаемое количество золота увеличивается на 1',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 4,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 2,
                            boot: 1,
                            additional_coin: 1,
                        },
                    },
                },
                count: 2,
            },
            {
                row: 4,
                column: 1,
                name: 'Серебреное копьё',
                description: 'Получите 3 меча',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 3,
                        },
                        benefit: {
                            sword: 1,
                        },
                    },
                    onUse: {
                        benefit: {
                            sword: 3,
                        },
                    },
                    getPoints(state, player) {
                        return 2;
                    },
                },
                count: 2,
            },
            {
                row: 4,
                column: 2,
                name: 'Поющий меч',
                description: 'Получите 3 очка навыка, 2 меча и 1 бдзынь.',
                type: ClankCardType.basiс,
                events: {
                    onArrive: {
                        isDragonAttack: true,
                    },
                    onAcquire: {
                        cost: {
                            skill: 5,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 3,
                            sword: 2,
                        },
                        async callback(state, player) {
                            self.clankHelpService.addClank({
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
                row: 4,
                column: 3,
                name: 'Ловкость рук',
                description: 'Сбросте 1 карту и возьмите 2 карты',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 2,
                        },
                    },
                    onUse: {
                        async callback(state, player, card) {
                            const result = await self.clankHelpService.discard({
                                card,
                                player,
                                count: 1,
                            });
                            if (result.data == null) {
                                return result.success;
                            }
                            self.clankHelpService.drawCards({
                                state,
                                player,
                                count: 2,
                            });
                            return true;
                        },
                    },
                },
                count: 2,
            },
            {
                row: 4,
                column: 4,
                name: 'Подкрадываться',
                description: 'Получите 1 очко навыка и 1 ботинок. Уберите 2 бдзынь',
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
                            boot: 1,
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
                },
                count: 2,
            },
            {
                row: 4,
                column: 5,
                name: 'Бахвальство',
                description: 'Получите ботинок и по 1 очку навыка за каждый сделаный вами в этом ходу бдзынь',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 2,
                        },
                    },
                    onUse: {
                        benefit: {
                            boot: 1,
                        },
                        async callback(state, player) {
                            return self.clankHelpService.updateBenefitInfo({
                                player,
                                benefit: {
                                    skill: player.benefitInfo.clank,
                                },
                            });
                        },
                    },
                },
                count: 2,
            },
            {
                row: 4,
                column: 6,
                name: 'Болтовня',
                description: 'Каждый другой игрок получает 1 бдзынь',
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
                            state.players.filter(p => p.id !== player.id).forEach((p) => {
                                self.clankHelpService.addClank({
                                    state,
                                    player: p,
                                    count: 1,
                                });
                            });
                            return true;
                        },
                    },
                },
                count: 2,
            },
            {
                row: 4,
                column: 7,
                name: 'Герцог',
                description: 'Получите 2 очка навыка и 2 меча. Приносит по 1 победному, за каждые 5 монет',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 5,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 2,
                            sword: 2,
                        },
                    },
                    getPoints(state, player) {
                        const coins = player.benefitInfo.coin ?? 0;
                        return Math.floor(coins / 5);
                    },
                },
                count: 1,
            },
            {
                row: 4,
                column: 8,
                name: 'Король под горой',
                description: 'Получите 2 очка навыка, меч и ботинок. Если у вас есть корона, то получите меч и ботинок',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 6,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 2,
                            sword: 1,
                            boot: 1,
                        },
                        async callback(state, player) {
                            if (!player.benefitInfo.crown) {
                                return true;
                            }
                            return self.clankHelpService.updateBenefitInfo({
                                player,
                                benefit: {
                                    sword: 1,
                                    boot: 1,
                                },
                            });
                        },
                    },
                    getPoints(state, player) {
                        return 3;
                    },
                },
                count: 1,
            },
            {
                row: 4,
                column: 9,
                name: 'Королева червей',
                description: 'Получите 3 очка навыков и меч. Если у вас есть корона, восстановите 1 очко здоровья',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 6,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 3,
                            sword: 1,
                        },
                        async callback(state, player) {
                            if (!player.benefitInfo.crown) {
                                return true;
                            }
                            return self.clankHelpService.updateBenefitInfo({
                                player,
                                benefit: {
                                    heal: 1,
                                },
                            });
                        },
                    },
                    getPoints(state, player) {
                        return 3;
                    },
                },
                count: 1,
            },
            //#endregion 40

            //#region 50
            {
                row: 5,
                column: 0,
                name: 'Искатель сокровищ',
                description: 'Получите 2 очка навыка и 2 меча. Замените карту в ряду подземелья. (Если на новой карте есть символ дракона, игнорируйте его)',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 3,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 2,
                            sword: 2,
                        },
                        async callback(state, player) {
                            const card = state.dungeonDeck.pop();
                            if (!state.dungeonRow.length || !card) {
                                return true;
                            }
                            const result = await self.clankHelpService.chooseCards({
                                cards: state.dungeonRow,
                                count: 1,
                                errorText: 'Недостаточно карт в подземном',
                                title: 'Замените карту в ряду подземелья',
                                actionText: 'Подтвердить выбор',
                            });
                            if (result.data == null) {
                                return result.success;
                            }
                            state.dungeonRow = [
                                ...result.data.other,
                                card,
                            ];
                            return true;
                        },
                    },
                    getPoints(state, player) {
                        return 1;
                    },
                },
                count: 2,
            },
            {
                row: 5,
                column: 1,
                name: 'Карта сокровищ',
                description: 'Получите 5 монет',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 6,
                        },
                    },
                    onUse: {
                        benefit: {
                            coin: 5,
                        },
                    },
                },
                count: 1,
            },
            {
                row: 5,
                column: 2,
                name: 'Всё-всё знающий о туннелях',
                description: 'Получите 1 меч и 1 ботинок',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 1,
                        },
                    },
                    onUse: {
                        benefit: {
                            sword: 1,
                            boot: 1,
                        },
                    },
                    getPoints(state, player) {
                        return 1;
                    },
                },
                count: 2,
            },
            {
                row: 5,
                column: 3,
                name: 'Теневая сделка',
                description: 'Получить 1 монету или потратить 7 монет, чтобы взять 2 книги тайн',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 1,
                        },
                    },
                    onUse: {
                        async callback(state, player) {
                            return self.openDialogChooseCardEvent({
                                count: 1,
                                list: [
                                    {
                                        description: 'Получить 1 монету',
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
                                        description: 'Потратить 7 монет, чтобы взять 2 книги тайн',
                                        event: () => {
                                            const success = self.clankHelpService.updateBenefitInfo({
                                                player,
                                                cost: {
                                                    coin: 7,
                                                },
                                            });
                                            if (!success) {
                                                return false;
                                            }
                                            let count = 2;
                                            const list = state.reserveRow.filter(p => p.name === ClankCardName.SecretTom);
                                            while (count > 0 && list.length > 0) {
                                                const tomCard = list.pop();
                                                if (tomCard == null) {
                                                    return true;
                                                }
                                                state.reserveRow = state.reserveRow.filter(p => p.id === tomCard.id);
                                                player.discard.push(tomCard);
                                                count--;
                                            }
                                            return true;
                                        },
                                    },
                                ],
                            });
                        },
                    },
                },
                count: 1,
            },
            {
                row: 5,
                column: 4,
                name: 'Жезл ветра',
                description: 'Получите 2 очка навыка. Если у вас есть артефакт, телепортируйтесь в соседнюю комнату',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 5,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 2,
                        },
                        async callback(state, player) {
                            if (player.artifacts.length > 0) {
                                return self.clankHelpService.updateBenefitInfo({
                                    player,
                                    benefit: {
                                        teleport: 1,
                                    },
                                });
                            }
                            return true;
                        },
                    },
                    getPoints(state, player) {
                        return 1;
                    },
                },
                count: 2,
            },
            {
                row: 5,
                column: 5,
                name: 'Жезл ветра',
                description: 'Телепортируйтесь в соседнюю комнату или получите случайный маленький секрет',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 6,
                        },
                    },
                    onUse: {
                        async callback(state, player) {
                            return self.openDialogChooseCardEvent({
                                count: 1,
                                list: [
                                    {
                                        description: 'Телепортируйтесь в соседнюю комнату',
                                        event: () => {
                                            return self.clankHelpService.updateBenefitInfo({
                                                player,
                                                benefit: {
                                                    teleport: 1,
                                                },
                                            });
                                        },
                                    },
                                    {
                                        description: 'Получите случайный маленький секрет',
                                        event: () => {
                                            const tokenInfo = state.mapTokens.pop();
                                            if (!tokenInfo) {
                                                return true;
                                            }
                                            return self.clankHelpService.takeToken(
                                                state,
                                                player,
                                                tokenInfo,
                                                UseTokenType.take,
                                            );
                                        },
                                    },
                                ],
                            });
                        },
                    },
                    getPoints(state, player) {
                        return 3;
                    },
                },
                count: 1,
            },
            {
                row: 5,
                column: 6,
                name: 'Волшебник',
                description: 'Получите 3 очка навыка. Приносит 2 победных очка за каждую вашу книгу тайн',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 6,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 3,
                        },
                    },
                    getPoints(state, player) {
                        const list = [
                            ...player.deck,
                            ...player.hand,
                            ...player.board,
                            ...player.discard,
                        ].filter(p => p.name === ClankCardName.SecretTom);
                        return list.length * 2;
                    },
                },
                count: 1,
            },
            {
                row: 5,
                column: 7,
                name: 'Капище дракона',
                description: 'Получить 2 монеты или уничтожить свою сыгранную карту или свою карту в сбросе',
                type: ClankCardType.device,
                danger: 1,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 4,
                        },
                        async callback(state, player) {
                            return await self.openDialogChooseCardEvent({
                                count: 1,
                                list: [
                                    {
                                        description: 'Получить 2 монетки',
                                        event: () => {
                                            return self.clankHelpService.updateBenefitInfo({
                                                player,
                                                benefit: {
                                                    coin: 2,
                                                },
                                            });
                                        },
                                    },
                                    {
                                        description: 'Уничтожить свою сыгранную карту или свою карту в сбросе',
                                        event: () => {
                                            player.needTrashCards.push(ClankCardName.All);
                                            return true;
                                        },
                                    },
                                ],
                            });
                        },
                    },
                },
                count: 2,
            },
            {
                row: 5,
                column: 8,
                name: 'Лестница',
                description: 'Получить 2 ботинка',
                type: ClankCardType.device,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 3,
                        },
                        benefit: {
                            boot: 2,
                        },
                    },
                    getPoints(state, player) {
                        return 1;
                    },
                },
                count: 2,
            },
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
                count: 3,
            },
            //#endregion 50

            //#region 60
            {
                row: 6,
                column: 0,
                name: 'Телепорт',
                description: 'Телепортируйтесь в соседнюю комнату',
                type: ClankCardType.device,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 4,
                        },
                        benefit: {
                            teleport: 1,
                        },
                    },
                },
                count: 2,
            },
            {
                row: 6,
                column: 1,
                name: 'Хранилище',
                description: 'Можно купить только в Глубинах. Получите 5 монет и 3 бдзынь',
                type: ClankCardType.device,
                onlyDepthsArea: true,
                events: {
                    onArrive: {
                        isDragonAttack: true,
                    },
                    onAcquire: {
                        cost: {
                            skill: 3,
                        },
                        benefit: {
                            coin: 5,
                        },
                        async callback(state, player) {
                            self.clankHelpService.addClank({
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
                row: 6,
                column: 2,
                name: 'Ожившая дверь',
                description: 'Получите 1 ботинок',
                type: ClankCardType.monster,
                events: {
                    onArrive: {
                        isDragonAttack: true,
                    },
                    onAcquire: {
                        cost: {
                            sword: 1,
                        },
                        benefit: {
                            boot: 1,
                        },
                    },
                },
                count: 2,
            },
            {
                row: 6,
                column: 3,
                name: 'Громогласный рыг',
                description: 'Получите 4 монеты и 2 бдзынь',
                type: ClankCardType.monster,
                events: {
                    onArrive: {
                        isDragonAttack: true,
                    },
                    onAcquire: {
                        cost: {
                            sword: 2,
                        },
                        benefit: {
                            coin: 4,
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
                count: 2,
            },
            {
                row: 6,
                column: 4,
                name: 'Пещерный тролль',
                description: 'Можно купить только в Глубинах. Получить 3 монеты и взять 2 карты',
                type: ClankCardType.monster,
                events: {
                    onArrive: {
                        isDragonAttack: true,
                    },
                    onAcquire: {
                        cost: {
                            sword: 4,
                        },
                        benefit: {
                            coin: 3,
                        },
                        async callback(state, player) {
                            self.clankHelpService.drawCards({
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
                row: 6,
                column: 5,
                name: 'Кристальный голем',
                description: 'Можно сражаться только в Кристальной пещере. Получить 3 очка навыка',
                type: ClankCardType.monster,
                onlyCrystalCave: true,
                events: {
                    onAcquire: {
                        cost: {
                            sword: 3,
                        },
                        benefit: {
                            skill: 3,
                        },
                    },
                },
                count: 2,
            },
            {
                row: 6,
                column: 6,
                name: 'Кобальд',
                description: 'Получить 1 очко навыка',
                type: ClankCardType.monster,
                danger: 1,
                events: {
                    onArrive: {
                        isDragonAttack: true,
                    },
                    onAcquire: {
                        cost: {
                            sword: 1,
                        },
                        benefit: {
                            skill: 1,
                        },
                    },
                },
                count: 3,
            },
            {
                row: 6,
                column: 7,
                name: 'Огр',
                description: 'Получить 5 монет',
                type: ClankCardType.monster,
                events: {
                    onArrive: {
                        isDragonAttack: true,
                    },
                    onAcquire: {
                        cost: {
                            sword: 3,
                        },
                        benefit: {
                            coin: 5,
                        },
                    },
                },
                count: 2,
            },
            {
                row: 6,
                column: 8,
                name: 'Орк-пехотинец',
                description: 'Получить 3 монеты',
                type: ClankCardType.monster,
                events: {
                    onArrive: {
                        isDragonAttack: true,
                    },
                    onAcquire: {
                        cost: {
                            sword: 2,
                        },
                        benefit: {
                            coin: 3,
                        },
                    },
                },
                count: 3,
            },
            {
                row: 6,
                column: 9,
                name: 'Повелитель',
                description: 'Возьмите 2 карты',
                type: ClankCardType.monster,
                events: {
                    onArrive: {
                        target: ClankTarget.all,
                        async callback(state, player) {
                            self.clankHelpService.addClank({
                                state,
                                player,
                                count: 1,
                            });
                            return true;
                        },
                    },
                    onAcquire: {
                        cost: {
                            sword: 2,
                        },
                        async callback(state, player) {
                            self.clankHelpService.drawCards({
                                state,
                                player,
                                count: 2,
                            });
                            return true;
                        },
                    },
                },
                count: 2,
            },
            //#endregion 60
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
