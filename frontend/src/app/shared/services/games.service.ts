import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { createInitialGameInfoState } from 'src/app/game/clank/services/game-info.types';
import { createInitialSimiloGameInfoState } from 'src/app/game/similo/services/similo-game-info.types';

import {
    GameInfoConfig,
    GameInfoState,
} from '@shared/clank/clank-game.types';
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

}
