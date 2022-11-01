import { FormControl } from '@angular/forms';

export const SESSION_KEY: Readonly<string> = 'session';

export interface SessionState {
    id: string;
    name: string;
    token: string;
}

export function createInitialSessionState(): SessionState {
    const userStr = localStorage.getItem(SESSION_KEY);
    if (userStr != null) {
        return JSON.parse(userStr);
    }
    return getEmptySessionState();
}

export function getEmptySessionState(): SessionState {
    return {
        id: '',
        name: '',
        token: '',
    };
}

export interface LoginFormValue {
    login: string;
}

export type LoginFormFields = Record<keyof LoginFormValue, FormControl>;

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
