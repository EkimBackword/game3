import { Injectable } from '@angular/core';
import {
    CanActivate,
    Router,
    UrlTree,
} from '@angular/router';

import { SessionQuery } from '../session.query';

@Injectable({
    providedIn: 'root',
})
export class LoginGuard implements CanActivate {

    constructor(
        private sessionQuery: SessionQuery,
        private router: Router,
    ) {
    }

    canActivate(
    ) {
        return this.checkLogin();
    }

    private checkLogin(): true|UrlTree {
        if (!this.sessionQuery.isLoggedIn) {
            return true;
        }

        // Redirect to URL
        return this.router.parseUrl(this.sessionQuery.redirectUrl ?? '');
      }

}
