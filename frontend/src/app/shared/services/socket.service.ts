import { Injectable } from '@angular/core';

import {
    Manager,
    Socket,
} from 'socket.io-client';
import { SessionQuery } from 'src/app/session/session.query';
import { environment } from 'src/environments/environment';

import {
    ClientToServerEvents,
    ServerToClientEvents,
} from '@shared/socket.types';

export type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

@Injectable({
    providedIn: 'root',
})
export class SocketService {

    private manager = new Manager(`${environment.socketPrefix}://${location.hostname}:${environment.socketPort}`);
    socket: GameSocket = this.manager.socket('/');

    constructor(
        private sessionQuery: SessionQuery,
    ) { }

    getGameSocket(gameId: string): GameSocket {
        return this.manager.socket(`/clank-${gameId}`, {
            auth: this.sessionQuery.getValue(),
        });
    }

}
