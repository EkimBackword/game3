import { Injectable } from '@angular/core';

import {
    Manager,
    Socket,
} from 'socket.io-client';
import { SessionQuery } from 'src/app/session/session.query';
import { environment } from 'src/environments/environment';

import {
    ClankClientToServerEvents,
    ClankServerToClientEvents,
    ClientToServerEvents,
    LobbyClientToServerEvents,
    LobbyServerToClientEvents,
    ServerToClientEvents,
    SimiloClientToServerEvents,
    SimiloServerToClientEvents,
} from '@shared/socket.types';

export type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
export type ClankGameSocket = Socket<ClankServerToClientEvents, ClankClientToServerEvents>;
export type SimiloGameSocket = Socket<SimiloServerToClientEvents, SimiloClientToServerEvents>;
export type LobbySocket = Socket<LobbyServerToClientEvents, LobbyClientToServerEvents>;

@Injectable({
    providedIn: 'root',
})
export class SocketService {

    private manager = new Manager(`${environment.socketPrefix}://${location.hostname}:${environment.socketPort}`);
    socket: GameSocket = this.manager.socket('/');

    constructor(
        private sessionQuery: SessionQuery,
    ) { }

    getGameSocket(gameId: string): ClankGameSocket {
        return this.manager.socket(`/clank-${gameId}`, {
            auth: this.sessionQuery.getValue(),
        });
    }

    getSimiloGameSocket(gameId: string): SimiloGameSocket {
        return this.manager.socket(`/similo-${gameId}`, {
            auth: this.sessionQuery.getValue(),
        });
    }

    getLobbySocket(gameId: string): LobbySocket {
        return this.manager.socket(`/lobby-${gameId}`, {
            auth: this.sessionQuery.getValue(),
        });
    }

}
