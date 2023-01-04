import { Injectable } from '@angular/core';

import * as moment from 'moment';
import {
    filter,
    map,
    pairwise,
    shareReplay,
    startWith,
} from 'rxjs/operators';
import { SessionQuery } from 'src/app/session/session.query';
import {
    GameInfoActionLogFrontend,
    GameInfoActionLogGroup,
    MomentDateFormat,
    MomentDateGroupFormat,
} from 'src/app/shared/models/game.types';
import { notEmpty } from 'src/app/shared/models/shared.types';
import { ToastOptions } from 'src/app/shared/models/toast.types';
import { MapsService } from 'src/app/shared/services/maps.service';
import { ToastService } from 'src/app/shared/services/toast.service';

import { Query } from '@datorama/akita';
import {
    faCube,
    faDragon,
} from '@fortawesome/free-solid-svg-icons';
import {
    GameInfoActionLog,
    GameInfoState,
} from '@shared/clank/clank-game.types';
import {
    GamePlayerColorIdEnum,
    GamePlayerColorList,
} from '@shared/clank/clank-player.types';
import { ToastSeverityEnum } from '@shared/toast.types';

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

    onPlayersPositionChangeSubject = this.select(['mapId', 'players', 'activePlayerId', 'dragonInfo']).pipe(
        map(({mapId, players, activePlayerId, dragonInfo}) => {
            const mapInfo = this.mapsService.getMapById(mapId);
            if (mapInfo == null) {
                return [];
            }
            const rowCount = 2;
            const size = 100;
            const countByElementId = new Map<number, number>();
            return players.map(player => {
                const isActive = player.id === activePlayerId;
                const data: PlayersPositionInfo = {
                    player,
                    style: {},
                    size,
                    isActive,
                };
                if (player.isFinish && player.colorId === dragonInfo.endGameCounter.colorId) {
                    const trackElement = mapInfo.dragonInfo.endGameTrack.find(p => p.index === dragonInfo.endGameCounter.index);
                    data.style = {
                        top: `${(trackElement?.position.y ?? 0) + ((trackElement?.position.height ?? 0) - size) / 2}px`,
                        left: `${(trackElement?.position.x ?? 0) + ((trackElement?.position.width ?? 0) - size) / 2}px`,
                    };
                } else {
                    const count = countByElementId.get(player.elementId) ?? 0;
                    countByElementId.set(player.elementId, count + 1);
                    const mapElement = mapInfo.elements.find(p => p.id === player.elementId);
                    const rowIndex = Math.floor(count / rowCount);
                    const columnIndex = (count % rowCount);
                    data.style = {
                        top: `${(mapElement?.position.y ?? 0) + rowIndex * size}px`,
                        left: `${(mapElement?.position.x ?? 0) + columnIndex * size}px`,
                    };
                }
                return data;
            });
        }),
        shareReplay(1),
    );

    onDragonPositionChangeSubject = this.select(['mapId', 'dragonInfo']).pipe(
        map(({mapId, dragonInfo}): DragonPositionInfo => {
            const data: DragonPositionInfo = {
                clankCount: 0,
                dragonInfo,
                style: {},
                clankAriaStyle: {},
                tooltip: `Уровень ярости дакона: ${dragonInfo.rage}`,
            };
            const mapInfo = this.mapsService.getMapById(mapId);
            if (mapInfo == null) {
                return data;
            }
            const dragonPosition = mapInfo.dragonInfo.track.find(p => p.rage === dragonInfo.rage);
            if (dragonPosition == null) {
                return data;
            }
            data.clankCount = dragonPosition.clank;
            data.tooltip = `Уровень ярости дакона: ${dragonInfo.rage} (${data.clankCount} бдзынь)`,
            data.style = {
                top: `${(dragonPosition.position.y ?? 0)}px`,
                left: `${(dragonPosition.position.x ?? 0)}px`,
                width: `${dragonPosition.position.width}px`,
                height: `${dragonPosition.position.height}px`,
                backgroundImage: `url(${mapInfo.dragonInfo.url})`,
                backgroundSize: '100% 100%',
            };
            const clankAria = mapInfo.dragonInfo.clankAria;
            data.clankAriaStyle = {
                top: `${(clankAria.y ?? 0)}px`,
                left: `${(clankAria.x ?? 0)}px`,
                width: `${clankAria.width}px`,
                height: `${clankAria.height}px`,
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

    onMapTokensChangeSubject = this.select('mapTokens');

    onMarketTokensChangeSubject = this.select('marketTokens');

    onArtifactsChangeSubject = this.select('artifacts');

    private logsMap = new Map<string, GameInfoActionLogFrontend[]>();
    onActionLogsChangeSubject = this.select('actionLogs').pipe(
        startWith([] as GameInfoActionLog[]),
        pairwise(),
        map(([lastLogs, logs]) => {
            const showToast = lastLogs.length > 0;
            const newLogs = logs.slice(lastLogs.length);
            for (const log of newLogs) {
                const data: GameInfoActionLogFrontend =  {
                    ...log,
                    createdAtMoment: moment(log.createdAt, MomentDateFormat),
                };
                const name = data.createdAtMoment.format(MomentDateGroupFormat);
                const list = this.logsMap.get(name) ?? [];
                list.push(data);
                this.logsMap.set(name, list);
                if (showToast && !log.data.hideToast) {
                    const colorInfo = GamePlayerColorList[log.data.colorId ?? GamePlayerColorIdEnum.Black];
                    const options: Partial<ToastOptions> = {
                        bodyText: log.data.subtext ?? '',
                    };
                    if (log.data.severity == null) {
                        options.icon = log.data.isDragon
                            ? faDragon
                            : faCube;
                        options.iconStyle = {
                            color: colorInfo.color,
                        };
                        options.bodyStyle = {
                            backgroundColor: colorInfo.color,
                        };
                        options.duration = log.data.isDragon
                            ? 3000
                            : 1000;
                    }
                    this.toastService.show(
                        log.data.severity ?? ToastSeverityEnum.secondary,
                        log.data.text,
                        options,
                    );
                }
            }
            return [...this.logsMap.entries()].map(([name, list]) => {
                const result: GameInfoActionLogGroup = {
                    name,
                    dateForOrder: list[0].createdAtMoment,
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
        private toastService: ToastService,
    ) {
      super(store);
    }

}
