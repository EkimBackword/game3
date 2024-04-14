import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';

import { RhCardComponent } from './components/rh-card/rh-card.component';
import { RhHeroComponent } from './components/rh-hero/rh-hero.component';
import { RhCellComponent } from './components/rh-cell/rh-cell.component';
import { RhPageComponent } from './layouts/rh-page/rh-page.component';
import { RhMapComponent } from './layouts/rh-map/rh-map.component';
import { RhPlayersComponent } from './layouts/rh-players/rh-players.component';
import { RhSettingsComponent } from './layouts/rh-settings/rh-settings.component';
import { RelicHuntersRoutes } from './utils/relic-hunters.routing';
import { RhBenefitComponent } from './components/rh-benefit/rh-benefit.component';
import { RhEndTurnDialogComponent } from './dialogs/rh-end-turn-dialog/rh-end-turn-dialog.component';
import { RhCardListDialogComponent } from './dialogs/rh-card-list-dialog/rh-card-list-dialog.component';
import { RhRelicComponent } from './components/rh-relic/rh-relic.component';
import { RhWinnerDialogComponent } from './dialogs/rh-winner-dialog/rh-winner-dialog.component';

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
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(RelicHuntersRoutes),
    ]
})
export class RelicHuntersModule {}
