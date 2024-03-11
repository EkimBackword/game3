import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { SessionQuery } from 'src/app/session/session.query';
import { getCurrentTime } from 'src/app/shared/models/game.types';
import {
    LobbySocket,
    SocketService,
} from 'src/app/shared/services/socket.service';
import { ToastService } from 'src/app/shared/services/toast.service';

import { GamePlayerId } from '@shared/game/game-constants';
import { GameState } from '@shared/game/game-state';
import { LobbyStatusIdEnum } from '@shared/lobby/lobby';
import { LobbyChatMessagePayload } from '@shared/lobby/lobby-chat';
import { LobbyGameChangeOptions } from '@shared/lobby/lobby-game';
import { LobbyStatistic } from '@shared/lobby/lobby-statistics';
import { SocketErrorTypeEnum } from '@shared/socket.types';

import { LobbyClient } from '../models/lobby-client';

@Injectable()
export class LobbyService {

    client = new LobbyClient();

    private socket: LobbySocket | undefined;

    constructor(
        private toastService: ToastService,
        private socketService: SocketService,
        private sessionQuery: SessionQuery,
        private router: Router,
    ) { }

    disconnect() {
        this.socket?.disconnect()
        this.onDisconnect();
    }

    private onDisconnect() {
        this.socket?.removeAllListeners();
        this.socket = void 0;
        this.client.connectToLobby({
            id: '',
            name: '',
            adminId: '',
            statusId: LobbyStatusIdEnum.Lobby,
            users: [],
            statistics: [],
            chat: {
                list: [],
            },
            game: {
                id: null,
                setupData: null,
                players: {},
                state: null,
                log: [],
            }
        });
    }

    init(lobbyId: string) {
        return new Promise<string>((resolve, reject) => {
            if (this.client.id() === lobbyId) {
                resolve(lobbyId);
                return;
            }

            this.client.id.set(lobbyId);
            this.socket = this.socketService.getLobbySocket(lobbyId);

            this.socket.on('disconnect', (reason) => {
                if (reason !== 'io client disconnect') {
                    this.socket?.connect();
                } else {
                    this.onDisconnect();
                }
            });

            this.socket.on('error', (message, type) => {
                this.toastService.showError(message);
                if (type === SocketErrorTypeEnum.gameNotFound) {
                    this.router.navigate(['/']);
                }
            });

            this.socket.on('userKicked', (userId) => {
                if (userId !== this.sessionQuery.id) {
                    return;
                }
                this.toastService.showWarn('Разрыв соединения');
                this.router.navigate(['/']);
            });

            this.socket.on('connectToLobby', (lobby) => {
                this.client.connectToLobby(lobby);
                this.toastService.showSuccess('Успешное подключение к игре');
                resolve(lobby.id);
            });

            this.socket.on('statusChanged', (data) => {
                this.client.statusChanged(data);
            });

            this.socket.on('usersChanged', (data) => {
                this.client.usersChanged(data);
            });

            this.socket.on('statisticsChanged', (data) => {
                this.client.statisticsChanged(data);
            });

            this.socket.on('messageSended', (data) => {
                this.client.chat.messageSended(data);
            });

            this.socket.on('gameChanged', (data) => {
                this.client.game.gameChanged(data);
            });

            setTimeout(() => {
                if (this.socket?.disconnected) {
                    this.socket.connect();
                }
            }, 500);
        });
    }

    addStatistics(data: LobbyStatistic) {
        this.socket?.emit('addStatistics', data);
    }

    sendMessage(data: LobbyChatMessagePayload) {
        this.socket?.emit('sendMessage', data);
    }

    startGame(data: GameState) {
        this.socket?.emit('startGame', data);
    }

    finishGame() {
        this.socket?.emit('finishGame');
    }

    changeGame(data: LobbyGameChangeOptions) {
        this.socket?.emit('changeGame', data);
    }

    changeSetupData(setupData) {
        this.socket?.emit('changeSetupData', setupData);
    }

    joinToGame(setupData?) {
        this.socket?.emit('joinToGame', setupData);
    }

    leaveFromGame(setupData?) {
        this.socket?.emit('leaveFromGame', setupData);
    }

    addState(data: GameState) {
        this.socket?.emit('addState', data);
    }

    undoState() {
        this.socket?.emit('undoState', getCurrentTime());
    }

    kickUser(userId: GamePlayerId, setupData?) {
        this.socket?.emit('kickUser', userId, setupData);
    }

}
