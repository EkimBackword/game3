import { Routes } from '@angular/router';

import { GameRouteEnum } from 'src/app/game.routing.enum';

import { LobbySearchComponent } from './lobby-search/lobby-search.component';
import { LobbySettingsComponent } from './lobby-settings/lobby-settings.component';
import { LobbyComponent } from './lobby.component';
import {
    LobbyGameResolver,
    LobbyResolver,
    LobbySettingsResolver,
} from './lobby.resolver';

export const LobbyRoutes: Routes = [
    {
        path: `${GameRouteEnum.Search}`,
        component: LobbySearchComponent,
    },
    {
        path: `:id`,
        component: LobbyComponent,
        resolve: {
            lobbyResolver: LobbyResolver,
        },
        children: [
            {
                path: '',
                redirectTo: `${GameRouteEnum.Settings}`,
                pathMatch: 'full'
            },
            {
                path: GameRouteEnum.Settings,
                component: LobbySettingsComponent,
                resolve: {
                    settingsResolver: LobbySettingsResolver,
                }
            },
            {
                path: GameRouteEnum.Similo,
                loadChildren: () => import('./similo-v2/similo-v2.module').then(p => p.SimiloV2Module),
                resolve: {
                    gameResolver: LobbyGameResolver,
                }
            },
            {
                path: GameRouteEnum.EscapeFromAtlantis,
                loadChildren: () => import('./escape-from-atlantis/escape-from-atlantis.module').then(p => p.EscapeFromAtlantisModule),
                resolve: {
                    gameResolver: LobbyGameResolver,
                }
            },
            {
                path: GameRouteEnum.RelicHunters,
                loadChildren: () => import('./relic-hunters/relic-hunters.module').then(p => p.RelicHuntersModule),
                resolve: {
                    gameResolver: LobbyGameResolver,
                }
            },
        ],
    },
];
