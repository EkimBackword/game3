import {
    Injectable,
    OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';

import * as lodash from 'lodash';
import {
    BehaviorSubject,
    Subject,
} from 'rxjs';
import { CardsService } from 'src/app/game/clank/services/cards.service';
import { SessionQuery } from 'src/app/session/session.query';
import { ClankOneTurnInfo } from 'src/app/shared/models/clank-element-types';
import { UseTokenType } from 'src/app/shared/models/tokens/token.types';
import { ArtifactsService } from 'src/app/shared/services/artifacts.service';
import {
    GameSocket,
    SocketService,
} from 'src/app/shared/services/socket.service';
import { SoundService } from 'src/app/shared/services/sound.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { TokensService } from 'src/app/shared/services/tokens.service';

import { arrayUpdate } from '@datorama/akita';
import { ClankArtifactConfig } from '@shared/clank/clank-artifact.types';
import {
    ClankCardBaseConfigEvents,
    ClankCardConfig,
} from '@shared/clank/clank-card.types';
import { initDragonInfo } from '@shared/clank/clank-dragon.types';
import {
    GameInfoActionLogType,
    GameInfoState,
    GameInfoStatusIdEnum,
} from '@shared/clank/clank-game.types';
import { ClankCostInfo } from '@shared/clank/clank-info.types';
import {
    ClankMapConfig,
    ClankMapElementConfig,
} from '@shared/clank/clank-map.types';
import {
    ClankPlayerConfig,
    GamePlayerColorIdEnum,
} from '@shared/clank/clank-player.types';
import { ClankTokenConfig } from '@shared/clank/clank-token.types';
import { SocketErrorTypeEnum } from '@shared/socket.types';
import { ToastSeverityEnum } from '@shared/toast.types';

import { TrashCardsComponentResult } from '../dialogs/trash-cards/trash-cards.component';
import { ClankHelpService } from './clank-help.service';
import { GameInfoQuery } from './game-info.query';
import { GameInfoStore } from './game-info.store';

@Injectable()
export class GameInfoService implements OnDestroy {

    useManualFunctionSubject = new Subject();
    isMapElementIdShowSubject = new BehaviorSubject(false);

    private gameId: string | undefined;

    private socket: GameSocket | undefined;

    constructor(
        private artifactsService: ArtifactsService,
        private gameInfoQuery: GameInfoQuery,
        private gameInfoStore: GameInfoStore,
        private cardsService: CardsService,
        private clankHelpService: ClankHelpService,
        private socketService: SocketService,
        private toastService: ToastService,
        private tokensService: TokensService,
        private soundService: SoundService,
        private sessionQuery: SessionQuery,
        private router: Router,
    ) {
    }

    ngOnDestroy() {
        delete window['getGameState'];
        delete window['setGameState'];
        delete window['showMapElementId'];
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

        this.socket.on('userKicked', (userId) => {
            if (userId !== this.sessionQuery.id) {
                return;
            }
            this.router.navigate(['/']);
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

        window['getGameState'] = () => {
            return lodash.cloneDeep(this.gameInfoQuery.getValue());
        };
        window['setGameState'] = (state: GameInfoState) => {
            this.clankHelpService.addActionLogs({
                state,
                type: GameInfoActionLogType.ManualFunction,
                data: {
                    text: `Игрок ${this.gameInfoQuery.currentPlayer?.name} вручную изменил состояние игры`,
                    severity: ToastSeverityEnum.warning,
                },
            });
            this.gameInfoStore.update(state);
            this.updateSocketState({ canCancel: true });
            this.useManualFunctionSubject.next();
        };
        window['showMapElementId'] = (value: boolean) => {
            this.isMapElementIdShowSubject.next(value);
            this.useManualFunctionSubject.next();
        };
    }

    kickUser(userId: string) {
        this.socket?.emit('kickUser', userId);
    }

    changeMap(mapInfo: ClankMapConfig) {
        this.gameInfoStore.update(() => ({
            mapId: mapInfo.id,
            mapDlcId: mapInfo.dlc_id,
        }));
        this.updateSocketState({ canCancel: false });
    }

    updatePlayer(id: string, player: Partial<ClankPlayerConfig>) {
        this.gameInfoStore.update(({players}) => ({
            players: arrayUpdate(players, id, player),
        }));
        this.updateSocketState({ canCancel: false });
    }

    onMove({
        playerId,
        mapElement,
        benefitInfo,
        skipSocketUpdate,
    }: {
        playerId: string;
        mapElement: ClankMapElementConfig,
        benefitInfo: ClankCostInfo;
        skipSocketUpdate: boolean;
    }) {
        this.gameInfoStore.update((oldState) => {
            const state = lodash.cloneDeep(oldState);
            const player = state.players.find(p => p.id === playerId);
            if (player == null || mapElement == null) {
                return state;
            }
            player.benefitInfo = benefitInfo;
            this.clankHelpService.checkBenefit(player);
            player.elementId = mapElement.id;
            const isStart = mapElement.isStart ?? false;
            if (isStart) {
                player.isFinish = true;
                player.isEscaped = true;
                player.benefitInfo.mastery_token = 1;
            }
            state.players = arrayUpdate(
                state.players,
                player.id,
                player,
            );
            this.clankHelpService.addActionLogs({
                state,
                type: GameInfoActionLogType.Move,
                data: {
                    text: `${player.name} переместился`,
                    colorId: player.colorId,
                    hideToast: true,
                },
            });
            this.soundService.play('/assets/sounds/Move.mp3');
            return state;
        });
        if (skipSocketUpdate) {
            return;
        }
        this.updateSocketState({ canCancel: true });
    }

    async useCard(
        card: ClankCardConfig,
        eventName: keyof ClankCardBaseConfigEvents,
    ) {
        const newState = await this.cardsService.onEvent({
            state: this.gameInfoQuery.getValue(),
            card,
            eventName,
        });
        if (newState == null) {
            return;
        }
        const canCancel = card?.events?.[eventName]?.canCancel ?? true;
        this.gameInfoStore.update(newState);
        this.updateSocketState({ canCancel });
    }

    takeArtifact({
        playerId,
        artifact,
        skipSocketUpdate = false,
    }: {
        playerId: string;
        artifact: ClankArtifactConfig;
        skipSocketUpdate?: boolean;
    }) {
        this.gameInfoStore.update((oldState) => {
            const state = lodash.cloneDeep(oldState);
            const player = state.players.find(p => p.id === playerId);
            if (player == null) {
                return state;
            }
            this.clankHelpService.increaseDragonRage(state);
            state.artifacts = state.artifacts.filter(p => p.id !== artifact.id),
            state.players = arrayUpdate(state.players, player.id, {
                artifacts: [
                    ...player.artifacts,
                    artifact,
                ],
            });
            return state;
        });
        if (skipSocketUpdate) {
            return;
        }
        this.updateSocketState({ canCancel: false });
    }

    async useToken({
        playerId,
        tokenInfo,
        type,
        skipSocketUpdate = false,
    }: {
        playerId: string;
        tokenInfo: ClankTokenConfig;
        type: UseTokenType;
        skipSocketUpdate?: boolean;
    }) {
        const state = lodash.cloneDeep(this.gameInfoQuery.getValue());
        const player = state.players.find(p => p.id === playerId);
        if (player == null) {
            return;
        }
        const success = await this.clankHelpService.takeToken(
            state,
            player,
            tokenInfo,
            type,
        );
        if (!success) {
            return;
        }
        this.gameInfoStore.update(state);
        if (skipSocketUpdate) {
            return;
        }
        this.updateSocketState({ canCancel: false });
    }

    async resetGame() {
        this.gameInfoStore.update((state) => {
            return {
                statusId: GameInfoStatusIdEnum.Created,
                activePlayerIndex: 0,
                activePlayerId: '',
                players: state.players.map(p => {
                    return {
                        ...p,
                        benefitInfo: {
                            heal: 10,
                            coin: 0,
                        },
                        deck: [],
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
                }),
                actionLogs: [],
            };
        });
        this.updateSocketState({ canCancel: false });
    }

    async startGame() {
        let subtext = '';
        const mapInfo = this.gameInfoQuery.mapInfo;
        const state = lodash.cloneDeep(this.gameInfoQuery.getValue());
        state.statusId = GameInfoStatusIdEnum.Started;
        const playerCount = state.players.length;
        state.activePlayerIndex = lodash.random(0, playerCount - 1);
        const activePlayer = state.players[state.activePlayerIndex];
        subtext += `Первым ход будет делать ${activePlayer.name}\r\n`;
        state.activePlayerId = activePlayer.id;
        const startElement = mapInfo?.elements.find(p => p.isStart);
        state.players = state.players.map(player => {
            const deck = this.cardsService.getStartDeckCards(
                state.mapDlcId,
                player.id,
            );
            const config: ClankPlayerConfig = {
                ...player,
                elementId: startElement?.id ?? 1,
                benefitInfo: {
                    heal: 10,
                    coin: 0,
                },
                deck: this.clankHelpService.shuffle(deck),
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
            this.clankHelpService.drawCards({
                player: config,
                count: 5,
            });
            return config;
        });
        const dragonTrackInfo = mapInfo?.dragonInfo.track.find(p => p.startUserCount === playerCount);
        state.dragonInfo = initDragonInfo(dragonTrackInfo?.rage, playerCount);
        state.players.forEach((player, index) => {
            const clankIndex = index < state.activePlayerIndex
                ? index + state.players.length
                : index;
            const clankCount = 3 - (clankIndex - state.activePlayerIndex);
            subtext += `${player.name}: ${clankCount} бдзынь\r\n`;
            state.dragonInfo.clankAria[player.colorId] = clankCount;
        });
        const dungeonDeck = this.cardsService.getShareDecksCards(state.mapDlcId);
        state.dungeonDeck = this.clankHelpService.shuffle(dungeonDeck);
        state.dungeonRow = [];
        state.reserveRow = this.cardsService.getReserveDecksCards(
            state.mapDlcId,
            playerCount,
        );
        state.mapTokens = this.clankHelpService.simpleShuffle(this.tokensService.getMapTokens(playerCount));
        state.marketTokens = this.tokensService.getMarketTokens(playerCount);
        state.artifacts = this.clankHelpService.simpleShuffle(this.artifactsService.getArtifacts(playerCount));
        state.turnIndex = 0;
        this.clankHelpService.addActionLogs({
            state,
            type: GameInfoActionLogType.Game,
            data: {
                text: 'Игра началась',
                subtext,
            },
        });
        const newState = await this.drawDungeonRow(state, {
            initDungeonRow: true,
            hideToast: true,
        });
        this.gameInfoStore.update(newState);
        this.updateSocketState({ canCancel: false });
    }

    async finishTurn(result: TrashCardsComponentResult) {
        let state = lodash.cloneDeep(this.gameInfoQuery.getValue());

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
        this.clankHelpService.drawCards({
            player: currentPlayer,
            count: 5,
        });
        state.players = arrayUpdate(state.players, currentPlayer.id, currentPlayer);

        if (currentPlayer.isFinish && state.dragonInfo.endGameCounter.colorId === GamePlayerColorIdEnum.Black) {
            state.dragonInfo.endGameCounter.colorId = currentPlayer.colorId;
        }

        /** Обновление состояния карты */
        this.clankHelpService.checkClankAria(state);
        state = await this.drawDungeonRow(state, {});

        /** Переход хода */
        const newActivPlayer = this.getNextPlayer(state);
        this.clankHelpService.addActionLogs({
            state,
            type: GameInfoActionLogType.Turn,
            data: {
                text: `${currentPlayer.name} закончил свой ход`,
                colorId: currentPlayer.colorId,
                hideToast: newActivPlayer != null,
            },
        });
        if (newActivPlayer != null) {
            this.clankHelpService.addActionLogs({
                state,
                type: GameInfoActionLogType.Turn,
                data: {
                    text: `Ход переходит к игроку ${newActivPlayer.name}`,
                    colorId: newActivPlayer.colorId,
                    soundUrl: '/assets/sounds/StartTurn.mp3',
                },
            });
        }
        state.turnIndex++;
        state.statusId = state.players.every(p => p.isFinish)
            ? GameInfoStatusIdEnum.Finished
            : state.statusId;
        this.gameInfoStore.update(state);
        this.updateSocketState({ canCancel: false });
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
        if (state.dragonInfo.endGameCounter.colorId === GamePlayerColorIdEnum.Black) {
            state.dragonInfo.endGameCounter.colorId = newActivPlayer.colorId;
        }
        if (state.dragonInfo.endGameCounter.colorId === newActivPlayer.colorId) {
            state.dragonInfo.endGameCounter.index++;
            const trackElement = this.gameInfoQuery.mapInfo?.dragonInfo.endGameTrack.find(p =>
                p.index === state.dragonInfo.endGameCounter.index);
            if (trackElement?.isFinish) {
                for (const player of state.players) {
                    if (!player.isFinish) {
                        this.clankHelpService.onPlayerFinishGame(player);
                        state.players = arrayUpdate(state.players, player.id, player);
                    }
                }
            } else if (trackElement?.clank) {
                this.clankHelpService.onDragonAttack(state, trackElement.clank);
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
        this.updateSocketState({ canCancel: false });
    }

    cancelState() {
        const state = this.gameInfoQuery.getValue();
        if (!state.canCancel) {
            this.toastService.showWarn('Последнее действие нельзя отменить');
            return;
        }
        this.socket?.emit('cancelState', state);
    }

    updateSocketState({ canCancel }: { canCancel: boolean; }) {
        const state = lodash.cloneDeep(this.gameInfoQuery.getValue());
        state.canCancel = canCancel;
        for (const player of state.players) {
            this.clankHelpService.checkBenefit(player);
            if (player.isFinish && state.dragonInfo.endGameCounter.colorId === GamePlayerColorIdEnum.Black) {
                state.dragonInfo.endGameCounter.colorId = player.colorId;
            }
        }
        const hasActivePlayers = state.players.some(p => !p.isFinish);
        const activePlayer = state.players[state.activePlayerIndex];
        if (activePlayer.isFinish && !activePlayer.isEscaped) {
            if (hasActivePlayers) {
                this.finishTurn({
                    discard: [
                        ...activePlayer.discard,
                        ...activePlayer.board,
                        ...activePlayer.hand,
                    ],
                    trash: [],
                });
                return;
            } else {
                state.statusId = GameInfoStatusIdEnum.Finished;
                this.clankHelpService.addActionLogs({
                    state,
                    type: GameInfoActionLogType.Game,
                    data: {
                        text: 'Игра закончилась',
                        soundUrl: '/assets/sounds/FinishGame.mp3',
                    },
                });
            }
        }
        this.gameInfoStore.update(state);
        this.socket?.emit('updateGame', state);
    }

    private async drawDungeonRow(
        state: GameInfoState,
        options?: {
            ignoreDragonAttack?: boolean;
            initDungeonRow?: boolean;
            hideToast?: boolean;
        },
    ): Promise<GameInfoState> {
        if (state.dungeonRow == null || state.dungeonDeck == null) {
            return state;
        }
        let isDragonAttack = false;
        const skippedCards: ClankCardConfig[] = [];
        while (state.dungeonRow.length < 6 && state.dungeonDeck.length > 0) {
            const card = state.dungeonDeck.pop();
            if (!card) {
                break;
            }
            if (options?.initDungeonRow) {
                if (card.events?.onArrive?.isDragonAttack) {
                    skippedCards.push(card);
                } else {
                    state.dungeonRow.push(card);
                }
            } else {
                if (card.events?.onArrive?.isDragonAttack && !options?.ignoreDragonAttack) {
                    isDragonAttack = true;
                }

                const newState = await this.cardsService.onEvent({
                    state,
                    card,
                    eventName: 'onArrive',
                });
                if (newState != null) {
                    state = newState;
                } else {
                    skippedCards.push(card);
                }
            }
        }
        state.dungeonDeck = this.clankHelpService.shuffle([
            ...state.dungeonDeck,
            ...skippedCards,
        ]);

        if (isDragonAttack) {
            this.clankHelpService.onDragonAttack(state);
        }
        return state;
    }

    private clearTurnInfo(benefitInfo: ClankCostInfo) {
        ClankOneTurnInfo.forEach(key => {
            benefitInfo[key] = 0;
        });
    }

}
