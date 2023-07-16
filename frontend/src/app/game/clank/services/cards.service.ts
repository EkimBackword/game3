import { Injectable } from '@angular/core';

import * as lodash from 'lodash';
import { ClankHelpService } from 'src/app/game/clank/services/clank-help.service';
import { ClankElementTypeMap } from 'src/app/shared/models/clank-element-types';
import { preloadImage } from 'src/app/shared/models/game.types';
import { mumiaCardUniqFindString } from 'src/app/shared/models/maps/clank_mumii_1';
import { UseTokenType } from 'src/app/shared/models/tokens/token.types';

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
import {
    GameInfoActionLogType,
    GameInfoState,
} from '@shared/clank/clank-game.types';
import {
    ClankCardType,
    ClankDlcEnum,
    ClankElementByGame,
    ClankElementByMarket,
    ClankElementByToken,
    ClankTarget,
} from '@shared/clank/clank-info.types';
import {
    ClankPlayerConfig,
    GamePlayerColorIdEnum,
} from '@shared/clank/clank-player.types';

import {
    ChooseCardEventComponentData,
    ChooseCardEventComponentItem,
} from '../dialogs/choose-card-event/choose-card-event.component';
import { GameDialogsService } from './game-dialogs.service';

@Injectable()
export class CardsService {

    private lastIndex = 0;

    private spriteInfo: Record<ClankDlcEnum, ClankDeckSpriteInfo> = {
        [ClankDlcEnum.clank]: {
            dlc_name: ClankDlcEnum.clank,
            url: '/assets/images/cards/clank.jpg',
            backgroundSize: '1000% 800%',
        },
        [ClankDlcEnum.clank_sunken_treasures]: {
            dlc_name: ClankDlcEnum.clank_sunken_treasures,
            url: '/assets/images/cards/clank_sunken_treasures.jpg',
            backgroundSize: '1000% 300%',
        },
        [ClankDlcEnum.clank_proklyatie_mumii]: {
            dlc_name: ClankDlcEnum.clank_proklyatie_mumii,
            url: '/assets/images/cards/clank_the_mummys_curse.jpg',
            backgroundSize: '1000% 400%',
        },
        [ClankDlcEnum.clank_expeditions_goldand_silk]: {
            dlc_name: ClankDlcEnum.clank_expeditions_goldand_silk,
            url: '',
            backgroundSize: '0% 0%',
        },
        [ClankDlcEnum.clank_temple_of_the_ape_lords]: {
            dlc_name: ClankDlcEnum.clank_temple_of_the_ape_lords,
            url: '',
            backgroundSize: '0% 0%',
        },
        [ClankDlcEnum.clank_adventuring_party]: {
            dlc_name: ClankDlcEnum.clank_adventuring_party,
            url: '/assets/images/cards/clank_adventuring_party.jpg',
            backgroundSize: '800% 700%',
        },
    };

    private store = [
        ...this.initClankReserveCards(1, false),
        ...this.initClankMumiaReserveCards(false),
        ...this.initClankStartCards('', false),
        ...this.initClankDeckCards(false),
        ...this.initClankMumiaDeckCards(false),
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
        [ClankDlcEnum.clank_proklyatie_mumii]: {
            getCards: () => this.initClankMumiaDeckCards(true),
        },
    };

    constructor(
        private clankHelpService: ClankHelpService,
        private gameDialogsService: GameDialogsService,
    ) {
        preloadImage(Object.values(ClankElementTypeMap).map(p => p.url));
    }

    getReserveDecksCards(mapDlcId: ClankDlcEnum, userCount: number) {
        return this.getDeckIds(mapDlcId).flatMap((id) => this.reserveDecks[id]?.getCards(userCount) ?? []);
    }

    getStartDeckCards(mapDlcId: ClankDlcEnum, playerId: string) {
        return this.getDeckIds(mapDlcId).flatMap((id) => this.startDecks[id]?.getCards(playerId) ?? []);
    }

