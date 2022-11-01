import { Injectable } from '@angular/core';

import {
    Store,
    StoreConfig,
} from '@datorama/akita';

import {
    createInitialSessionState,
    getEmptySessionState,
    LoginFormValue,
    SESSION_KEY,
    SessionState,
    uuidv4,
} from './session.model';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'session' })
export class SessionStore extends Store<SessionState> {

    constructor() {
        super(createInitialSessionState());
    }

    login(data: LoginFormValue) {
        const session: SessionState = {
            id: uuidv4(),
            name: data.login,
            token: uuidv4(),
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        this.update(session);
    }

    logout() {
        localStorage.removeItem(SESSION_KEY);
        this.update(getEmptySessionState());
    }

}
