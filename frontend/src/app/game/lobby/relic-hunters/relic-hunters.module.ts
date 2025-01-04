import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';

import { RhBenefitComponent } from './components/rh-benefit/rh-benefit.component';
import { RhCardComponent } from './components/rh-card/rh-card.component';
import { RhCellComponent } from './components/rh-cell/rh-cell.component';
import { RhHeroComponent } from './components/rh-hero/rh-hero.component';
import { RhLogsCardComponent } from './components/rh-logs/rh-logs-card/rh-logs-card.component';
import { RhLogsCellComponent } from './components/rh-logs/rh-logs-cell/rh-logs-cell.component';
import { RhLogsEndTurnComponent } from './components/rh-logs/rh-logs-end-turn/rh-logs-end-turn.component';
import { RhLogsGetPointsComponent } from './components/rh-logs/rh-logs-get-points/rh-logs-get-points.component';
import { RhLogsGetTileComponent } from './components/rh-logs/rh-logs-get-tile/rh-logs-get-tile.component';
import { RhLogsUseMovePointsComponent } from './components/rh-logs/rh-logs-use-move-points/rh-logs-use-move-points.component';
import { RhLogsUseResearchPointsComponent } from './components/rh-logs/rh-logs-use-research-points/rh-logs-use-research-points.component';
import { RhLogsComponent } from './components/rh-logs/rh-logs.component';
import { RhRelicComponent } from './components/rh-relic/rh-relic.component';
import { RhTileComponent } from './components/rh-tile/rh-tile.component';
import { RhCardListDialogComponent } from './dialogs/rh-card-list-dialog/rh-card-list-dialog.component';
import { RhEndTurnDialogComponent } from './dialogs/rh-end-turn-dialog/rh-end-turn-dialog.component';
import { RhWinnerDialogComponent } from './dialogs/rh-winner-dialog/rh-winner-dialog.component';
import { RhMapComponent } from './layouts/rh-map/rh-map.component';
import { RhPageComponent } from './layouts/rh-page/rh-page.component';
import { RhPlayersComponent } from './layouts/rh-players/rh-players.component';
import { RhSettingsComponent } from './layouts/rh-settings/rh-settings.component';
import { RhSidebarComponent } from './layouts/rh-sidebar/rh-sidebar.component';
import { RelicHuntersRoutes } from './utils/relic-hunters.routing';

@NgModule({
    declarations: [
        RhPageComponent,
        RhCardComponent,
        RhCellComponent,
        RhHeroComponent,
        RhSettingsComponent,
        RhMapComponent,
        RhPlayersComponent,
        RhBenefitComponent,
        RhEndTurnDialogComponent,
        RhCardListDialogComponent,
        RhRelicComponent,
        RhWinnerDialogComponent,
        RhTileComponent,
        RhLogsComponent,
        RhLogsGetPointsComponent,
        RhLogsGetTileComponent,
        RhLogsUseMovePointsComponent,
        RhLogsUseResearchPointsComponent,
        RhLogsEndTurnComponent,
        RhLogsCardComponent,
        RhLogsCellComponent,
        RhSidebarComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(RelicHuntersRoutes),
    ]
})
export class RelicHuntersModule {}
