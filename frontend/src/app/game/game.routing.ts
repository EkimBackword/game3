import {
    RouterModule,
    Routes,
} from '@angular/router';

import { GameRouteEnum } from '../game.routing.enum';
import {
    canActivate,
    canActivateChild,
} from '../session/session.guard';
import { ClankComponent } from './clank/clank.component';
import { FindGameComponent } from './find-game/find-game.component';
import { GameComponent } from './game.component';
import { HelpComponent } from './help/help.component';
import { MenuComponent } from './menu/menu.component';
import { NewGameComponent } from './new-game/new-game.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
    {
        path: '',
        component: GameComponent,
        canActivate: [canActivate],
        canActivateChild: [canActivateChild],
        children: [
            {
                path: GameRouteEnum.Menu,
                component: MenuComponent,
            },
            {
                path: GameRouteEnum.NewGame,
                component: NewGameComponent,
            },
            {
                path: GameRouteEnum.FindGame,
                component: FindGameComponent,
            },
            {
                path: `${GameRouteEnum.Clank}/:id`,
                component: ClankComponent,
            },
            {
                path: GameRouteEnum.Settings,
                component: SettingsComponent,
            },
            {
                path: GameRouteEnum.Help,
                component: HelpComponent,
            },
        ],
    },
];

export const GameRoutes = RouterModule.forChild(routes);
