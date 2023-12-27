import {
    inject,
    Injectable,
} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivateChildFn,
    CanActivateFn,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';

import { SocketUser } from '@shared/socket.types';

import { SocketService } from '../shared/services/socket.service';
import { SessionQuery } from './session.query';

@Injectable({
    providedIn: 'root',
})
export class SessionGuard {

    constructor(
        private sessionQuery: SessionQuery,
        private socketService: SocketService,
        private router: Router,
    ) {
    }

    checkLogin(url: string): true | UrlTree {
        const sessionUser = this.sessionQuery.getValue();
        const user: SocketUser = {
            id: sessionUser.id,
            name: sessionUser.name,
        };
        this.socketService.socket.emit('setUserInfo', user);

        if (this.sessionQuery.isLoggedIn) {
            return true;
        }

        // Store the attempted URL for redirecting
        this.sessionQuery.redirectUrl = url;

        // Redirect to the login page
        return this.router.parseUrl('/login');
      }

}

export const canActivate: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    const sessionGuard = inject(SessionGuard);

    const url: string = state.url;
    return sessionGuard.checkLogin(url);
  };

  export const canActivateChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => canActivate(route, state);
