import { Injectable } from '@angular/core';

import * as moment from 'moment';
import {
    filter,
    map,
    shareReplay,
} from 'rxjs/operators';
import { SessionQuery } from 'src/app/session/session.query';
import {
    GameInfoActionLogFrontend,
    GameInfoActionLogGroup,
    MomentDateFormat,
    MomentDateGroupFormat,
} from 'src/app/shared/models/game.types';
import { notEmpty } from 'src/app/shared/models/shared.types';
import { MapsService } from 'src/app/shared/services/maps.service';

import { Query } from '@datorama/akita';
import { GameInfoState } from '@shared/clank/clank-game.types';

import { GameInfoStore } from './game-info.store';
import {
    DragonPositionInfo,
    PlayersPositionInfo,
} from './game-info.types';

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

    onPlayersPositionChangeSubject = this.select(['mapId', 'players', 'activePlayerId']).pipe(
        map(({mapId, players, activePlayerId}) => {
            const mapInfo = this.mapsService.getMapById(mapId);
            if (mapInfo == null) {
                return [];
            }
            const rowCount = 2;
            const size = 100;
            const countByElementId = new Map<number, number>();
            return players.map(player => {
                const isActive = player.id === activePlayerId;
                const count = countByElementId.get(player.elementId) ?? 0;
                countByElementId.set(player.elementId, count + 1);
                const mapElement = mapInfo.elements.find(p => p.id === player.elementId);
                const rowIndex = Math.floor(count / rowCount);
                const columnIndex = (count % rowCount);
                const style: Partial<CSSStyleDeclaration> = {
                    top: `${(mapElement?.position.y ?? 0) + rowIndex * size}px`,
                    left: `${(mapElement?.position.x ?? 0) + columnIndex * size}px`,
                };
                const data: PlayersPositionInfo = {
                    player,
                    style,
                    size,
                    isActive,
                };
                return data;
            });
        }),
        shareReplay(1),
    );

    onDragonPositionChangeSubject = this.select(['mapId', 'dragonInfo']).pipe(
        map(({mapId, dragonInfo}): DragonPositionInfo => {
            const data: DragonPositionInfo = {
                dragonInfo,
                style: {},
                tooltip: `Уровень ярости дакона: ${dragonInfo.rage} `,
            };
            const mapInfo = this.mapsService.getMapById(mapId);
            if (mapInfo == null) {
                return data;
            }
            const dragonPosition = mapInfo.dragonInfo.track.find(p => p.rage === dragonInfo.rage);
            if (dragonPosition == null) {
                return data;
            }
            data.style = {
                top: `${(dragonPosition.position.y ?? 0)}px`,
                left: `${(dragonPosition.position.x ?? 0)}px`,
                width: `${dragonPosition.position.width}px`,
                height: `${dragonPosition.position.height}px`,
                backgroundImage: `url(${mapInfo.dragonInfo.url})`,
                backgroundSize: '100% 100%',
            };
            return data;
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

    onActionLogsChangeSubject = this.select('actionLogs').pipe(
        map((logs) => {
            const logMap = new Map<string, GameInfoActionLogFrontend[]>();
            for (const log of logs) {
                const data: GameInfoActionLogFrontend =  {
                    ...log,
                    createdAtMoment: moment(log.createdAt, MomentDateFormat),
                };
                const name = data.createdAtMoment.format(MomentDateGroupFormat);
                const list = logMap.get(name) ?? [];
                list.push(data);
                logMap.set(name, list);
            }
            return [...logMap.entries()].map(([name, list]) => {
                const result: GameInfoActionLogGroup = {
                    name,
                    dateForOrder: moment(name, MomentDateGroupFormat),
                    list: list.sort((a, b) => {
                        const momentDiff = b.createdAtMoment.diff(a.createdAtMoment);
                        if (momentDiff === 0) {
                            return b.index - a.index;
                        }
                        return momentDiff;
                    }),
                };
                return result;
            }).sort((a, b) => b.dateForOrder.diff(a.dateForOrder));
        }),
        shareReplay(1),
    );

    get currentPlayer() {
        const userState = this.sessionQuery.getValue();
        const gameState = this.getValue();
        return gameState.players.find(p => p.id === userState.id);
    }

    get activePlayer() {
        const gameState = this.getValue();
        return gameState.players[gameState.activePlayerIndex];
    }

    get mapInfo() {
        const gameState = this.getValue();
        return this.mapsService.getMapById(gameState.mapId);
    }

    constructor(
        protected store: GameInfoStore,
        private sessionQuery: SessionQuery,
        private mapsService: MapsService,
    ) {
      super(store);
    }

}
