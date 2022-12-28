import {
    Injectable,
    OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';

import * as lodash from 'lodash';
import * as moment from 'moment';
import {
    UseCardInfoByType,
    UseCardType,
} from 'src/app/shared/models/cards/cards.types';
import { ClankOneTurnInfo } from 'src/app/shared/models/clank-element-types';
import { MomentDateFormat } from 'src/app/shared/models/game.types';
import { updateBenefitInfo } from 'src/app/shared/models/players/player.types';
import {
    UseTokenInfoByType,
    UseTokenType,
} from 'src/app/shared/models/tokens/token.types';
import { ArtifactsService } from 'src/app/shared/services/artifacts.service';
import { CardsService } from 'src/app/shared/services/cards.service';
import {
    GameSocket,
    SocketService,
} from 'src/app/shared/services/socket.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { TokensService } from 'src/app/shared/services/tokens.service';

import { arrayUpdate } from '@datorama/akita';
import { ClankArtifactConfig } from '@shared/clank/clank-artifact.types';
import { ClankCardConfig } from '@shared/clank/clank-card.types';
import { initDragonInfo } from '@shared/clank/clank-dragon.types';
import {
    GameInfoActionLogData,
    GameInfoState,
    GameInfoStatusIdEnum,
} from '@shared/clank/clank-game.types';
import {
    ClankCardType,
    ClankCostInfo,
    ClankDlcEnum,
    ClankElementTypeEnum,
} from '@shared/clank/clank-info.types';
import { ClankMapElementConfig } from '@shared/clank/clank-map.types';
import {
    ClankPlayerConfig,
    GamePlayerColorIdEnum,
    GamePlayerColorIds,
} from '@shared/clank/clank-player.types';
import {
    ClankTokenConfig,
    ClankTokenTypeEnum,
} from '@shared/clank/clank-token.types';
import { SocketErrorTypeEnum } from '@shared/socket.types';

import { TrashCardsComponentResult } from '../dialogs/trash-cards/trash-cards.component';
import { GameInfoQuery } from './game-info.query';
import { GameInfoStore } from './game-info.store';

@Injectable()
export class GameInfoService implements OnDestroy {

    private gameId: string | undefined;

    private socket: GameSocket | undefined;

    constructor(
        private artifactsService: ArtifactsService,
        private gameInfoQuery: GameInfoQuery,
        private gameInfoStore: GameInfoStore,
        private cardsService: CardsService,
        private socketService: SocketService,
        private toastService: ToastService,
        private tokensService: TokensService,
        private router: Router,
    ) { }

    ngOnDestroy() {
        this.socket?.disconnect();
    }

    connectToGame(gameId: string) {
        if (this.gameId === gameId) {
            return;
        }

        this.gameId = gameId;
        this.socket = this.socketService.getGameSocket(gameId);
        if (this.socket == null) {
            return;
        }

        this.socket.on('connect', () => {
            this.toastService.showSuccess('Успешное подключение к игре');
        });

        this.socket.on('disconnect', (reason) => {
            if (reason !== 'io client disconnect') {
                this.socket?.connect();
            } else {
                this.toastService.showWarn('Разрыв соединения');
            }
        });

        this.socket.on('gameUpdated', (state) => {
            this.gameInfoStore.update(state);
        });

        this.socket.on('error', (message, type) => {
            this.toastService.showError(message);
            if (type === SocketErrorTypeEnum.gameNotFound) {
                this.router.navigate(['/']);
            }
        });

        setTimeout(() => {
            if (this.socket?.disconnected) {
                this.socket.connect();
            }
        }, 500);
    }

    updatePlayer(id: string, player: Partial<ClankPlayerConfig>) {
        this.gameInfoStore.update(({players}) => ({
            players: arrayUpdate(players, id, player),
        }));
        this.onGameUpdated();
    }

    onMove({
        playerId,
        mapElement,
        benefitInfo,
    }: {
        playerId: string;
        mapElement: ClankMapElementConfig,
        benefitInfo: ClankCostInfo;
    }) {
        this.gameInfoStore.update((oldState) => {
            const state = lodash.cloneDeep(oldState);
            const player = state.players.find(p => p.id === playerId);
            if (player == null || mapElement == null) {
                return state;
            }
            this.setBenefits(player, benefitInfo, state);
            player.elementId = mapElement.id;
            const isFinish = mapElement.isStart ?? false;
            if (isFinish) {
                player.isFinish = true;
                player.isEscaped = true;
                player.benefitInfo.mastery_token = 1;
                player.tokens.push({
                    id: 'mastery_token',
                    copy_index: 0,
                    count: -1,
                    name: 'Жетон мастерства',
                    element_type: ClankElementTypeEnum.mastery_token,
                    url: '/assets/images/tokens/bonus/master.png',
                    points: {
                        value: 20,
                    },
                    isSquare: true,
                    dlc_name: ClankDlcEnum.clank,
                    index: 0,
                    type: ClankTokenTypeEnum.bonus,
                });
            }
            state.players = arrayUpdate(
                state.players,
                player.id,
                player,
            );
            this.addActionLogs(state, {
                text: `${player.name} переместился`,
                colorId: player.colorId,
                hideToast: true,
            });
            return state;
        });
        this.onGameUpdated();
    }

    useCard({
        playerId,
        card,
        benefitInfo,
        type,
    }: {
        playerId: string;
        card: ClankCardConfig;
        benefitInfo: ClankCostInfo;
        type: UseCardType;
    }) {
        this.gameInfoStore.update((oldState) => {
            const state = lodash.cloneDeep(oldState);
            const player = state.players.find(p => p.id === playerId);
            if (player == null || card == null) {
                return state;
            }
            this.addActionLogs(state, {
                text: `${player.name} ${UseCardInfoByType[type].text} ${card.name}`,
                colorId: player.colorId,
                hideToast: true,
            });
            this.setBenefits(player, benefitInfo, state);
            switch (type) {
                case UseCardType.use: {
                    player.hand = player.hand.filter(p => p.id !== card.id),
                    player.board.push(card);
                    player.benefitInfo[card.type] = (player.benefitInfo[card.type] ?? 0) + 1;
                    if (card.needTrashCards) {
                        player.needTrashCards = [
                            ...player.needTrashCards,
                            ...card.needTrashCards,
                        ];
                    }
                    break;
                }
                case UseCardType.buy: {
                    if (card.count > 0) {
                        state.dungeonRow = state.dungeonRow.filter(p => p.id !== card.id);
                        state.reserveRow = state.reserveRow.filter(p => p.id !== card.id);
                        if (![
                            ClankCardType.device,
                            ClankCardType.monster,
                        ].includes(card.type)) {
                            player.discard.push(card);
                        }
                    }
                }
            }
            state.players = arrayUpdate(
                state.players,
                player.id,
                player,
            );
            return state;
        });
        this.onGameUpdated();
    }

    takeArtifact(playerId: string, artifact: ClankArtifactConfig) {
        this.gameInfoStore.update((oldState) => {
            const state = lodash.cloneDeep(oldState);
            const player = state.players.find(p => p.id === playerId);
            if (player == null) {
                return state;
            }
            if (artifact.benefit != null) {
                const benefitInfo = updateBenefitInfo({
                    benefit: player.benefitInfo,
                    cost: artifact.benefit,
                    isBenefit: true,
                });
                this.setBenefits(player, benefitInfo, state);
            }
            state.artifacts = state.artifacts.filter(p => p.id !== artifact.id),
            state.players = arrayUpdate(state.players, player.id, {
                artifacts: [
                    ...player.artifacts,
                    artifact,
                ],
            });
            return state;
        });
        this.onGameUpdated();
    }

    useToken({
        playerId,
        tokenInfo,
        type,
    }: {
        playerId: string;
        tokenInfo: ClankTokenConfig;
        type: UseTokenType;
    }) {
        this.gameInfoStore.update((oldState) => {
            const state = lodash.cloneDeep(oldState);
            const player = state.players.find(p => p.id === playerId);
            if (player == null) {
                return state;
            }

            if (type === UseTokenType.take && tokenInfo.isImmediatelyBenefit) {
                type = UseTokenType.use;
            }

            if ([UseTokenType.buy, UseTokenType.use].includes(type)) {
                if (tokenInfo.cost != null) {
                    const benefitInfo = updateBenefitInfo({
                        benefit: player.benefitInfo,
                        cost: tokenInfo.cost,
                        isBenefit: false,
                    });
                    this.setBenefits(player, benefitInfo, state);
                }

                if (tokenInfo.benefit != null) {
                    const benefitInfo = updateBenefitInfo({
                        benefit: player.benefitInfo,
                        cost: tokenInfo.benefit,
                        isBenefit: true,
                    });
                    this.setBenefits(player, benefitInfo, state);
                }

                if (tokenInfo.needTrashCards) {
                    player.needTrashCards = [
                        ...player.needTrashCards,
                        ...tokenInfo.needTrashCards,
                    ];
                }
            }

            if ([UseTokenType.buy, UseTokenType.take].includes(type)) {
                player.tokens = [
                    ...player.tokens,
                    tokenInfo,
                ];
            } else {
                player.tokens = player.tokens.filter(p => p.id !== tokenInfo.id);
            }

            state.mapTokens = state.mapTokens.filter(p => p.id !== tokenInfo.id);
            state.marketTokens = state.marketTokens.filter(p => p.id !== tokenInfo.id);
            state.players = arrayUpdate(state.players, player.id, player);
            this.addActionLogs(state, {
                text: `${player.name} ${UseTokenInfoByType[type].text} ${tokenInfo.name}`,
                colorId: player.colorId,
            });
            return state;
        });
        this.onGameUpdated();
    }

    startGame() {
        this.gameInfoStore.update((oldState) => {
            const state = lodash.cloneDeep(oldState);
            state.statusId = GameInfoStatusIdEnum.Started;
            const playerCount = state.players.length;
            state.activePlayerIndex = Math.floor(Math.random() * playerCount);
            state.activePlayerId = state.players[state.activePlayerIndex].id;
            state.players = state.players.map(player => {
                const deck = this.cardsService.getStartDeckCards(
                    state.startDeckId,
                    player.id,
                );
                const config: ClankPlayerConfig = {
                    ...player,
                    elementId: 1,
                    benefitInfo: {
                        heal: 10,
                        coin: 0,
                    },
                    deck: this.shuffle(deck),
                    hand: [],
                    board: [],
                    discard: [],
                    trash: [],
                    tokens: [],
                    artifacts: [],
                    isRescued: false,
                    isEscaped: false,
                    isFinish: false,
                };
                this.clearTurnInfo(config.benefitInfo);
                this.drawCards(config, 5);
                return config;
            });
            const dragonTrackInfo = this.gameInfoQuery.mapInfo?.dragonInfo.track.find(p => p.startUserCount === playerCount);
            state.dragonInfo = initDragonInfo(dragonTrackInfo?.rage);
            const dungeonDeck = this.cardsService.getShareDecksCards(state.dungeonDeckIds);
            state.dungeonDeck = this.shuffle(dungeonDeck);
            state.dungeonRow = [];
            state.reserveRow = this.cardsService.getReserveDecksCards(
                state.mapDlcId,
                playerCount,
            );
            state.mapTokens = this.simpleShuffle(this.tokensService.getMapTokens());
            state.marketTokens = this.tokensService.getMarketTokens();
            state.artifacts = this.simpleShuffle(this.artifactsService.getArtifacts());
            state.turnIndex = 0;
            this.addActionLogs(state, {
                text: 'Игра началась',
            });
            this.drawDungeonRow(state, {
                initDungeonRow: true,
                hideToast: true,
            });
            return state;
        });
        this.onGameUpdated();
    }

    finishTurn(result: TrashCardsComponentResult) {
        this.gameInfoStore.update((oldState) => {
            const state = lodash.cloneDeep(oldState);

            /** Конец хода игрока */
            const currentPlayer = state.players[state.activePlayerIndex];
            this.clearTurnInfo(currentPlayer.benefitInfo);
            currentPlayer.discard = result.discard;
            currentPlayer.board = [];
            currentPlayer.hand = [];
            currentPlayer.trash = [
                ...currentPlayer.trash,
                ...result.trash,
            ];
            currentPlayer.needTrashCards = [];
            this.drawCards(currentPlayer, 5);
            state.players = arrayUpdate(state.players, currentPlayer.id, currentPlayer);

            if (currentPlayer.isFinish && state.dragonInfo.endGameCounter.colorId === GamePlayerColorIdEnum.Black) {
                state.dragonInfo.endGameCounter.colorId = currentPlayer.colorId;
            }

            /** Обновление состояния карты */
            GamePlayerColorIds.forEach(colorId => {
                if (state.dragonInfo.clankAria[colorId] < 0) {
                    state.dragonInfo.clankAria[colorId] = 0;
                }
            });
            this.drawDungeonRow(state, {});

            /** Переход хода */
            const newActivPlayer = this.getNextPlayer(state);
            this.addActionLogs(state, {
                text: `${currentPlayer.name} закончил свой ход`,
                colorId: currentPlayer.colorId,
                hideToast: newActivPlayer != null,
            });
            if (newActivPlayer != null) {
                this.addActionLogs(state, {
                    text: `Ход переходит к игроку ${newActivPlayer.name}`,
                    colorId: newActivPlayer.colorId,
                });
            }
            state.turnIndex++;
            state.statusId = state.players.every(p => p.isFinish)
                ? GameInfoStatusIdEnum.Finished
                : state.statusId;
            return state;
        });
        this.onGameUpdated();
    }

    private getNextPlayer(state: GameInfoState): ClankPlayerConfig | null {
        state.activePlayerIndex = state.activePlayerIndex < state.players.length - 1
            ? state.activePlayerIndex + 1
            : 0;
        const newActivPlayer = state.players[state.activePlayerIndex];
        state.activePlayerId = newActivPlayer.id;
        if (!newActivPlayer.isFinish) {
            return newActivPlayer;
        }
        if (newActivPlayer.isFinish && state.dragonInfo.endGameCounter.colorId === newActivPlayer.colorId) {
            state.dragonInfo.endGameCounter.index++;
            const trackElement = this.gameInfoQuery.mapInfo?.dragonInfo.endGameTrack.find(p =>
                p.index === state.dragonInfo.endGameCounter.index);
            if (trackElement?.isFinish) {
                for (const player of state.players) {
                    if (!player.isFinish) {
                        this.onPlayerFinishGame(player);
                        state.players = arrayUpdate(state.players, player.id, player);
                    }
                }
            } else if (trackElement?.clank) {
                this.onDragonAttack(state, trackElement.clank);
            }
        }
        if (state.players.some(p => !p.isFinish)) {
            return this.getNextPlayer(state);
        } else {
            return null;
        }
    }

    finishGame() {
        this.gameInfoStore.update((state) => ({
            statusId: GameInfoStatusIdEnum.Finished,
        }));
        this.onGameUpdated();
    }

    private onGameUpdated() {
        this.socket?.emit('updateGame', this.gameInfoQuery.getValue());
    }

    private simpleShuffle<T = any>(list: T[]) {
        return list.sort(() => Math.random() - 0.5);
    }

    private shuffle(deck: ClankCardConfig[]) {
        return this.simpleShuffle(deck).map((card, index) => {
            const newState: ClankCardConfig = {
                ...card,
                index,
            };
            return newState;
        });
    }

    private drawDungeonRow(
        state: GameInfoState,
        options?: {
            ignoreDragonAttack?: boolean;
            initDungeonRow?: boolean;
            hideToast?: boolean;
        },
    ): void {
        if (state.dungeonRow == null || state.dungeonDeck == null) {
            return;
        }
        let isDragonAttack = false;
        const skippedCards: ClankCardConfig[] = [];
        while (state.dungeonRow.length < 6 && state.dungeonDeck.length > 0) {
            const card = state.dungeonDeck.pop();
            if (!card) {
                break;
            }
            if (card.arrive?.isDragonAttack && options?.initDungeonRow) {
                skippedCards.push(card);
            } else {
                if (card.arrive?.isDragonAttack && !options?.ignoreDragonAttack) {
                    isDragonAttack = true;
                }
                // TODO: применить свойства из поля arrive
                state.dungeonRow.push(card);
                this.addActionLogs(state, {
                    text: `Карта ${card.name} появилась в подземном ряду`,
                    hideToast: options?.hideToast,
                });
            }
        }
        state.dungeonDeck = this.shuffle([
            ...state.dungeonDeck,
            ...skippedCards,
        ]);

        if (isDragonAttack) {
            this.onDragonAttack(state);
        }
        return;
    }

    private onDragonAttack(state: GameInfoState, rage = 0) {
        (Object.keys(state.dragonInfo.clankAria) as GamePlayerColorIdEnum[]).forEach((key) => {
            const count = state.dragonInfo.clankAria[key];
            if (count > 0) {
                state.dragonInfo.clankBag = [
                    ...state.dragonInfo.clankBag,
                    ...Array(count).fill(key),
                ];
            }
            state.dragonInfo.clankAria[key] = 0;
        });
        state.dragonInfo.clankBag = this.simpleShuffle(state.dragonInfo.clankBag);
        const attackResult = state.players.reduce((acc, player) => {
            acc[player.colorId] = {
                name: player.name,
                value: 0,
            };
            return acc;
        }, {} as Record<GamePlayerColorIdEnum, {
            name: string;
            value: number;
        }>);
        const totalRage = state.dragonInfo.rage + rage;
        for (let index = 0; index < totalRage; index++) {
            const colorId = state.dragonInfo.clankBag.pop();
            const player = state.players.find(p => p.colorId === colorId);
            if (colorId == null || player == null || player.benefitInfo.heal == null || player.isFinish) {
                continue;
            }
            player.benefitInfo.heal--;
            attackResult[colorId].value++;
            this.setBenefits(player, player.benefitInfo, state);
            state.players = arrayUpdate(state.players, player.id, player);
        }
        this.addActionLogs(state, {
            text: `Дракон атакует`,
            subtext: Object.values(attackResult).map(p => `${p.name}: ${p.value} урона`).join('\r\n'),
            isDragon: true,
        });
    }

    private drawCards(player: ClankPlayerConfig, count: number) {
        while (count > 0) {
            if (player.deck.length === 0) {
                player.deck = this.shuffle(player.discard);
                player.discard = [];
            }
            const card = player.deck.pop();
            if (card != null) {
                player.hand.push(card);
            }
            count--;
        }
    }

    private setBenefits(
        player: ClankPlayerConfig,
        benefitInfo: ClankCostInfo,
        state: GameInfoState,
    ) {
        if ((benefitInfo.boot ?? 0) > 0 && (benefitInfo.enter_crystal_cave ?? 0) > 0 && (benefitInfo.ignore_crystal_cave ?? 0) === 0) {
            benefitInfo.boot = 0;
        }

        if (benefitInfo.heal) {
            if (benefitInfo.heal > 10) {
                benefitInfo.heal = 10;
            }
            if (benefitInfo.heal <= 0) {
                benefitInfo.heal = 0;
                this.onPlayerFinishGame(player);
            }
        }

        if (benefitInfo.card && benefitInfo.card > 0) {
            this.drawCards(player, benefitInfo.card);
            this.addActionLogs(state, {
                text: `${player.name} добрал карты (${benefitInfo.card})`,
                colorId: player.colorId,
            });
            delete benefitInfo.card;
        }

        if (benefitInfo.pyramid_dice) {
            // TODO: бросить кубик
            delete benefitInfo.pyramid_dice;
            this.addActionLogs(state, {
                text: `${player.name} бросает кубик`,
                colorId: player.colorId,
            });
        }

        if (benefitInfo.dragon_rage && state.dragonInfo.rage < (this.gameInfoQuery.mapInfo?.dragonInfo.maxRage ?? 0)) {
            state.dragonInfo.rage++;
            delete benefitInfo.dragon_rage;
            this.addActionLogs(state, {
                text: `Повышается ярость дракона`,
            });
        }

        if (benefitInfo.dragon_attack) {
            this.onDragonAttack(state);
            delete benefitInfo.dragon_attack;
        }

        if (benefitInfo.clank) {
            state.dragonInfo.clankAria[player.colorId] += benefitInfo.clank;
            const text = benefitInfo.clank > 0
                ? 'добавил шума'
                : 'убрал шум';
            this.addActionLogs(state, {
                text: `${player.name} ${text} (${benefitInfo.clank} бдзынь)`,
                colorId: player.colorId,
            });
            delete benefitInfo.clank;
        }

        // TODO: реакция на другие
        player.benefitInfo = benefitInfo;
    }

    private addActionLogs(state: GameInfoState, data: GameInfoActionLogData) {
        const momentTime = moment();
        state.actionLogs.push({
            index: state.actionLogs.length,
            turnIndex: state.turnIndex,
            createdAt: momentTime.format(MomentDateFormat),
            data,
        });
    }

    private clearTurnInfo(benefitInfo: ClankCostInfo) {
        ClankOneTurnInfo.forEach(key => {
            benefitInfo[key] = 0;
        });
    }

    private onPlayerFinishGame(player: ClankPlayerConfig,) {
        const mapElement = this.gameInfoQuery.mapInfo?.elements.find(p => p.id === player.elementId);
        player.isRescued = !mapElement?.isDungeon;
        player.isEscaped = false;
        player.isFinish = true;
    }

}
