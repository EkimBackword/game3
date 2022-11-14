import { Injectable } from '@angular/core';

import {
    guid,
    Store,
    StoreConfig,
} from '@datorama/akita';

import {
    createInitialSessionState,
    getEmptySessionState,
    LoginFormValue,
    SESSION_KEY,
    SessionState,
} from './session.model';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'session' })
export class SessionStore extends Store<SessionState> {

    constructor() {
        super(createInitialSessionState());
    }

    login(data: LoginFormValue) {
        const id = guid();
        const session: SessionState = {
            id,
            name: data.login,
            token: id,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        this.update(session);
    }

    logout() {
        localStorage.removeItem(SESSION_KEY);
        this.update(getEmptySessionState());
    }

}
