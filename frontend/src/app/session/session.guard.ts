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

import { SessionQuery } from './session.query';

@Injectable({
    providedIn: 'root',
})
export class SessionGuard {

    constructor(
        private sessionQuery: SessionQuery,
        private router: Router,
    ) {
    }

    checkLogin(url: string): true|UrlTree {
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
