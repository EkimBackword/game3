import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    DestroyRef,
    effect,
    ElementRef,
    HostBinding,
    OnDestroy,
    Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';

import {
    debounceTime,
    fromEvent,
    startWith,
} from 'rxjs';
import { SessionQuery } from 'src/app/session/session.query';
import { recordKeys } from 'src/app/shared/models/shared.types';
import { ToastService } from 'src/app/shared/services/toast.service';

import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { GameInfoStatusIdEnum } from '@shared/clank/clank-game.types';

import { LobbyClient } from '../../../models/lobby-client';
import { LobbyService } from '../../../services/lobby.service';
import { RhBenefitComponent } from '../../components/rh-benefit/rh-benefit.component';
import { RhHeroComponent } from '../../components/rh-hero/rh-hero.component';
import { RhWinnerDialogComponent } from '../../dialogs/rh-winner-dialog/rh-winner-dialog.component';
import {
    RelicHuntersActiveCellInfo,
    RelicHuntersCellInfo,
} from '../../models/cell';
import { RelicHuntersGameBuilder } from '../../models/game-builder';
import { RelicHuntersSetupData } from '../../models/game-setup-data';
import { RelicHuntersGameType } from '../../models/game-type';
import { RelicHuntersMapTaxonomy } from '../../models/map';
import {
    RelicHuntersTileSettings,
    RelicHuntersTileTypeTaxonomy,
} from '../../models/tile';

var tile_position_differences = [
    // odd rows
    [[+1,  0], [+1, -1], [ 0, -1],
     [-1,  0], [ 0, +1], [+1, +1]],
    // even rows
    [[+1,  0], [ 0, -1], [-1, -1],
    [-1,  0], [-1, +1], [ 0, +1]],
]

