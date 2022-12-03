import {
    Injectable,
    OnDestroy,
} from '@angular/core';

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
import {
    ClankCardState,
    ClankCardType,
} from '@shared/clank/clank-card.types';
import {
    ClankDragonInfo,
    initDragonInfo,
} from '@shared/clank/clank-dragon.types';
import {
    GameInfoState,
    GameInfoStatusIdEnum,
} from '@shared/clank/clank-game.types';
import { ClankCostInfo } from '@shared/clank/clank-info.types';
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
        console.log(`Destroy socket service (gameId: ${this.gameId ?? '-'})`);
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
        type: 'moveToBoard' | 'buy';
    }) {
        this.gameInfoStore.update((state) => {
            const dragonInfo = state.dragonInfo;
            const player = state.players.find(p => p.id === playerId);
            if (player == null) {
                return state;
            }
            this.setBenefits(player, dragonInfo, benefitInfo);
            const newState: Partial<GameInfoState> = {
                dragonInfo,
            };
            switch (type) {
                case 'moveToBoard': {
                    player.hand = player.hand.filter(p => p.id !== cardState.id),
                    player.board.push(cardState);
                    break;
                }
                case 'buy': {
                    newState.dungeonRow = state.dungeonRow.filter(p => p.id !== cardState.id);
                    newState.reserveRow = state.reserveRow.filter(p => p.id !== cardState.id);
                    const card = this.cardsService.getCardInfo(cardState);
                    if (card != null && ![
                        ClankCardType.device,
                        ClankCardType.monster,
                    ].includes(card.type)) {
                        player.discard.push(cardState);
                    }
                }
            }
            newState.players = arrayUpdate(
                state.players,
                player.id,
                player,
            );
            return newState;
        });
        this.onGameUpdated();
    }

    takeArtifact(playerId: string, artifact: ClankArtifactConfig) {
        this.gameInfoStore.update((state) => {
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
        this.gameInfoStore.update((state) => {
            const player = state.players.find(p => p.id === playerId);
            if (player == null) {
                return state;
            }
            const newState: Partial<GameInfoState> = {
                tokens: state.tokens.filter(p => p.id !== tokenState.id),
                players: arrayUpdate(state.players, player.id, {
                    tokens: [
                        ...player.tokens,
                        tokenState,
                    ],
                }),
            };
            return newState;
        });
        this.onGameUpdated();
    }

    useToken(playerId: string, tokenState: ClankTokenState) {
        const tokenInfo = this.tokensService.getTokenInfo(tokenState);
        if (tokenInfo == null) {
            return;
        }
        this.gameInfoStore.update((state) => {
            const dragonInfo = state.dragonInfo;
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
                this.setBenefits(player, dragonInfo, benefitInfo);
            }

            const newState: Partial<GameInfoState> = {
                tokens: state.tokens.filter(p => p.id !== tokenState.id),
                players: arrayUpdate(state.players, player.id, player),
                dragonInfo,
            };
            this.toastService.showInfo(`Игрок ${player.name} использует ${tokenInfo.name}`);
            return newState;
        });
        this.onGameUpdated();
    }

    startGame() {
        this.gameInfoStore.update((state) => {
            const activePlayerIndex = Math.floor(Math.random() * state.players.length);
            const activePlayerId = state.players[activePlayerIndex].id;
            const dungeonDeck = this.cardsService.getShareDecksCards(state.dungeonDeckIds);
            const newState: Partial<GameInfoState> = {
                statusId: GameInfoStatusIdEnum.Started,
                activePlayerIndex,
                activePlayerId,
                players: state.players.map(player => {
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
                }),
                dragonInfo: initDragonInfo(),
                dungeonDeck: this.shuffle(dungeonDeck),
                dungeonRow: [],
                reserveRow: this.cardsService.getReserveDecksCards(
                    state.mapDlcId,
                    state.players.length,
                ),
                tokens: this.simpleShuffle(this.tokensService.getTokens()),
                artifacts: this.simpleShuffle(this.artifactsService.getArtifacts()),
            };
            const result = this.drawDungeonRow(newState, {
                initDungeonRow: true,
            });
            return result.state;
        });
        this.onGameUpdated();
    }

    finishTurn() {
        this.gameInfoStore.update((state) => {
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
            const dungeonInfo = this.drawDungeonRow({
                dungeonDeck: state.dungeonDeck,
                dungeonRow: state.dungeonRow,
            }, {});
            if (dungeonInfo.isDragonAttack) {
                // TODO: атака дракона
            }
            const activePlayerIndex = state.activePlayerIndex < state.players.length - 1
                ? state.activePlayerIndex + 1
                : 0;
            const activePlayerId = state.players[activePlayerIndex].id;
            const isFinish = state.players.every(p => p.isFinish);
            const newState: Partial<GameInfoState> = {
                ...dungeonInfo.state,
                activePlayerIndex,
                activePlayerId,
                players: arrayUpdate(state.players, currentPlayer.id, currentPlayer),
                statusId: isFinish
                    ? GameInfoStatusIdEnum.Finished
                    : state.statusId,
            };
            return newState;
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
        state: Partial<GameInfoState>,
        options?: {
            ignoreDragonAttack?: boolean,
            initDungeonRow?: boolean,
        },
    ): {
        state: Partial<GameInfoState>,
        isDragonAttack: boolean;
    } {
        if (state.dungeonRow == null || state.dungeonDeck == null) {
            return {
                state,
                isDragonAttack: false,
            };
        }
        let isDragonAttack = false;
        const skippedCards: ClankCardState[] = [];
        while (state.dungeonRow.length < 6 && state.dungeonDeck.length > 0) {
            const cardState = state.dungeonDeck.pop();
            if (!cardState) {
                console.log('break | cardState', cardState);
                break;
            }
            const card = this.cardsService.getCardInfo(cardState);
            if (!card) {
                console.log('break | card', cardState);
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
            }
        }
        state.dungeonDeck = this.shuffle([
            ...state.dungeonDeck,
            ...skippedCards,
        ]);
        return {
            state,
            isDragonAttack,
        };
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
        dragonInfo: ClankDragonInfo,
        benefitInfo: ClankCostInfo,
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
            } else {
                // TODO: Сбросить карту
            }
            delete benefitInfo.card;
        }

        if (benefitInfo.pyramid_dice) {
            // TODO: бросить кубик
            delete benefitInfo.pyramid_dice;
        }

        if (benefitInfo.teleport) {
            // TODO: телепортация в соседнее помещениие
            delete benefitInfo.teleport;
        }

        if (benefitInfo.dragon_rage) {
            dragonInfo.rage++;
        }

        // TODO: реакция на другие
        player.benefitInfo = benefitInfo;
    }

}