    getShareDecksCards(mapDlcId: ClankDlcEnum) {
        return this.getDeckIds(mapDlcId).flatMap((id) => {
            preloadImage([this.spriteInfo[id].url]);
            return this.shareDecks[id]?.getCards() ?? [];
        });
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
        const state = lodash.cloneDeep(data.state);
        if (eventInfo != null) {
            const target = eventInfo.target ?? ClankTarget.current;
            for (const player of state.players) {
                const isCurrent = player.id === state.activePlayerId;
                const isCurrentUpdate = isCurrent && target !== ClankTarget.other;
                const isOtherUpdate = !isCurrent && target !== ClankTarget.current;
                if (!isCurrentUpdate && !isOtherUpdate) {
                    continue;
                }
                let cost = lodash.cloneDeep(eventInfo.cost);
                if (data.eventName === 'onAcquire'
                    && cardInfo?.type === ClankCardType.gem
                    && player.benefitInfo.gem_cost_less != null
                    && cost != null) {
                    const skill = (cost.skill ?? 0) - player.benefitInfo.gem_cost_less;
                    cost = {
                        ...cost,
                        skill: skill >= 0 ? skill : 0,
                    };
                }
                const isPlayerUpdate = this.clankHelpService.updateBenefitInfo({
                    player,
                    cost,
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
        const eventText = data.eventName === 'onAcquire' && cardInfo?.type === ClankCardType.monster
            ? 'победил'
            : ClankCardBaseConfigEventInfoByType[data.eventName].text;
        this.clankHelpService.addActionLogs({
            state,
            type: GameInfoActionLogType.Card,
            data: {
                text: data.eventName !== 'onArrive'
                    ? `${currentPlayer.name} ${eventText} ${data.card.name} | (Здоровье: ${currentPlayer.benefitInfo.heal ?? 0})`
                    : `${eventText} ${data.card.name}`,
                colorId: data.eventName !== 'onArrive'
                    ? currentPlayer.colorId
                    : GamePlayerColorIdEnum.Black,
                hideToast: true,
            },
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
        const state = lodash.cloneDeep(data.state);
        const cardInfo = this.getCardInfo(data.card);
        return cardInfo?.events?.getPoints?.(state, data.player) ?? 0;
    }

    private getCardInfo(card: ClankCardConfig) {
        const [find_string] = card.id.split('__');
        return this.getCardByFindString(find_string);
    }

    getCardByFindString(find_string: string) {
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
                type: ClankCardType.companion,
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

    private initClankMumiaReserveCards(withCopy: boolean) {
        const self = this;
        const cards: ClankCardBaseConfig[] = [
            {
                uniq_find_string: mumiaCardUniqFindString,
                row: 3,
                column: 0,
                name: 'Мумия',
                description: 'Движение: Каждый игрок в зоне мумии получает 1 проклятие',
                type: ClankCardType.monster,
                events: {
                    onAcquire: {
                        async callback(state, player, card) {
                            const canUse = self.clankHelpService.canUseMumiaCard(state);
                            const result = await self.openDialogChooseCardEvent({
                                count: canUse ? 1 : 0,
                                list: [
                                    {
                                        description: 'За 2 меча | Получите 4 монеты и 1 проклятие',
                                        event: () => {
                                            return self.clankHelpService.updateBenefitInfo({
                                                player,
                                                cost: {
                                                    sword: 2,
                                                },
                                                benefit: {
                                                    coin: 4,
                                                    curse: 1,
                                                },
                                            });
                                        },
                                    },
                                    {
                                        description: 'За 3 меча | Снимите половину проклятий (округляя вверх)',
                                        event: () => {
                                            const curse = player.benefitInfo.curse ?? 0;
                                            return self.clankHelpService.updateBenefitInfo({
                                                player,
                                                cost: {
                                                    sword: 3,
                                                },
                                                benefit: {
                                                    curse: -Math.ceil(curse / 2),
                                                },
                                            });
                                        },
                                    },
                                ],
                            });
                            if (!result) {
                                return result;
                            }
                            self.clankHelpService.changeMumiaPosition(state);
                            return true;
                        },
                    },
                },
                count: -1,
            },
        ];
        const reserveMumiaDeckConfig: ClankDeckConfig = {
            ...this.spriteInfo.clank_proklyatie_mumii,
            cards,
            position: ClankCardPositionEnum.reserveRow,
        };
        return this.mappingDeckCards(reserveMumiaDeckConfig, withCopy);
    }

    private initClankMumiaDeckCards(withCopy: boolean) {
        const self = this;
        const cards: ClankCardBaseConfig[] = [
            //#region 00
            {
                row: 0,
                column: 0,
                name: 'Царица скорпионов',
                description: 'При победе: 7 монет. Получите на 1 монету меньше, за каждое ваше проклятие',
                type: ClankCardType.monster,
                events: {
                    onArrive: {
                        isDragonAttack: true,
                    },
                    onAcquire: {
                        cost: {
                            sword: 4,
                        },
                        async callback(state, player, card) {
                            const count = 7 - (player.benefitInfo.curse ?? 0);
                            return self.clankHelpService.updateBenefitInfo({
                                player,
                                benefit: {
                                    coin: count,
                                },
                            });
                        },
                    },
                },
                count: 1,
            },
            {
                row: 0,
                column: 1,
                name: 'Каменная обезьяна',
                description: 'При победе: 3 монет. Если у вас есть обезьяна-идол, то восстановите 1 очко здоровья',
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
                            coin: 3,
                        },
                        async callback(state, player, card) {
                            if (!self.clankHelpService.hasBenefit(player, ClankElementByToken.monkey_idol)) {
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
                },
                count: 1,
            },
            {
                row: 0,
                column: 2,
                name: 'Могильная змея',
                description: 'Можно купить только в Глубинах. При победе: 2 навыка. При появлении: все игроки получают +1 Бдзынь',
                type: ClankCardType.monster,
                onlyDepthsArea: true,
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
                        benefit: {
                            skill: 2,
                        },
                    },
                },
                count: 2,
            },
            {
                row: 0,
                column: 3,
                name: 'Сфинкс Усач',
                description: 'При победе: Возьмите 2 карты, снимите 1 проклятие. При появлении: Бросте кубик пирамиды.',
                type: ClankCardType.monster,
                events: {
                    onArrive: {
                        async callback(state, player, card) {
                            self.clankHelpService.changeMumiaPosition(state);
                            return true;
                        },
                    },
                    onAcquire: {
                        cost: {
                            sword: 3,
                        },
                        async callback(state, player, card) {
                            self.clankHelpService.drawCards({
                                state,
                                player,
                                count: 2,
                            });
                            return self.clankHelpService.updateBenefitInfo({
                                player,
                                benefit: {
                                    curse: -1,
                                },
                            });
                        },
                    },
                },
                count: 1,
            },
            {
                row: 0,
                column: 4,
                name: 'Книга мёртвых',
                description: 'Возьми три карты. Приносит 1 победное очко за каждое ваше проклятие.',
                type: ClankCardType.basiс,
                events: {
                    onArrive: {
                        isDragonAttack: true,
                    },
                    onAcquire: {
                        cost: {
                            skill: 7,
                        },
                    },
                    onUse: {
                        async callback(state, player, card) {
                            self.clankHelpService.drawCards({
                                state,
                                player,
                                count: 3,
                            });
                            return true;
                        },
                    },
                    getPoints(state, player) {
                        return (player.benefitInfo.curse ?? 0);
                    },
                },
                count: 1,
            },
            {
                row: 0,
                column: 5,
                name: 'Хлыст',
                description: 'Получить 2 навыка, 1 меч, 1 ботинок и 1 Бдзынь',
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
                            sword: 1,
                            boot: 1,
                        },
                        async callback(state, player, card) {
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
                count: 2,
            },
            {
                row: 0,
                column: 6,
                name: 'Верблюд',
                description: 'Получить 1 меч и 1 ботинок. Если в этот ход вы взяли какой-либо секрет, возьмите карту',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 3,
                        },
                    },
                    onUse: {
                        benefit: {
                            sword: 1,
                            boot: 1,
                        },
                        async callback(state, player, card) {
                            const count = (player.benefitInfo.minor_secret ?? 0) + (player.benefitInfo.major_secret ?? 0);
                            if (count === 0) {
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
                row: 0,
                column: 7,
                name: 'Хрустальный череп',
                description: 'Получить 3 навыка. Если у вас в игровой зоне или сбросе есть хотя бы две драгоценности, возьмите "Книгу тайн"',
                type: ClankCardType.basiс,
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
                        async callback(state, player, card) {
                            const gems = [
                                ...player.board,
                                ...player.discard,
                            ].filter(p => p.type === ClankCardType.gem);
                            if (gems.length === 0) {
                                return true;
                            }
                            const count = (player.benefitInfo.minor_secret ?? 0) + (player.benefitInfo.major_secret ?? 0);
                            if (count === 0) {
                                return true;
                            }
                            const list = state.reserveRow.filter(p => p.name === ClankCardName.SecretTom);
                            const tomCard = list.pop();
                            if (tomCard == null) {
                                return true;
                            }
                            state.reserveRow = state.reserveRow.filter(p => p.id !== tomCard.id);
                            player.discard.push(tomCard);
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
                row: 0,
                column: 8,
                name: 'Отважный исследователь',
                description: 'Получить 2 навыка м 1 ботинок. Вы можете получить +2 Бдзынь чтобы взять секрет или обезьяну-идола из соседней комнаты',
                type: ClankCardType.companion,
                danger: 1,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 6,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 2,
                            boot: 1,
                        },
                        async callback(state, player, card) {
                            const result = self.clankHelpService.hasTokensNear({
                                state,
                                player,
                                types: [
                                    {
                                        text: '+2 Бдзынь | Получить большой секрет',
                                        type: ClankElementByGame.major_secret,
                                    },
                                    {
                                        text: '+2 Бдзынь | Получить маленький секрет',
                                        type: ClankElementByGame.minor_secret,
                                    },
                                    {
                                        text: '+2 Бдзынь | Получить большой идол',
                                        type: ClankElementByToken.monkey_idol,
                                        value: 10,
                                    },
                                    {
                                        text: '+2 Бдзынь | Получить маленький идол',
                                        type: ClankElementByToken.monkey_idol,
                                        value: 5,
                                    },
                                ],
                            });
                            if (result.length === 0) {
                                return true;
                            }
                            const list = result.map((typeInfo) => {
                                const item: ChooseCardEventComponentItem = {
                                    description: typeInfo.text,
                                    event: () => {
                                        const tokenInfo = typeInfo.tokens.pop();
                                        if (!tokenInfo) {
                                            return true;
                                        }
                                        state.mapTokens = state.mapTokens.filter(p => p.id !== tokenInfo.id);
                                        return self.clankHelpService.takeToken(
                                            state,
                                            player,
                                            tokenInfo,
                                            UseTokenType.take,
                                        );
                                    },
                                };
                                return item;
                            });
                            list.push({
                                description: 'Не получать бдзынь',
                                event: () => true,
                            });
                            return await self.openDialogChooseCardEvent({
                                count: 1,
                                list,
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
                row: 0,
                column: 9,
                name: 'Посмертная маска',
                description: 'Получить 2 навыка и 2 меча. Снимите 1 проклятие',
                type: ClankCardType.basiс,
                events: {
                    onArrive: {
                        async callback(state, player, card) {
                            self.clankHelpService.changeMumiaPosition(state);
                            return true;
                        },
                    },
                    onAcquire: {
                        cost: {
                            skill: 4,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 2,
                            sword: 2,
                            curse: -1,
                        },
                    },
                    getPoints(state, player) {
                        return 1;
                    },
                },
                count: 2,
            },
            //#endregion 00

            //#region 10
            {
                row: 1,
                column: 0,
                name: 'Пророк конца света',
                description: 'Получите 2 меча. Если у вас есть хотя бы 1 Бдзынь на игровом поле, все противники получают 1 проклятие',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 3,
                        },
                    },
                    onUse: {
                        benefit: {
                            sword: 2,
                        },
                        async callback(state, player, card) {
                            if ((player.benefitInfo.clank ?? 0) === 0) {
                                return true;
                            }
                            state.players.filter(p => p.id !== player.id).forEach((p) => {
                                self.clankHelpService.updateBenefitInfo({
                                    player: p,
                                    benefit: {
                                        curse: 1,
                                    },
                                });
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
                row: 1,
                column: 1,
                name: 'Раскопки',
                description: '+2 Бдзынь и возьмите 2 карты',
                type: ClankCardType.basiс,
                events: {
                    onArrive: {
                        async callback(state, player, card) {
                            self.clankHelpService.changeMumiaPosition(state);
                            return true;
                        },
                    },
                    onAcquire: {
                        cost: {
                            skill: 3,
                        },
                    },
                    onUse: {
                        async callback(state, player, card) {
                            self.clankHelpService.addClank({
                                state,
                                player,
                                count: 2,
                            });
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
                row: 1,
                column: 2,
                name: 'Историк',
                description: 'Если у вас есть хотябы 1 Бдзынь на игровом поле, уничтожьте свою сыгранную карту или карту в сбросе',
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
                        },
                        async callback(state, player, card) {
                            if ((player.benefitInfo.clank ?? 0) > 0) {
                                player.needTrashCards.push(ClankCardName.All);
                            }
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
                row: 1,
                column: 3,
                name: 'Яшма',
                description: 'Возьмите 1 карту. При покупке получите 2 бдзынь и 1 проклятие',
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
                            return self.clankHelpService.updateBenefitInfo({
                                player,
                                benefit: {
                                    curse: 1,
                                },
                            });
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
                        return 7;
                    },
                },
                count: 2,
            },
            {
                row: 1,
                column: 4,
                name: 'Мяупатра',
                description: 'Выберите -2 Бдзынь или -1 проклятие',
                type: ClankCardType.companion,
                events: {
                    onArrive: {
                        async callback(state, player, card) {
                            self.clankHelpService.changeMumiaPosition(state);
                            return true;
                        },
                    },
                    onAcquire: {
                        cost: {
                            skill: 1,
                        },
                    },
                    onUse: {
                        async callback(state, player, card) {
                            return await self.openDialogChooseCardEvent({
                                count: 1,
                                list: [
                                    {
                                        description: '-2 Бдзынь',
                                        event() {
                                            self.clankHelpService.addClank({
                                                state,
                                                player,
                                                count: -2,
                                            });
                                            return true;
                                        },
                                    },
                                    {
                                        description: '-1 проклятие',
                                        event() {
                                            return self.clankHelpService.updateBenefitInfo({
                                                player,
                                                benefit: {
                                                    curse: -1,
                                                },
                                            });
                                        },
                                    },
                                ],
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
                row: 1,
                column: 5,
                name: 'Лазурит',
                description: 'Возьмите 1 карту. При покупке получите 2 бдзынь и 1 проклятие',
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
                            return self.clankHelpService.updateBenefitInfo({
                                player,
                                benefit: {
                                    curse: 1,
                                },
                            });
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
                column: 6,
                name: 'Охотники на мумий',
                description: 'Получите 2 меча и ботинок. Вы не получаете проклятий от мумии в этот',
                type: ClankCardType.companion,
                events: {
                    onArrive: {
                        async callback(state, player, card) {
                            self.clankHelpService.changeMumiaPosition(state);
                            return true;
                        },
                    },
                    onAcquire: {
                        cost: {
                            skill: 2,
                        },
                    },
                    onUse: {
                        benefit: {
                            sword: 2,
                            boot: 1,
                            ignore_curse: 1,
                        },
                    },
                    getPoints(state, player) {
                        return 1;
                    },
                },
                count: 1,
            },
            {
                row: 1,
                column: 7,
                name: 'Жажда наживы',
                description: 'Сбросте карту, чтобы получить 2 монеты',
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
                        },
                        async callback(state, player, card) {
                            const result = await self.clankHelpService.discard({
                                card,
                                player,
                                count: 1,
                            });
                            if (result.data == null) {
                                return result.success;
                            }
                            return self.clankHelpService.updateBenefitInfo({
                                player,
                                benefit: {
                                    coin: 2,
                                },
                            });
                        },
                    },
                },
                count: 2,
            },
            {
                row: 1,
                column: 8,
                name: 'Урашенный хопеш',
                description: 'Получите 3 меча и возьмете карту',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 6,
                        },
                        benefit: {
                            sword: 3,
                        },
                    },
                    onUse: {
                        benefit: {
                            sword: 3,
                        },
                        async callback(state, player, card) {
                            self.clankHelpService.drawCards({
                                state,
                                player,
                                count: 1,
                            });
                            return true;
                        },
                    },
                    getPoints(state, player) {
                        return 3;
                    },
                },
                count: 1,
            },
            {
                row: 1,
                column: 9,
                name: 'Очищение',
                description: 'Получите 3 навыка. Приносит 5 очков, если у вас меньше проклятий, чем у любого из противников',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 5,
                        },
                        benefit: {
                            curse: -1,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 3,
                        },
                    },
                    getPoints(state, player) {
                        const playerCurse = player.benefitInfo.curse ?? 0;
                        const isMinCurse = state.players.every(p => {
                            if (p.id === player.id) {
                                return true;
                            }
                            const otherPlayerCurse = p.benefitInfo.curse ?? 0;
                            return playerCurse < otherPlayerCurse;
                        });
                        return isMinCurse ? 5 : 0;
                    },
                },
                count: 1,
            },
            //#endregion 10

            //#region 20
            {
                row: 2,
                column: 0,
                name: 'Мятежник-взломщик',
                description: 'В конце хода уничтожте свою карту "Взломать сундук", сыгранную или лежащую в сбросе. Если у вас сыгран хотя бы 1 компаньон, возьмите 1 карту.',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 2,
                        },
                    },
                    onUse: {
                        async callback(state, player) {
                            player.needTrashCards.push(ClankCardName.Burgle);
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
                row: 2,
                column: 1,
                name: 'Мятежник-мистик',
                description: 'Телепортируйтесь в соседнюю комнату. Если у вас сыгран хотя бы 1 компаньон, возьмите 1 карту.',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 5,
                        },
                    },
                    onUse: {
                        benefit: {
                            teleport: 1,
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
                row: 2,
                column: 2,
                name: 'Телохранитель',
                description: 'Получите ботинок. Если у вас есть корона, в этот ход можете игрорировать символы на тунелях',
                type: ClankCardType.companion,
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
                        async callback(state, player, card) {
                            if (!self.clankHelpService.hasBenefit(player, ClankElementByMarket.crown)) {
                                return true;
                            }
                            return self.clankHelpService.updateBenefitInfo({
                                player,
                                benefit: {
                                    ignore_symbols_on_tunnel: 1,
                                },
                            });
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
                column: 3,
                name: 'Змеевик',
                description: 'Возьмите 1 карту. При покупке получите 2 бдзынь и 1 проклятие',
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
                            return self.clankHelpService.updateBenefitInfo({
                                player,
                                benefit: {
                                    curse: 1,
                                },
                            });
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
                        return 6;
                    },
                },
                count: 2,
            },
            {
                row: 2,
                column: 4,
                name: 'Посох Древних',
                description: 'Получите 2 монеты. Если у вас сыграна или лежит в сбросе хотябы 1 драгоценность, телепортируйтесь в соседнюю комнату',
                type: ClankCardType.basiс,
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
                        async callback(state, player, card) {
                            if (!player.benefitInfo.gem) {
                                return true;
                            }
                            return self.clankHelpService.updateBenefitInfo({
                                player,
                                benefit: {
                                    teleport: 1,
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
                column: 5,
                name: 'Искатель впечатлений',
                description: 'Получите навык и ботинок. Если у вас есть хотябы 1 бдзынь на игровом поле, то получите ещё 2 ботинка',
                type: ClankCardType.companion,
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
                        async callback(state, player, card) {
                            if ((player.benefitInfo.clank ?? 0) === 0) {
                                return true;
                            }
                            return self.clankHelpService.updateBenefitInfo({
                                player,
                                benefit: {
                                    boot: 2,
                                },
                            });
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
                column: 6,
                name: 'Грабительница могил',
                description: 'Получите меч и 2 ботинка. Если у вас есть артефакт, то получите 2 монетки',
                type: ClankCardType.companion,
                events: {
                    onArrive: {
                        async callback(state, player, card) {
                            self.clankHelpService.changeMumiaPosition(state);
                            return true;
                        },
                    },
                    onAcquire: {
                        cost: {
                            skill: 4,
                        },
                    },
                    onUse: {
                        benefit: {
                            sword: 1,
                            boot: 2,
                        },
                        async callback(state, player, card) {
                            if (!player.artifacts.length) {
                                return true;
                            }
                            return self.clankHelpService.updateBenefitInfo({
                                player,
                                benefit: {
                                    coin: 2,
                                },
                            });
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
                column: 7,
                name: 'Святой источник',
                description: 'Восстановите 1 очко здоровья и снимите 1 проклятие',
                type: ClankCardType.device,
                events: {
                    onArrive: {
                        isDragonAttack: true,
                    },
                    onAcquire: {
                        cost: {
                            skill: 3,
                        },
                        benefit: {
                            heal: 1,
                            curse: -1,
                        },
                    },
                },
                count: 2,
            },
            {
                row: 2,
                column: 8,
                name: 'Погребальные сосуды',
                description: 'Возьмите 4 карты и получите 1 проклятие',
                type: ClankCardType.device,
                events: {
                    onArrive: {
                        async callback(state, player, card) {
                            self.clankHelpService.changeMumiaPosition(state);
                            return true;
                        },
                    },
                    onAcquire: {
                        cost: {
                            skill: 4,
                        },
                        benefit: {
                            curse: 1,
                        },
                        async callback(state, player, card) {
                            self.clankHelpService.drawCards({
                                state,
                                player,
                                count: 4,
                            });
                            return true;
                        },
                    },
                },
                count: 1,
            },
            {
                row: 2,
                column: 9,
                name: 'Кольцо желаний',
                description: 'Трижды выберите: Получить 1 монетку -или- Получить 1 ботинка -или- Снять 1 проклятие',
                type: ClankCardType.device,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 5,
                        },
                        async callback(state, player, card) {
                            let count = 3;
                            let success = true;
                            while (count > 0 && success) {
                                success = await self.openDialogChooseCardEvent({
                                    subtitle: `(Ещё ${count} раз)`,
                                    count: 1,
                                    list: [
                                        {
                                            description: 'Получить 1 монетку',
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
                                            description: 'Получить 1 ботинка',
                                            event: () => {
                                                return self.clankHelpService.updateBenefitInfo({
                                                    player,
                                                    benefit: {
                                                        boot: 1,
                                                    },
                                                });
                                            },
                                        },
                                        {
                                            description: 'Снять 1 проклятие',
                                            event: () => {
                                                return self.clankHelpService.updateBenefitInfo({
                                                    player,
                                                    benefit: {
                                                        curse: -1,
                                                    },
                                                });
                                            },
                                        },
                                    ],
                                });
                                count--;
                            }
                            return success;
                        },
                    },
                },
                count: 1,
            },
            //#endregion 20

            //#region 30
            {
                row: 3,
                column: 1,
                name: 'Крокодилиан',
                description: 'При победе: -1 бдзынь, снимите 1 проклятие',
                type: ClankCardType.monster,
                events: {
                    onArrive: {
                        isDragonAttack: true,
                    },
                    onAcquire: {
                        cost: {
                            sword: 1,
                        },
                        async callback(state, player, card) {
                            self.clankHelpService.addClank({
                                state,
                                player,
                                count: -1,
                            });
                            return self.clankHelpService.updateBenefitInfo({
                                player,
                                benefit: {
                                    curse: -1,
                                },
                            });
                        },
                    },
                },
                count: 2,
            },
            //#endregion 30
        ];
        const reserveMumiaDeckConfig: ClankDeckConfig = {
            ...this.spriteInfo.clank_proklyatie_mumii,
            cards,
            position: ClankCardPositionEnum.dungeonDeck,
        };
        return this.mappingDeckCards(reserveMumiaDeckConfig, withCopy);
    }

    private initClankDeckCards(withCopy: boolean) {
        const self = this;
        const cards: ClankCardBaseConfig[] = [
            //#region 00
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
            //#endregion 00

            //#region 10
            {
                row: 1,
                column: 0,
                name: 'Археолог',
                description: 'Возьмите 1 карту. Если у вас есть обезьяна-идол, получите 2 очка навыка',
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
                            if (!self.clankHelpService.hasBenefit(player, ClankElementByToken.monkey_idol)) {
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
                description: 'Возьмите 1 карту. При покупке получите 2 бдзынь',
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
                            if (self.clankHelpService.hasBenefit(player, key)) {
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
            //#endregion 10

            //#region 20
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
            {
                row: 2,
                column: 4,
                name: 'Сборщик драгоценностей',
                description: 'Получите 2 очка навыка. Уберите 2 бдзынь. В этот ход драгоценности стоят на 2 меньше',
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
                type: ClankCardType.companion,
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
                        return 1;
                    },
                },
                count: 1,
            },
            //#endregion 20

            //#region 30
            {
                row: 3,
                column: 0,
                name: 'Робомакака 3000',
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
                        canCancel: false,
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
                            return await self.openDialogChooseCardEvent({
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
                                                state.reserveRow = state.reserveRow.filter(p => p.id !== tomCard.id);
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
                name: 'Жезл перемещения',
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
                            return await self.openDialogChooseCardEvent({
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
                },
                count: 2,
            },
            {
                row: 5,
                column: 9,
                name: 'Святилище',
                description: 'Получите одну монетку или восстановите 1 очко здоровья',
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
                onlyDepthsArea: true,
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
                name: 'Кобольд',
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

            //#region 70
            {
                row: 7,
                column: 0,
                name: 'Глазастик',
                description: 'При появлении: все игроки получают +1 Бдзынь. При победе: получите 3 монетки, все другие игроки получают +1 Бдзынь',
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
                            sword: 3,
                        },
                        benefit: {
                            coin: 3,
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
                count: 3,
            },
            {
                row: 7,
                column: 1,
                name: 'Танк или вор?',
                description: 'Получить 2 меча -ИЛИ- 2 ботинка',
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
                        },
                        async callback(state, player) {
                            return await self.openDialogChooseCardEvent({
                                count: 1,
                                list: [
                                    {
                                        description: 'Получить 2 меча',
                                        event: () => {
                                            return self.clankHelpService.updateBenefitInfo({
                                                player,
                                                benefit: {
                                                    sword: 2,
                                                },
                                            });
                                        },
                                    },
                                    {
                                        description: 'Получить 2 ботинка',
                                        event: () => {
                                            return self.clankHelpService.updateBenefitInfo({
                                                player,
                                                benefit: {
                                                    boot: 2,
                                                },
                                            });
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
                row: 7,
                column: 2,
                name: 'Ужастный волк',
                description: 'Получить 1 очко навыка и 1 ботинок. За каждого открытого монстра (включая гоблина) получите +1 Бдзынь и +1 меч',
                type: ClankCardType.companion,
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
                        async callback(state, player, card) {
                            const dungeonRowMonsters = state.dungeonRow.filter(p => p.type === ClankCardType.monster);
                            const reserveRowMonsters = state.reserveRow.filter(p => p.type === ClankCardType.monster);
                            const monstersCount = reserveRowMonsters.length + dungeonRowMonsters.length;
                            if (monstersCount === 0) {
                                return true;
                            }
                            const success = self.clankHelpService.updateBenefitInfo({
                                player,
                                benefit: {
                                    sword: monstersCount,
                                },
                            });
                            if (!success) {
                                return false;
                            }
                            self.clankHelpService.addClank({
                                state,
                                player,
                                count: monstersCount,
                            });
                            return true;
                        },
                    },
                    getPoints(state) {
                        return 1;
                    },
                },
                count: 1,
            },
            {
                row: 7,
                column: 3,
                name: 'Зачарованные кубики',
                description: 'Вытащите 2 кубика из мешка дракона. За каждый кубик дракона или вашего цвета получите 1 монетку. Затем верните кубики в мешок.',
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
                        async callback(state, player, card) {
                            const clankBag = state.dragonInfo.clankBag;
                            const coin = Array(2).fill(1).reduce((acc) => {
                                const colorId = clankBag[lodash.random(clankBag.length - 1)];
                                if (colorId === player.colorId || colorId === GamePlayerColorIdEnum.Black) {
                                    acc++;
                                }
                                return acc;
                            }, 0);
                            const success = self.clankHelpService.updateBenefitInfo({
                                player,
                                benefit: {
                                    coin,
                                },
                            });
                            if (!success) {
                                return false;
                            }
                            self.clankHelpService.addActionLogs({
                                state,
                                type: GameInfoActionLogType.Card,
                                data: {
                                    text: `${player.name} получил ${coin} монет | (Здоровье: ${player.benefitInfo.heal ?? 0})`,
                                    colorId: player.colorId,
                                },
                            });
                            return true;
                        },
                    },
                    getPoints(state) {
                        return 1;
                    },
                },
                count: 1,
            },
            {
                row: 7,
                column: 4,
                name: 'Лидер экспедиции',
                description: 'Получить 2 навыка, 1 меч и 1 ботинок. Каждый раз, когда в этот ход вы получаете золото, увеличьте его количество на 1',
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
                            sword: 1,
                            boot: 1,
                            additional_coin: 1,
                        },
                    },
                    getPoints(state) {
                        return 2;
                    },
                },
                count: 1,
            },
            {
                row: 7,
                column: 5,
                name: 'Дружелюбный зритель',
                description: 'Получите 3 монетки. Все соперники получают +1 Бдзынь!',
                type: ClankCardType.companion,
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
                            skill: 5,
                        },
                    },
                    onUse: {
                        benefit: {
                            coin: 3,
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
                    getPoints(state, player) {
                        return 1;
                    },
                },
                count: 1,
            },
            {
                row: 7,
                column: 6,
                name: 'Волшебные очки',
                description: 'Посмотрите верхную карту своей колоды и затем положите её либо на верх колоды, либо под низ. Возьмите 1 карту.',
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
                        },
                        async callback(state, player, card) {
                            await self.clankHelpService.showTopDeckCard(player);
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
                row: 7,
                column: 7,
                name: 'Сирена',
                description: 'Купите карту компаньона бесплатно',
                type: ClankCardType.companion,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 3,
                        },
                    },
                    onUse: {
                        async callback(state, player, card) {
                            const result = await self.clankHelpService.bayCardByType({
                                state,
                                player,
                                type: ClankCardType.companion,
                                count: 1,
                            });
                            return result.success;
                        },
                    },
                    getPoints(state, player) {
                        return 2;
                    },
                },
                count: 1,
            },
            {
                row: 7,
                column: 8,
                name: 'Жезл времени',
                description: 'Получить 2 навыка. Возьмите на руку карту из своей стопки сброса. Если ваша стопка сброса пустая, вместо этого возьмите две карты.',
                type: ClankCardType.basiс,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 6,
                        },
                    },
                    onUse: {
                        benefit: {
                            skill: 2,
                        },
                        async callback(state, player, card) {
                            if (player.discard.length > 0) {
                                const result = await self.clankHelpService.returnFromDiscard({
                                    player,
                                    count: 1,
                                });
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
                    getPoints(state, player) {
                        return 2;
                    },
                },
                count: 1,
            },
            {
                row: 7,
                column: 9,
                name: 'Стена желаний',
                description: 'Выберете два: уничтожить свою сыгранную карту или свою карту в сбросе -ИЛИ- получить 2 меча -ИЛИ- получить 2 ботинка -ИЛИ- восстановить 1 очко здоровья',
                type: ClankCardType.device,
                events: {
                    onAcquire: {
                        cost: {
                            skill: 6,
                        },
                        async callback(state, player, card) {
                            return await self.openDialogChooseCardEvent({
                                count: 2,
                                list: [
                                    {
                                        description: 'Уничтожить свою сыгранную карту или свою карту в сбросе',
                                        event: () => {
                                            player.needTrashCards.push(ClankCardName.All);
                                            return true;
                                        },
                                    },
                                    {
                                        description: 'Получить 2 меча',
                                        event: () => {
                                            return self.clankHelpService.updateBenefitInfo({
                                                player,
                                                benefit: {
                                                    sword: 2,
                                                },
                                            });
                                        },
                                    },
                                    {
                                        description: 'Получить 2 ботинка',
                                        event: () => {
                                            return self.clankHelpService.updateBenefitInfo({
                                                player,
                                                benefit: {
                                                    boot: 2,
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
                },
                count: 1,
            },
            //#endregion 70

        ];
        const shareDeckConfig: ClankDeckConfig = {
            ...this.spriteInfo.clank,
            cards,
            position: ClankCardPositionEnum.dungeonDeck,
        };
        return this.mappingDeckCards(shareDeckConfig, withCopy);
    }

    private async openDialogChooseCardEvent(data: ChooseCardEventComponentData) {
        const dialog = this.gameDialogsService.openChooseCardEventComponent(data);
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
                const find_string = card.uniq_find_string != null
                    ? card.uniq_find_string
                    : `${config.dlc_name}_${index}_${config.position}`;
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