@Component({
    selector: 'app-rh-map',
    templateUrl: './rh-map.component.html',
    styleUrls: ['./rh-map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class RhMapComponent implements AfterViewInit, OnDestroy {

    client: LobbyClient<RelicHuntersGameType, RelicHuntersSetupData> = this.lobbyService.client;
    builder = this.client.game.builder as Signal<RelicHuntersGameBuilder | null>;

    @HostBinding('style.--map-opacity') opacity = 0;
    @HostBinding('style.--map-zoom') zoom = 0;
    @HostBinding('style.--map-padding.px') padding = RelicHuntersTileSettings.padding;
    @HostBinding('style.--map-width.px') width = 0;
    @HostBinding('style.--map-height.px') height = 0;

    cells = computed(() => {
        const state = this.client.game.state();
        return (state?.game.cells ?? []);
    });

    players = computed(() => {
        const state = this.client.game.state();
        const cells = this.cells();
        const user = this.sessionQuery.getValue();
        const playerMap = state?.game.playerMap ?? {};

        return cells.flatMap(cell => {
            return cell.players.map((playerId, index) => {
                const player = playerMap[playerId];
                const isActive = player.id == state?.context.currentPlayerId;
                const isCurrent = player.id === user.id;
                const result: RhHeroComponent['data'] = {
                    id: playerId,
                    player,
                    cell,
                    index,
                    isActive,
                    isCurrent,
                };
                return result;
            })
        })
    });

    activePlayer = computed(() => {
        const players = this.players();
        return players.find(p => p.isActive);
    });

    usedCellIds = computed(() => {
        const activePlayer = this.activePlayer();
        return activePlayer?.player.usedCellIds ?? [];
    });

    activeCoords = computed(() => {
        const activePlayer = this.activePlayer();


        if (activePlayer == null || !activePlayer.isCurrent) {
            return [];
        }

        var index = activePlayer.cell.position.row % 2;
        const neighbors = tile_position_differences[index].map((diff) => {
            const result: RelicHuntersActiveCellInfo = {
                column: activePlayer.cell.position.column + diff[0],
                row: activePlayer.cell.position.row + diff[1],
                isCurrent: false,
            }
            return result;
        });
        const currentCell: RelicHuntersActiveCellInfo = {
            ...activePlayer.cell.position,
            isCurrent: true,
        };
        return [
            currentCell,
            ...neighbors,
        ]
    });

    icons = {
        help: faQuestionCircle,
    };

    RelicHuntersTileTypeTaxonomy = recordKeys(RelicHuntersTileTypeTaxonomy)
        .map((type) => {
            const size = 60;
            const value = RelicHuntersTileTypeTaxonomy[type];
            const benefits = value.benefits.map(key => {
                const benefit: RhBenefitComponent['data'] = {
                    key,
                    value: 0,
                    size,
                    inlineView: false,
                    hideValue: true,
                };
                return benefit;
            });
            const result = {
                type,
                benefits,
                width: size,
                height: size,
            };
            return result;
        })
        .filter(p => p.benefits.length > 0);

    private winnerDialog: MatDialogRef<RhWinnerDialogComponent, any> | null = null;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private destroyRef: DestroyRef,
        private elementRef: ElementRef,
        private lobbyService: LobbyService,
        private sessionQuery: SessionQuery,
        private toastService: ToastService,
        private matDialog: MatDialog,
    ) {
        effect(() => {
            const state = this.client.game.state();
            if (state?.game.statusId === GameInfoStatusIdEnum.Finished && this.winnerDialog == null) {
                this.winnerDialog = this.matDialog.open<
                    RhWinnerDialogComponent,
                    RhWinnerDialogComponent['data']
                >(
                    RhWinnerDialogComponent,
                    {
                        data: {
                            state,
                        },
                        width: `600px`,
                        disableClose: true,
                    },
                );
                this.winnerDialog.afterClosed().pipe(
                    takeUntilDestroyed(this.destroyRef),
                ).subscribe(() => {
                    this.winnerDialog = null;
                });
            }
            if (state?.game.mapId == null) {
                this.height = 0;
                return;
            }
            const map = RelicHuntersMapTaxonomy[state.game.mapId];
            if (map == null) {
                this.height = 0;
                return;
            }
            this.width = map.columnCount * RelicHuntersTileSettings.columnStep
                + RelicHuntersTileSettings.columnOffset
                + RelicHuntersTileSettings.padding * 2

            const rowsCount = map.levels.reduce((count, level) => {
                return count + level.rows.length;
            }, 0);
            this.height = rowsCount * RelicHuntersTileSettings.rowStep
                + RelicHuntersTileSettings.padding * 2;

            this.onResize();
        })
    }

    ngAfterViewInit() {
        fromEvent(window, 'resize').pipe(
            startWith(null),
            debounceTime(0),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe(() => this.onResize());
    }

    ngOnDestroy(): void {
        this.winnerDialog?.close();
    }

    async clickOnCell(cell: RelicHuntersCellInfo) {
        const builder = this.builder();
        const user = this.sessionQuery.getValue();
        const players = this.players();
        const activePlayer = players.find(p => p.isActive);

        if (builder == null || activePlayer == null || !activePlayer.isCurrent) {
            return;
        }

        const payload = cell.id === activePlayer.cell.id
            ? builder.moves.useResearchPoints.getPayload(
                {
                    cell,
                    player: activePlayer.player,
                },
                user.id,
            )
            : builder.moves.useMovePoints.getPayload(
                {
                    cellFrom: activePlayer.cell,
                    cellTo: cell,
                    player: activePlayer.player,
                },
                user.id,
            );
        const needEndTurn = cell.id === activePlayer.cell.id
            ? cell.relicType != null
            : false;

        const result = await this.client.game.makeMove(payload);
        if (!result.success) {
            this.toastService.showWarn(result.error);
            return;
        }

        if (!result.saveState) {
            return
        }

        if (!needEndTurn || result.state.context.gameover) {
            this.lobbyService.addState(result.state);
            return;
        }

        const endTurnPayload = builder.moves.endTurn.getPayload(
            {
                force: true
            },
            user.id,
        );

        const endTurnResult = await this.client.game.makeMove(
            endTurnPayload,
            result.state,
        );
        if (!endTurnResult.success) {
            this.toastService.showWarn(endTurnResult.error);
            return;
        }

        if (!endTurnResult.saveState) {
            return
        }

        const eventResult = await this.client.game.makeEvent(
            {
                type: 'endTurn',
                args: {
                    force: true,
                }
            },
            endTurnResult.state,
        );

        if (!eventResult.success) {
            this.toastService.showWarn(eventResult.error);
            return;
        }

        if (!eventResult.saveState) {
            return;
        }

        this.lobbyService.addState(eventResult.state);

    }

    trackById(index: number, cell: { id: any }) {
        return cell.id;
    }

    private onResize() {
        const clientWidth = this.elementRef.nativeElement.clientWidth;
        const zoomByWidth = clientWidth / (this.width + 50);
        this.zoom = zoomByWidth;
        this.opacity = 1;
        this.changeDetectorRef.markForCheck();
    }

}
