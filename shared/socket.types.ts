import { GameInfoState } from './clank/clank-game.types';

export enum SocketErrorTypeEnum {
    gameNotFound,
}

export interface ServerToClientEvents {
    /** share */
    gameListChanged: (list: GameInfoState[]) => void
    /** game room */
    gameUpdated: (state: GameInfoState) => void;
    /** game room */
    userKicked: (userId: string) => void;
    error: (message: string, type: SocketErrorTypeEnum) => void;
}

export interface ClientToServerEvents {
    addGame: (game: GameInfoState) => void;
    updateGame: (state: GameInfoState) => void;
    cancelState: (state: GameInfoState) => void;
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
