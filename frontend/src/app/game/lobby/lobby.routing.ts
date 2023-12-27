import { Routes } from '@angular/router';

import { GameRouteEnum } from 'src/app/game.routing.enum';

import { LobbySearchComponent } from './lobby-search/lobby-search.component';
import { LobbySettingsComponent } from './lobby-settings/lobby-settings.component';
import { LobbyComponent } from './lobby.component';

export const LobbyRoutes: Routes = [
    {
        path: `${GameRouteEnum.Search}`,
        component: LobbySearchComponent,
    },
    {
        path: `:id`,
        component: LobbyComponent,
        children: [
            {
                path: '',
                redirectTo: `${GameRouteEnum.Settings}`,
                pathMatch: 'full'
            },
            {
                path: GameRouteEnum.Settings,
                component: LobbySettingsComponent,
            },
            // {
            //     path: GameRouteEnum.Clank,
            //     component: ClankComponent,
            // },
            // {
            //     path: GameRouteEnum.Similo,
            //     component: SimiloComponent,
            // },
        ],
    },
];
