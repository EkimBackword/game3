import { Injectable } from '@angular/core';

import {
    BehaviorSubject,
    of,
    throwError,
} from 'rxjs';
import { uuidv4 } from 'src/app/session/session.model';

import {
    GameInfoConfig,
    GameInfoState,
    GameInfoStatusIdEnum,
} from '../../game/services/game-info/game-info.types';
import { ClankDlcEnum } from '../models/clank.types';
import { ClankMapConfigIds } from '../models/maps/clank-maps.types';

@Injectable({
    providedIn: 'root',
})
export class GamesService {

    gamesList: GameInfoState[] = [
        {
            id: 'test',
            name: 'TEST',
            mapId: ClankMapConfigIds.clank_1,
            startDeckId: ClankDlcEnum.clank,
            reserveDeckIds: [ClankDlcEnum.clank],
            shareDeckIds: [ClankDlcEnum.clank],
            cards: [],
            players: [],
            statusId: GameInfoStatusIdEnum.Created,
            activePlayerId: '',
            actionLogs: [],
        },
    ];
    gamesListChange = new BehaviorSubject<void>(void 0);

    constructor() { }

    loadGames() {
        // TODO: Добавить загрузку списка игр с сервера
        this.gamesListChange.next();
    }

    addNew(config: GameInfoConfig) {
        const gameState: GameInfoState =  {
            ...config,
            id: uuidv4(),
            statusId: GameInfoStatusIdEnum.New,
            players: [],
            cards: [],
            activePlayerId: '',
            actionLogs: [],
        };
        this.gamesList.push(gameState);
        return gameState.id;
    }

    getGameById(id: string) {
        const gameInfo = this.gamesList.find(p => p.id === id);
        return gameInfo != null
            ? of(gameInfo)
            : throwError(`Game #${id} not found`);
    }

}
