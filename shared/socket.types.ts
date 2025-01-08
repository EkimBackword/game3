import { GameInfoState } from './clank/clank-game.types';
import { GamePlayerId } from './game/game-constants';
import { GameState } from './game/game-state';
import {
  Lobby,
  LobbyConfigShort,
  LobbyStatusIdEnum,
} from './lobby/lobby';
import {
  LobbyChatMessage,
  LobbyChatMessagePayload,
} from './lobby/lobby-chat';
import {
  LobbyGame,
  LobbyGameChangeOptions,
  LobbyJoinToGameOptions,
} from './lobby/lobby-game';
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
    connectToLobby: (lobby: Lobby) => void;
    statusChanged: (statusId: LobbyStatusIdEnum) => void;
    usersChanged: (users: SocketUser[]) => void;
    statisticsChanged: (statistics: LobbyStatistic[]) => void;
    messageSended: (message: LobbyChatMessage) => void;
    gameChanged: (game: LobbyGame) => void;
    userKicked: (userId: string) => void;
    error: (message: string, type: SocketErrorTypeEnum) => void;
}

export interface LobbyClientToServerEvents {
    addStatistics: (statistic: LobbyStatistic) => void;
    sendMessage: (payload: LobbyChatMessagePayload) => void;
    startGame: (game: GameState) => void;
    finishGame: () => void;
    changeGame: (game: LobbyGameChangeOptions) => void;
    changeSetupData: (setupData) => void;
    joinToGame: (data: LobbyJoinToGameOptions) => void;
    leaveFromGame: (data: LobbyJoinToGameOptions) => void;
    addState: (state: GameState) => void;
    undoState: (createdAt: string) => void;
    kickUser: (userId: GamePlayerId, data: LobbyJoinToGameOptions) => void;
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
