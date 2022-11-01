import { Injectable } from '@angular/core';

import { Query } from '@datorama/akita';

import { GameInfoStore } from './game-info.store';
import { GameInfoState } from './game-info.types';

@Injectable()
export class GameInfoQuery extends Query<GameInfoState> {

    onAnyChangeSubject = this.select();

    onNameChangeSubject = this.select('name');

    onStatusChangeSubject = this.select('statusId');

    onMapChangeSubject = this.select('mapId');

    onPlayersChangeSubject = this.select('players');

    onCardsChangeSubject = this.select('cards');

    onActivePlayerChangeSubject = this.select('activePlayerId');

    onActionLogsChangeSubject = this.select('actionLogs');

    constructor(
        protected store: GameInfoStore,
    ) {
      super(store);
    }

}
