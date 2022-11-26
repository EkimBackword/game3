import { Injectable } from '@angular/core';

import {
    filter,
    map,
    shareReplay,
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
        shareReplay(1),
    );

    onPlayersPositionChangeSubject = this.select(['mapId', 'players']).pipe(
        map(({mapId, players}) => {
            const mapInfo = this.mapsService.getMapById(mapId);
            if (mapInfo == null) {
                return [];
            }
            const size = 100;
            const countByElementId = new Map<number, number>();
            return players.map(player => {
                const count = countByElementId.get(player.elementId) ?? 0;
                countByElementId.set(player.elementId, count + 1);
                const mapElement = mapInfo.elements.find(p => p.id === player.elementId);
                const style: Partial<CSSStyleDeclaration> = {
                    top: `${mapElement?.position.y ?? 0}px`,
                    left: `${(mapElement?.position.x ?? 0) + count * size}px`,
                };
                const data = {
                    player,
                    style,
                    size,
                };
                return data;
            });
        }),
        shareReplay(1),
    );

    onPlayersChangeSubject = this.select('players');

    onDungeonDeckChangeSubject = this.select('dungeonDeck');

    onDungeonRowChangeSubject = this.select('dungeonRow');

    onReserveRowChangeSubject = this.select('reserveRow');

    onActivePlayerChangeSubject = this.select(['activePlayerId', 'players']).pipe(
        map(state => state.players.find(p => p.id === state.activePlayerId)),
        shareReplay(1),
    );

    onTokensChangeSubject = this.select('tokens');

    onArtifactsChangeSubject = this.select('artifacts');

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
