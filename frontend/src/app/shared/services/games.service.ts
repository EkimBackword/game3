import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { createInitialGameInfoState } from 'src/app/game/clank/services/game-info.types';

import {
    GameInfoConfig,
    GameInfoState,
} from '@shared/clank/clank-game.types';

import { SocketService } from './socket.service';

@Injectable({
    providedIn: 'root',
})
export class GamesService {

    inited = false;
    gamesList: GameInfoState[] = [];
    gamesListChange = new BehaviorSubject<void>(void 0);

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
            this.gamesList = gamesList;
        });
    }

    addNew(config: GameInfoConfig) {
        const gameState = createInitialGameInfoState(config);
        this.gamesList.push(gameState);
        this.socketService.socket.emit('addGame', gameState);
        return gameState.id;
    }

}
