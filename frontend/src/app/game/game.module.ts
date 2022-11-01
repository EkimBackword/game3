import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ClankGameInfoComponent } from './clank/clank-game-info/clank-game-info.component';
import { ClankMapElementComponent } from './clank/clank-map-element/clank-map-element.component';
import { ClankMapComponent } from './clank/clank-map/clank-map.component';
import { ClankComponent } from './clank/clank.component';
import { FindGameComponent } from './find-game/find-game.component';
import { GameComponent } from './game.component';
import { GameRoutes } from './game.routing';
import { HelpComponent } from './help/help.component';
import { MenuComponent } from './menu/menu.component';
import { NewGameComponent } from './new-game/new-game.component';
import { SettingsComponent } from './settings/settings.component';
import { ClankPlayerInfoComponent } from './clank/clank-player-info/clank-player-info.component';

@NgModule({
    declarations: [
        GameComponent,
        MenuComponent,
        SettingsComponent,
        HelpComponent,
        NewGameComponent,
        FindGameComponent,
        ClankComponent,
        ClankMapComponent,
        ClankMapElementComponent,
        ClankGameInfoComponent,
        ClankPlayerInfoComponent,
    ],
    imports: [
        GameRoutes,
        SharedModule,
    ],
})
export class GameModule { }
