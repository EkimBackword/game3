import { Injectable } from '@angular/core';

import { Query } from '@datorama/akita';

import { SessionState } from './session.model';
import { SessionStore } from './session.store';

@Injectable({ providedIn: 'root' })
export class SessionQuery extends Query<SessionState> {
    allState$ = this.select();

    selectName$ = this.select('name');

    isLoggedIn$ = this.select((state) => !!state.token);

    get isLoggedIn() {
        return !!this.getValue().token;
    }

    // Returns { name, age }
    multiProps$ = this.select(['name']);

    // Returns [name, age]
    multiPropsCallback$ = this.select([
        (state) => state.name,
    ]);

    redirectUrl: string | undefined;

    constructor(protected store: SessionStore) {
        super(store);
    }
}
