import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { guid } from '@datorama/akita';
import {
    GameInfoConfig,
    GameInfoState,
    GameInfoStatusIdEnum,
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
        const gameState: GameInfoState =  {
            ...config,
            id: guid(),
            statusId: GameInfoStatusIdEnum.New,
            players: [],
            dungeonDeck: [],
            dungeonRow: [],
            reserveRow: [],
            activePlayerIndex: 0,
            activePlayerId: '',
            actionLogs: [],
        };
        this.gamesList.push(gameState);
        this.socketService.socket.emit('addGame', gameState);
        return gameState.id;
    }

}
