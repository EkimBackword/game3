import { Injectable } from '@angular/core';

import {
    BehaviorSubject,
    map,
    takeWhile,
} from 'rxjs';
import { createInitialGameInfoState } from 'src/app/game/clank/services/game-info.types';
import { createInitialSimiloGameInfoState } from 'src/app/game/similo/services/similo-game-info.types';

import { guid } from '@datorama/akita';
import {
    GameInfoConfig,
    GameInfoState,
} from '@shared/clank/clank-game.types';
import {
    Lobby,
    LobbyConfigShort,
} from '@shared/lobby/lobby';
import {
    SimiloGameInfoConfig,
    SimiloGameInfoState,
} from '@shared/similo/similo-game.types';

import { SocketService } from './socket.service';

@Injectable({
    providedIn: 'root',
})
export class GamesService {

    inited = false;
    gamesListSubject = new BehaviorSubject<GameInfoState[]>([]);
    similoTablesSubject = new BehaviorSubject<SimiloGameInfoState[]>([]);
    lobbyListSubject = new BehaviorSubject<Lobby[]>([]);

    constructor(
        private socketService: SocketService,
    ) {
    }

    init() {
        if (this.inited) {
            return;
        }
        this.inited = true;
        this.socketService.socket.on('gameListChanged', (gamesList) => {
            this.gamesListSubject.next(gamesList);
        });
        this.socketService.socket.on('similoTablesChanged', (similoTables) => {
            this.similoTablesSubject.next(similoTables);
        });
        this.socketService.socket.on('lobbyStoreChanged', (list) => {
            this.lobbyListSubject.next(list);
        });
    }

    addNew(config: GameInfoConfig) {
        const gameState = createInitialGameInfoState(config);
        this.gamesListSubject.next([
            ...this.gamesListSubject.getValue(),
            gameState,
        ]);
        this.socketService.socket.emit('addGame', gameState);
        return gameState.id;
    }

    addSimiloTable(config: SimiloGameInfoConfig) {
        const similoTable = createInitialSimiloGameInfoState(config);
        this.similoTablesSubject.next([
            ...this.similoTablesSubject.getValue(),
            similoTable,
        ]);
        this.socketService.socket.emit('addSimiloTable', similoTable);
        return similoTable.id;
    }

    addLobby(name: string) {
        const newLobby: LobbyConfigShort = {
            id: guid(),
            name,
        };
        this.socketService.socket.emit('addLobby', newLobby);
        return this.lobbyListSubject.pipe(
            takeWhile((list) => !list.some(p => p.id === newLobby.id)),
            map(() => newLobby.id),
        );
    }

}
