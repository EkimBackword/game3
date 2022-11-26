import {
    Injectable,
    OnDestroy,
} from '@angular/core';

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
import {
    GameInfoState,
    GameInfoStatusIdEnum,
} from '@shared/clank/clank-game.types';
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

    takeArtifact(player: ClankPlayerConfig, artifact: ClankArtifactConfig) {
        this.gameInfoStore.update(({artifacts, players}) => {
            const result: Partial<GameInfoState> = {
                artifacts: artifacts.filter(p => p.id !== artifact.id),
                players: arrayUpdate(players, player.id, {
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

    takeToken(player: ClankPlayerConfig, token: ClankTokenState) {
        this.gameInfoStore.update(({tokens, players}) => {
            const result: Partial<GameInfoState> = {
                tokens: tokens.filter(p => p.id !== token.id),
                players: arrayUpdate(players, player.id, {
                    tokens: [
                        ...player.tokens,
                        token,
                    ],
                }),
            };
            return result;
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
                        benefitInfo: this.getEmptyBenefitInfo(),
                    };
                    this.drawCards(config, 5);
                    return config;
                }),
                dungeonDeck: this.shuffle(dungeonDeck),
                reserveRow: this.cardsService.getReserveDecksCards(
                    state.mapDlcId,
                    state.players.length,
                ),
                tokens: this.simpleShuffle(this.tokensService.getTokens()),
                artifacts: this.simpleShuffle(this.artifactsService.getArtifacts()),
            };
            return newState;
        });
        this.onGameUpdated();
    }

    finishTurn() {
        this.gameInfoStore.update((state) => {
            const currentPlayer = state.players[state.activePlayerIndex];
            currentPlayer.benefitInfo = this.getEmptyBenefitInfo();
            currentPlayer.discard = [
                ...currentPlayer.discard,
                ...currentPlayer.board,
                ...currentPlayer.hand,
            ];
            currentPlayer.board = [];
            currentPlayer.hand = [];
            this.drawCards(currentPlayer, 5);
            // TODO: Если в подземном ряду меньше 6 карт, то надо выложить новые
            const activePlayerIndex = state.activePlayerIndex < state.players.length - 1
                ? state.activePlayerIndex + 1
                : 0;
            const activePlayerId = state.players[activePlayerIndex].id;
            const isFinish = state.players.every(p => p.isFinish);
            const newState: Partial<GameInfoState> = {
                activePlayerIndex,
                activePlayerId,
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

    private simpleShuffle(list: any[]) {
        return list.sort(() => Math.random() - 0.5);
    }

    private shuffle(deck: ClankCardState[]) {
        return this.simpleShuffle(deck).map((card, index) => {
            return {
                ...card,
                index,
            };
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

    private getEmptyBenefitInfo() {
        const benefitInfo: ClankPlayerConfig['benefitInfo'] = {
            sword: 0,
            boot: 0,
            skill: 0,
            clank: 0,
        };
        return benefitInfo;
    }

}
