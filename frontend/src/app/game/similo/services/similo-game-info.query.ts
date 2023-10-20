import { Injectable } from '@angular/core';

import { SessionQuery } from 'src/app/session/session.query';

import { Query } from '@datorama/akita';
import { SimiloGameInfoState } from '@shared/similo/similo-game.types';

import { SimiloGameInfoStore } from './similo-game-info.store';

@Injectable()
export class SimiloGameInfoQuery extends Query<SimiloGameInfoState> {

    onAnyChangeSubject = this.select();

    get currentPlayer() {
        const userState = this.sessionQuery.getValue();
        const gameState = this.getValue();
        return gameState.players.find(p => p.id === userState.id);
    }

    get isMaster() {
        const userState = this.sessionQuery.getValue();
        const gameState = this.getValue();
        return gameState.masterPlayerId === userState.id;
    }

    constructor(
        protected store: SimiloGameInfoStore,
        private sessionQuery: SessionQuery,
    ) {
        super(store);
    }

}
