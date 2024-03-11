import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';

import { EscapeFromAtlantisCellComponent } from './components/escape-from-atlantis-cell/escape-from-atlantis-cell.component';
import { EscapeFromAtlantisGameMeepleComponent } from './components/escape-from-atlantis-game-meeple/escape-from-atlantis-game-meeple.component';
import { EscapeFromAtlantisPlayerMeepleComponent } from './components/escape-from-atlantis-player-meeple/escape-from-atlantis-player-meeple.component';
import { EscapeFromAtlantisTileComponent } from './components/escape-from-atlantis-tile/escape-from-atlantis-tile.component';
import { EscapeFromAtlantisMapComponent } from './layouts/escape-from-atlantis-map/escape-from-atlantis-map.component';
import { EscapeFromAtlantisPlayerComponent } from './layouts/escape-from-atlantis-player/escape-from-atlantis-player.component';
import { EscapeFromAtlantisSettingsComponent } from './layouts/escape-from-atlantis-settings/escape-from-atlantis-settings.component';
import { EscapeFromAtlantisComponent } from './layouts/escape-from-atlantis/escape-from-atlantis.component';
import { EscapeFromAtlantisRoutes } from './utils/escape-from-atlantis.routing';

@NgModule({
    declarations: [

        EscapeFromAtlantisComponent,
        EscapeFromAtlantisSettingsComponent,
        EscapeFromAtlantisMapComponent,
        EscapeFromAtlantisPlayerComponent,
        EscapeFromAtlantisCellComponent,
        EscapeFromAtlantisTileComponent,
        EscapeFromAtlantisPlayerMeepleComponent,
        EscapeFromAtlantisGameMeepleComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(EscapeFromAtlantisRoutes),
    ]
})
export class EscapeFromAtlantisModule {}
