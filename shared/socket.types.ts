import { GameInfoState } from './clank/clank-game.types';
import { GamePlayerId } from './game/game-constants';
import { GameState } from './game/game-state';
import {
  Lobby,
  LobbyConfigShort,
} from './lobby/lobby';
import {
  LobbyChatMessage,
  LobbyChatMessagePayload,
} from './lobby/lobby-chat';
import { LobbyGame } from './lobby/lobby-game';
import { LobbyStatistic } from './lobby/lobby-statistics';
import { SimiloGameInfoState } from './similo/similo-game.types';

export enum SocketErrorTypeEnum {
    gameNotFound,
}

export interface ServerToClientEvents {
    gameListChanged: (list: GameInfoState[]) => void;
    similoTablesChanged: (list: SimiloGameInfoState[]) => void;
    lobbyStoreChanged: (list: Lobby[]) => void;
    error: (message: string, type: SocketErrorTypeEnum) => void;
}

export interface ClientToServerEvents {
    setUserInfo: (user: SocketUser) => void;
    addGame: (game: GameInfoState) => void;
    addSimiloTable: (game: SimiloGameInfoState) => void;
    addLobby: (config: LobbyConfigShort) => void;
}

export interface ClankServerToClientEvents {
    /** share */
    gameListChanged: (list: GameInfoState[]) => void;
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
    gameListChanged: (list: SimiloGameInfoState[]) => void;
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

export interface LobbyServerToClientEvents {
    usersChanged: (users: SocketUser[]) => void;
    messageSended: (message: LobbyChatMessage) => void;
    statisticsChanged: (statistics: LobbyStatistic[]) => void;
    gameChanged: (game: LobbyGame) => void;
    gameStateChanged: (state: GameState) => void;
    userKicked: (userId: string) => void;
    error: (message: string, type: SocketErrorTypeEnum) => void;
}

export interface LobbyClientToServerEvents {
    sendMessage: (payload: LobbyChatMessagePayload) => void;
    addStatistics: (statistic: LobbyStatistic) => void;
    changeGame: (game: LobbyGame) => void;
    addState: (state: GameState) => void;
    kickUser: (userId: string) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    user: SocketUser;
}

export interface SocketUser {
    id: GamePlayerId;
    name: string;
}
