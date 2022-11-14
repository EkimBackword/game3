import { Injectable } from '@angular/core';

import {
    filter,
    map,
} from 'rxjs/operators';
import { SessionQuery } from 'src/app/session/session.query';
import { notEmpty } from 'src/app/shared/models/shared.types';
import { MapsService } from 'src/app/shared/services/maps.service';

import { Query } from '@datorama/akita';
import { GameInfoState } from '@shared/clank/clank-game.types';

import { GameInfoStore } from './game-info.store';

@Injectable()
export class GameInfoQuery extends Query<GameInfoState> {

    onAnyChangeSubject = this.select();

    onNameChangeSubject = this.select('name');

    onStatusChangeSubject = this.select('statusId');

    onMapChangeSubject = this.select('mapId').pipe(
        map((mapId) => this.mapsService.getMapById(mapId)),
        filter(notEmpty),
    );

    onPlayersChangeSubject = this.select('players');

    onDungeonDeckChangeSubject = this.select('dungeonDeck');

    onDungeonRowChangeSubject = this.select('dungeonRow');

    onReserveRowChangeSubject = this.select('reserveRow');

    onActivePlayerChangeSubject = this.select(['activePlayerId', 'players']).pipe(
        map(state => state.players.find(p => p.id === state.activePlayerId)),
    );

    onActionLogsChangeSubject = this.select('actionLogs');

    get currentPlayer() {
        const userState = this.sessionQuery.getValue();
        const gameState = this.getValue();
        return gameState.players.find(p => p.id === userState.id);
    }

    constructor(
        protected store: GameInfoStore,
        private sessionQuery: SessionQuery,
        private mapsService: MapsService,
    ) {
      super(store);
    }

}
