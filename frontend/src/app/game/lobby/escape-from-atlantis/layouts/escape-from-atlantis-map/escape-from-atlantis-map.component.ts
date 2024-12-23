import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    HostBinding,
    Injector,
    Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
    debounceTime,
    fromEvent,
    startWith,
} from 'rxjs';
import { SessionQuery } from 'src/app/session/session.query';

import { LobbyClient } from '../../../models/lobby-client';
import { LobbyService } from '../../../services/lobby.service';
import { EscapeFromAtlantisCellDisplayInfo } from '../../components/escape-from-atlantis-cell/escape-from-atlantis-cell';
import { EscapeFromAtlantisGameMeepleDisplayInfo } from '../../components/escape-from-atlantis-game-meeple/escape-from-atlantis-game-meeple';
import { EscapeFromAtlantisPlayerMeepleDisplayInfo } from '../../components/escape-from-atlantis-player-meeple/escape-from-atlantis-player-meeple';
import { EscapeFromAtlantisCellSettings } from '../../models/cells';
import { EscapeFromAtlantisGameBuilder } from '../../models/game-builder';
import { EscapeFromAtlantisGameType } from '../../models/game-type';
import { EscapeFromAtlantisCellMeepleType } from '../../models/meeples';
import { EscapeFromAtlantisSetupData } from '../../models/setup-data';

@Component({
    selector: 'app-escape-from-atlantis-map',
    templateUrl: './escape-from-atlantis-map.component.html',
    styleUrls: ['./escape-from-atlantis-map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class EscapeFromAtlantisMapComponent implements AfterViewInit {

    client: LobbyClient<EscapeFromAtlantisGameType, EscapeFromAtlantisSetupData> = this.lobbyService.client;
    builder = this.client.game.builder as Signal<EscapeFromAtlantisGameBuilder | null>;

    @HostBinding('style.--map-opacity') opacity = 0;
    @HostBinding('style.--map-zoom') zoom = 0;
    @HostBinding('style.--map-padding.px') padding = EscapeFromAtlantisCellSettings.mapPadding;
    @HostBinding('style.--map-width.px') width =
        EscapeFromAtlantisCellSettings.columnsCount * EscapeFromAtlantisCellSettings.columnStep
        + EscapeFromAtlantisCellSettings.columnOffset
        + EscapeFromAtlantisCellSettings.mapPadding * 2;
    @HostBinding('style.--map-height.px') height =
        EscapeFromAtlantisCellSettings.rowsCount * EscapeFromAtlantisCellSettings.height
        + EscapeFromAtlantisCellSettings.mapPadding * 2;

    cells = computed(() => {
        const state = this.client.game.state();
        return (state?.game.cells ?? []).map(config => {
            return new EscapeFromAtlantisCellDisplayInfo(config, this.injector);
        });
    });

    tiles = computed(() => {
        const cells = this.cells();
        return cells.flatMap(cell => cell.tile != null ? cell.tile : []);
    });

    meeples = computed(() => {
        const cells = this.cells();
        return cells.flatMap(cell => {
            if (cell.isFinishCell()) {
                return [];
            }
            return cell.meeples().flatMap((meeple, index) => {
                if (meeple.type === EscapeFromAtlantisCellMeepleType.GameMeeple) {
                    return new EscapeFromAtlantisGameMeepleDisplayInfo(
                        {
                            ...meeple,
                            index,
                            cell,
                            player: null,
                        },
                        this.injector,
                    );
                }
                return new EscapeFromAtlantisPlayerMeepleDisplayInfo(
                    {
                        ...meeple,
                        index,
                        cell,
                        gameMeeple: null,
                        player: null,
                    },
                    this.injector,
                );
            });
        });
    });

    gameMeeples = computed(() => {
        const meeples = this.meeples();
        return meeples.filter((p): p is EscapeFromAtlantisGameMeepleDisplayInfo => p instanceof EscapeFromAtlantisGameMeepleDisplayInfo);
    });

    playerMeeples = computed(() => {
        const meeples = this.meeples();
        return meeples.filter((p): p is EscapeFromAtlantisPlayerMeepleDisplayInfo => p instanceof EscapeFromAtlantisPlayerMeepleDisplayInfo);
    });

    isActivePlayer = computed(() => {
        const state = this.client.game.state();
        const user = this.sessionQuery.getValue();
        return state?.context.currentPlayerId === user.id
    });

    isWatcher = computed(() => {
        const players = this.client.game.players();
        const user = this.sessionQuery.getValue();
        return !players?.has(user.id);
    });

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private destroyRef: DestroyRef,
        private elementRef: ElementRef,
        private lobbyService: LobbyService,
        private sessionQuery: SessionQuery,
        private injector: Injector,
    ) {
    }

    ngAfterViewInit() {
        this.onResize();

        fromEvent(window, 'resize').pipe(
            startWith(null),
            debounceTime(0),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe(() => this.onResize());
    }

    trackById(index: number, cell: { id: Signal<number>; }) {
        return cell.id();
    }

    private onResize() {
        const clientWidth = this.elementRef.nativeElement.clientWidth;
        const zoomByWidth = clientWidth / (this.width + 50);
        this.zoom = zoomByWidth;
        this.opacity = 1;
        this.changeDetectorRef.markForCheck();
    }

}
