import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ClankModule } from './clank/clank.module';
import { FindGameComponent } from './find-game/find-game.component';
import { GameComponent } from './game.component';
import { GameRoutes } from './game.routing';
import { HelpComponent } from './help/help.component';
import { MenuComponent } from './menu/menu.component';
import { NewGameComponent } from './new-game/new-game.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
    declarations: [
        GameComponent,
        MenuComponent,
        SettingsComponent,
        HelpComponent,
        NewGameComponent,
        FindGameComponent,
    ],
    imports: [
        SharedModule,
        ClankModule,
        GameRoutes,
    ],
})
export class GameModule { }
