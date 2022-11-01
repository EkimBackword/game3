import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';

import { SessionQuery } from './session.query';

@Injectable({
    providedIn: 'root',
})
export class SessionGuard implements CanActivate, CanActivateChild {

    constructor(
        private sessionQuery: SessionQuery,
        private router: Router,
    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ) {
        const url: string = state.url;
        return this.checkLogin(url);
    }

    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ) {
        return this.canActivate(route, state);
    }

    private checkLogin(url: string): true|UrlTree {
        if (this.sessionQuery.isLoggedIn) {
            return true;
        }

        // Store the attempted URL for redirecting
        this.sessionQuery.redirectUrl = url;

        // Redirect to the login page
        return this.router.parseUrl('/login');
      }

}
