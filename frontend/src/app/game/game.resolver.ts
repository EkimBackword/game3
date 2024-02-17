import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    ResolveFn,
    RouterStateSnapshot,
} from '@angular/router';

import { GamesService } from '../shared/services/games.service';

export const GamesResolver: ResolveFn<any> = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    gamesService = inject(GamesService),
) => {
    gamesService.init();
    return true;
}
