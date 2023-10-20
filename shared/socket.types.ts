import { GameInfoState } from './clank/clank-game.types';
import { SimiloGameInfoState } from './similo/similo-game.types';

export enum SocketErrorTypeEnum {
    gameNotFound,
}

export interface ServerToClientEvents {
    gameListChanged: (list: GameInfoState[]) => void
    similoTablesChanged: (list: SimiloGameInfoState[]) => void
    error: (message: string, type: SocketErrorTypeEnum) => void;
}

export interface ClientToServerEvents {
    addGame: (game: GameInfoState) => void;
    addSimiloTable: (game: SimiloGameInfoState) => void;
}

export interface ClankServerToClientEvents {
    /** share */
    gameListChanged: (list: GameInfoState[]) => void
    /** game room */
    gameUpdated: (state: GameInfoState) => void;
    /** game room */
    userKicked: (userId: string) => void;
    error: (message: string, type: SocketErrorTypeEnum) => void;
}

export interface ClankClientToServerEvents {
    addGame: (game: GameInfoState) => void;
    updateGame: (state: GameInfoState) => void;
    cancelState: (state: GameInfoState) => void;
    kickUser: (userId: string) => void;
}

export interface SimiloServerToClientEvents {
    /** share */
    gameListChanged: (list: SimiloGameInfoState[]) => void
    /** game room */
    gameUpdated: (state: SimiloGameInfoState) => void;
    /** game room */
    userKicked: (userId: string) => void;
    error: (message: string, type: SocketErrorTypeEnum) => void;
}

export interface SimiloClientToServerEvents {
    updateGame: (state: SimiloGameInfoState) => void;
    kickUser: (userId: string) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    user: SocketUser;
}

export interface SocketUser {
    id: string;
    name: string;
}
