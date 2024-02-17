import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    ResolveFn,
    Router,
    RouterStateSnapshot,
} from '@angular/router';

import { GameRouteEnum } from 'src/app/game.routing.enum';

import { LobbyStatusIdEnum } from '@shared/lobby/lobby';

import { LobbyService } from './services/lobby.service';

export const LobbyResolver: ResolveFn<string | null> = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const id = route.paramMap.get('id');
    return id != null
        ? await inject(LobbyService).init(id)
        : null;
}

export const LobbySettingsResolver: ResolveFn<boolean> = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    router = inject(Router),
    lobbyService = inject(LobbyService)
) => {
    const statusId = lobbyService.client.statusId();
    const path = lobbyService.client.game.getPath();

    if (statusId === LobbyStatusIdEnum.Game && path != null) {
        const urls = (route.parent?.pathFromRoot ?? []).flatMap(p => p.url).map(p => p.path);
        return router.navigate([...urls, `${path}`]);
    }

    return true
}

export const LobbyGameResolver: ResolveFn<boolean> = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    router = inject(Router),
    lobbyService = inject(LobbyService)
) => {
    const statusId = lobbyService.client.statusId();
    const path = GameRouteEnum.Settings;

    if (statusId === LobbyStatusIdEnum.Lobby) {
        const urls = (route.parent?.pathFromRoot ?? []).flatMap(p => p.url).map(p => p.path);
        return router.navigate([...urls, `${path}`]);
    }

    return true
}
