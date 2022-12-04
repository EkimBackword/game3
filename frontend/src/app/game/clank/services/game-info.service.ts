import {
    Injectable,
    OnDestroy,
} from '@angular/core';

import * as lodash from 'lodash';
import * as moment from 'moment';
import {
    UseCardInfoByType,
    UseCardType,
} from 'src/app/shared/models/cards/cards.types';
import { MomentDateFormat } from 'src/app/shared/models/game.types';
import { updateBenefitInfo } from 'src/app/shared/models/players/player.types';
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
import { ClankCardState } from '@shared/clank/clank-card.types';
import { initDragonInfo } from '@shared/clank/clank-dragon.types';
import {
    GameInfoActionLogData,
    GameInfoState,
    GameInfoStatusIdEnum,
} from '@shared/clank/clank-game.types';
import {
    ClankCardType,
    ClankCostInfo,
} from '@shared/clank/clank-info.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';
import { ClankTokenState } from '@shared/clank/clank-token.types';
import { SocketErrorTypeEnum } from '@shared/socket.types';

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
            this.toastService.showWarn('Разрыв соединения');
            if (reason !== 'io client disconnect') {
                this.socket?.connect();
            }
        });

        this.socket.on('gameUpdated', (state) => {
            this.gameInfoStore.update(state);
        });

        this.socket.on('error', (message, type) => {
            this.toastService.showError(message);
            if (type === SocketErrorTypeEnum.gameNotFound) {
                // TODO: перенести на главную странницу
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

    useCard({
        playerId,
        cardState,
        benefitInfo,
        type,
    }: {
        playerId: string;
        cardState: ClankCardState;
        benefitInfo: ClankCostInfo;
        type: UseCardType;
    }) {
        this.gameInfoStore.update((oldState) => {
            const state = lodash.cloneDeep(oldState);
            const player = state.players.find(p => p.id === playerId);
            if (player == null) {
                return state;
            }
            this.addActionLogs(state, {
                text: `${player.name} ${UseCardInfoByType[type].text} ${cardState.name}`,
                colorId: player.colorId,
            });
            this.setBenefits(player, benefitInfo, state);
            switch (type) {
                case UseCardType.use: {
                    player.hand = player.hand.filter(p => p.id !== cardState.id),
                    player.board.push(cardState);
                    break;
                }
                case UseCardType.buy: {
                    state.dungeonRow = state.dungeonRow.filter(p => p.id !== cardState.id);
                    state.reserveRow = state.reserveRow.filter(p => p.id !== cardState.id);
                    const card = this.cardsService.getCardInfo(cardState);
                    if (card != null && ![
                        ClankCardType.device,
                        ClankCardType.monster,
                    ].includes(card.type)) {
                        player.discard.push(cardState);
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
            const result: Partial<GameInfoState> = {
                artifacts: state.artifacts.filter(p => p.id !== artifact.id),
                players: arrayUpdate(state.players, player.id, {
                    artifacts: [
                        ...player.artifacts,
                        artifact,
                    ],
                }),
            };
            return result;
        });
        this.onGameUpdated();
    }

    takeToken(playerId: string, tokenState: ClankTokenState) {
        const tokenInfo = this.tokensService.getTokenInfo(tokenState);
        if (tokenInfo == null) {
            return;
        }
        if (tokenInfo.isImmediatelyBenefit) {
            this.useToken(playerId, tokenState);
            return;
        }
        this.gameInfoStore.update((oldState) => {
            const state = lodash.cloneDeep(oldState);
            const player = state.players.find(p => p.id === playerId);
            if (player == null) {
                return state;
            }
            state.tokens = state.tokens.filter(p => p.id !== tokenState.id),
            state.players = arrayUpdate(state.players, player.id, {
                tokens: [
                    ...player.tokens,
                    tokenState,
                ],
            });
            return state;
        });
        this.onGameUpdated();
    }

    useToken(playerId: string, tokenState: ClankTokenState) {
        const tokenInfo = this.tokensService.getTokenInfo(tokenState);
        if (tokenInfo == null) {
            return;
        }
        this.gameInfoStore.update((oldState) => {
            const state = lodash.cloneDeep(oldState);
            const player = state.players.find(p => p.id === playerId);
            if (player == null) {
                return state;
            }

            player.tokens = player.tokens.filter(p => p.id !== tokenState.id);
            if (tokenInfo.benefit != null) {
                const benefitInfo = updateBenefitInfo({
                    benefit: player.benefitInfo,
                    cost: tokenInfo.benefit,
                    isBenefit: true,
                });
                this.setBenefits(player, benefitInfo, state);
            }
            state.tokens = state.tokens.filter(p => p.id !== tokenState.id);
            state.players = arrayUpdate(state.players, player.id, player),
            this.toastService.showInfo(`Игрок ${player.name} использует ${tokenInfo.name}`);
            return state;
        });
        this.onGameUpdated();
    }

    startGame() {
        this.gameInfoStore.update((oldState) => {
            const state = lodash.cloneDeep(oldState);
            state.statusId = GameInfoStatusIdEnum.Started;
            state.activePlayerIndex = Math.floor(Math.random() * state.players.length);
            state.activePlayerId = state.players[state.activePlayerIndex].id;
            state.players = state.players.map(player => {
                const deck = this.cardsService.getStartDeckCards(
                    state.startDeckId,
                    player.id,
                );
                const config: ClankPlayerConfig = {
                    ...player,
                    deck: this.shuffle(deck),
                    benefitInfo: {
                        sword: 0,
                        boot: 0,
                        skill: 0,
                        clank: 0,
                        heal: 10,
                        coin: 0,
                    },
                };
                this.drawCards(config, 5);
                return config;
            });
            state.dragonInfo = initDragonInfo();
            const dungeonDeck = this.cardsService.getShareDecksCards(state.dungeonDeckIds);
            state.dungeonDeck = this.shuffle(dungeonDeck);
            state.dungeonRow = [];
            state.reserveRow = this.cardsService.getReserveDecksCards(
                state.mapDlcId,
                state.players.length,
            );
            state.tokens = this.simpleShuffle(this.tokensService.getTokens());
            state.artifacts = this.simpleShuffle(this.artifactsService.getArtifacts());
            state.turnIndex = 0;
            this.addActionLogs(state, {
                text: 'Игра началась',
            });
            this.drawDungeonRow(state, {
                initDungeonRow: true,
            });
            return state;
        });
        this.onGameUpdated();
    }

    finishTurn() {
        this.gameInfoStore.update((oldState) => {
            const state = lodash.cloneDeep(oldState);
            const currentPlayer = state.players[state.activePlayerIndex];
            Object.assign(currentPlayer.benefitInfo, this.getEmptyBenefitInfo());
            if (currentPlayer.benefitInfo.trashCard) {
                if (currentPlayer.benefitInfo.trashCard > 0) {
                    // TODO: Избавиться от карты
                }
                delete currentPlayer.benefitInfo.trashCard;
            }
            currentPlayer.discard = [
                ...currentPlayer.discard,
                ...currentPlayer.board,
                ...currentPlayer.hand,
            ];
            currentPlayer.board = [];
            currentPlayer.hand = [];
            this.drawCards(currentPlayer, 5);
            state.players = arrayUpdate(state.players, currentPlayer.id, currentPlayer);
            this.addActionLogs(state, {
                text: `${currentPlayer.name} закончил свой ход`,
                colorId: currentPlayer.colorId,
            });

            this.drawDungeonRow(state, {});
            state.activePlayerIndex = state.activePlayerIndex < state.players.length - 1
                ? state.activePlayerIndex + 1
                : 0;
            const newActivPlayer = state.players[state.activePlayerIndex];
            state.activePlayerId = newActivPlayer.id;
            this.addActionLogs(state, {
                text: `Ход переходит к игроку ${newActivPlayer.name}`,
                colorId: newActivPlayer.colorId,
            });

            state.turnIndex++;
            state.statusId = state.players.every(p => p.isFinish)
                ? GameInfoStatusIdEnum.Finished
                : state.statusId;
            return state;
        });
        this.onGameUpdated();
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

    private shuffle(deck: ClankCardState[]) {
        return this.simpleShuffle(deck).map((card, index) => {
            const newState: ClankCardState = {
                ...card,
                index,
            };
            return newState;
        });
    }

    private drawDungeonRow(
        state: GameInfoState,
        options?: {
            ignoreDragonAttack?: boolean,
            initDungeonRow?: boolean,
        },
    ): void {
        if (state.dungeonRow == null || state.dungeonDeck == null) {
            return;
        }
        let isDragonAttack = false;
        const skippedCards: ClankCardState[] = [];
        while (state.dungeonRow.length < 6 && state.dungeonDeck.length > 0) {
            const cardState = state.dungeonDeck.pop();
            if (!cardState) {
                break;
            }
            const card = this.cardsService.getCardInfo(cardState);
            if (!card) {
                break;
            }
            if (card.arrive?.isDragonAttack && options?.initDungeonRow) {
                skippedCards.push(cardState);
            } else {
                if (card.arrive?.isDragonAttack && !options?.ignoreDragonAttack) {
                    isDragonAttack = true;
                }
                // TODO: применить свойства из поля arrive
                state.dungeonRow.push(cardState);
                this.addActionLogs(state, {
                    text: `Карта ${cardState.name} появилась в подземном ряду`,
                });
            }
        }
        state.dungeonDeck = this.shuffle([
            ...state.dungeonDeck,
            ...skippedCards,
        ]);

        if (isDragonAttack) {
            // TODO: атака дракона
            this.addActionLogs(state, {
                text: `Дракон атакует`,
            });
        }
        return;
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

    private getEmptyBenefitInfo() {
        const benefitInfo: ClankPlayerConfig['benefitInfo'] = {
            sword: 0,
            boot: 0,
            skill: 0,
            clank: 0,
        };
        return benefitInfo;
    }

    private setBenefits(
        player: ClankPlayerConfig,
        benefitInfo: ClankCostInfo,
        state: GameInfoState,
    ) {
        if (benefitInfo.heal) {
            if (benefitInfo.heal > 10) {
                benefitInfo.heal = 10;
            }
            if (benefitInfo.heal === 0) {
                const mapElement = this.gameInfoQuery.mapInfo?.elements.find(p => p.id === player.elementId);
                player.isRescued = !mapElement?.isDungeon;
                player.isEscaped = false;
                player.isFinish = true;
            }
        }

        if (benefitInfo.card) {
            if (benefitInfo.card > 0) {
                this.drawCards(player, benefitInfo.card);
                this.addActionLogs(state, {
                    text: `${player.name} добрал карты (${benefitInfo.card})`,
                    colorId: player.colorId,
                });
            } else {
                // TODO: Сбросить карту
            }
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

        if (benefitInfo.teleport) {
            // TODO: телепортация в соседнее помещениие
            delete benefitInfo.teleport;
            this.addActionLogs(state, {
                text: `${player.name} должен выбрать куда хочет телепортироваться`,
                colorId: player.colorId,
            });
        }

        if (benefitInfo.dragon_rage && state.dragonInfo.rage < (this.gameInfoQuery.mapInfo?.maxDragonRage ?? 0)) {
            state.dragonInfo.rage++;
            this.addActionLogs(state, {
                text: `Повышается ярость дракона`,
            });
        }

        // TODO: реакция на другие
        player.benefitInfo = benefitInfo;
    }

    private addActionLogs(state: GameInfoState, data: GameInfoActionLogData) {
        const momentTime = moment();
        state.actionLogs.push({
            turnIndex: state.turnIndex,
            createdAt: momentTime.format(MomentDateFormat),
            data,
        });
    }

}
