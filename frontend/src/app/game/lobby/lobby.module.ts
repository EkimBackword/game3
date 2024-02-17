import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';

import { LobbySearchComponent } from './lobby-search/lobby-search.component';
import { LobbySettingsComponent } from './lobby-settings/lobby-settings.component';
import { LobbyComponent } from './lobby.component';
import { LobbyRoutes } from './lobby.routing';
import { LobbyGamesStoreService } from './services/lobby-games-store.service';
import { LobbyService } from './services/lobby.service';

@NgModule({
    declarations: [
        LobbyComponent,
        LobbySearchComponent,
        LobbySettingsComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(LobbyRoutes),
    ],
    providers: [
        LobbyService,
        LobbyGamesStoreService,
    ]
})
export class LobbyModule {}
