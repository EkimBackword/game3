import { Injectable } from '@angular/core';

import * as lodash from 'lodash';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import {
    distinctUntilChanged,
    filter,
    map,
    pairwise,
    shareReplay,
    startWith,
    tap,
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
import { SoundService } from 'src/app/shared/services/sound.service';
import { ToastService } from 'src/app/shared/services/toast.service';

import { Query } from '@datorama/akita';
import {
    faCube,
    faDragon,
} from '@fortawesome/free-solid-svg-icons';
import {
    GameInfoActionLog,
    GameInfoActionLogType,
    GameInfoState,
    GameInfoStatusIdEnum,
} from '@shared/clank/clank-game.types';
import { ClankMumiaPositionInfo } from '@shared/clank/clank-mumia.types';
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
            const rowCount = players.length > 2
                ? players.length / 2
                : players.length;
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
        distinctUntilChanged((prev, curr) => lodash.isEqual(prev, curr)),
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
                disableDragonRage: [],
            };
            const mapInfo = this.mapsService.getMapById(mapId);
            if (mapInfo == null) {
                return data;
            }
            data.disableDragonRage = mapInfo.dragonInfo.track.filter(p => {
                return p.canIncreaseRageByUserCount != null
                    && p.canIncreaseRageByUserCount > this.playerCount;
            }).map((p) => {
                return {
                    tooltip: `Используется если количство игроков больше ${p.canIncreaseRageByUserCount}`,
                    style: {
                        top: `${(p.position.y ?? 0)}px`,
                        left: `${(p.position.x ?? 0)}px`,
                        width: `${p.position.width}px`,
                        height: `${p.position.height}px`,
                        backgroundImage: `url(/assets/images/blocked.png)`,
                        backgroundSize: '100% 100%',
                    },
                };
            });
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
        distinctUntilChanged((prev, curr) => lodash.isEqual(prev, curr)),
        shareReplay(1),
    );

    onMumiaPositionChangeSubject = this.select(['mapId', 'mumiaInfo', 'activePlayerId']).pipe(
        map(({mapId, mumiaInfo, activePlayerId}): ClankMumiaPositionInfo | null => {
            const mapInfo = this.mapsService.getMapById(mapId);
            if (mapInfo == null || mapInfo.mumiaInfo == null) {
                return null;
            }
            const mumiaPosition = mapInfo.mumiaInfo.zones?.find(p => p.zone === mumiaInfo.zone);
            if (mumiaPosition == null) {
                return null;
            }
            const currentPlayerPosition = this.currentPlayer?.id === activePlayerId
                ? mapInfo.elements.find(p => p.id === this.currentPlayer?.elementId)
                : void 0;
            const data: ClankMumiaPositionInfo = {
                mumiaInfo,
                mapMumiaInfo: mapInfo.mumiaInfo,
                tooltip: 'Мумия',
                canUse: currentPlayerPosition != null
                    ? currentPlayerPosition?.mumiaZoneType === mumiaInfo.zone
                    : false,
                style: {
                    top: `${(mumiaPosition.position.y ?? 0)}px`,
                    left: `${(mumiaPosition.position.x ?? 0)}px`,
                    width: `${mumiaPosition.position.width}px`,
                    height: `${mumiaPosition.position.height}px`,
                    backgroundImage: `url(${mapInfo.mumiaInfo.url})`,
                    backgroundSize: '100% 100%',
                },
            };
            return data;
        }),
        distinctUntilChanged((prev, curr) => lodash.isEqual(prev, curr)),
        shareReplay(1),
    );

    onPlayersChangeSubject = this.select('players');

    onDungeonDeckChangeSubject = this.select('dungeonDeck');

    onDungeonRowChangeSubject = this.select('dungeonRow');

    onReserveRowChangeSubject = this.select('reserveRow');

    onActivePlayerChangeSubject = this.select(['activePlayerId', 'players', 'statusId']).pipe(
        map(state => state.statusId !== GameInfoStatusIdEnum.Created
            ? state.players.find(p => p.id === state.activePlayerId)
            : undefined,
        ),
        shareReplay(1),
    );

    onMapTokensChangeSubject = this.select('mapTokens');

    onMarketTokensChangeSubject = this.select('marketTokens');

    onArtifactsChangeSubject = this.select('artifacts');

    onCanCancelChangeSubject = this.select('canCancel');

    private logsMap = new Map<string, GameInfoActionLogFrontend[]>();
    onActionLogsChangeSubject = this.select('actionLogs').pipe(
        startWith([] as GameInfoActionLog[]),
        pairwise(),
        map(([lastLogs, logs]) => {
            let showToast = false;
            let newLogs: GameInfoActionLog[] = logs;
            if (lastLogs.length === 0 || lastLogs.length > logs.length) {
                this.logsMap = new Map<string, GameInfoActionLogFrontend[]>();
            } else {
                showToast = true;
                newLogs = logs.slice(lastLogs.length);
            }
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
                this.soundNotificationByLog(log);
            }
            return this.logGroups;
        }),
        distinctUntilChanged((prev, curr) => lodash.isEqual(prev, curr)),
        shareReplay(1),
    );

    private onSearchPlayerIdSubject = new Subject<string | null>();
    searchPlayerIdStream = this.onSearchPlayerIdSubject.pipe(
        tap((token) => {
            if (token != null) {
                setTimeout(() => {
                    this.onSearchPlayerIdSubject.next(null);
                }, 1000);
            }
        }),
    );

    get currentPlayer() {
        const userState = this.sessionQuery.getValue();
        const gameState = this.getValue();
        return gameState.players.find(p => p.id === userState.id);
    }

    get playerCount() {
        const gameState = this.getValue();
        return gameState.players.length;
    }

    get activePlayer() {
        const gameState = this.getValue();
        return gameState.players[gameState.activePlayerIndex];
    }

    get mapInfo() {
        const gameState = this.getValue();
        return this.mapsService.getMapById(gameState.mapId);
    }

    get logGroups() {
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
    }

    constructor(
        protected store: GameInfoStore,
        private sessionQuery: SessionQuery,
        private mapsService: MapsService,
        private toastService: ToastService,
        private soundService: SoundService,
    ) {
      super(store);
    }

    private soundNotificationByLog(log: GameInfoActionLog) {
        if (log.data.soundUrl == null) {
            return;
        }
        switch (log.type) {
            case GameInfoActionLogType.Dragon: {
                this.soundService.play(log.data.soundUrl);
                return;
            }
            default: {
                if (this.currentPlayer?.colorId === log.data.colorId) {
                    this.soundService.play(log.data.soundUrl);
                }
                return;
            }
        }
    }

    searchPlayer(playerId: string) {
        this.onSearchPlayerIdSubject.next(playerId);
    }

}
