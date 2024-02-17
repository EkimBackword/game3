import { SocketUser } from '../socket.types';
import { LobbyChat } from './lobby-chat';
import { LobbyGame } from './lobby-game';
import { LobbyStatistic } from './lobby-statistics';

export interface LobbyConfigShort {
    id: string;
    name: string;
}

export interface LobbyConfig extends LobbyConfigShort {
    admin: SocketUser;
}

export interface Lobby<
    GameType extends Record<string, any> = Record<string, any>,
    SetupData extends Record<string, any> = Record<string, any>,
> extends LobbyConfigShort {
    adminId: string;
    statusId: LobbyStatusIdEnum;
    users: SocketUser[];
    statistics: LobbyStatistic[];
    chat: LobbyChat;
    game: LobbyGame<GameType, SetupData>;
}

export enum LobbyStatusIdEnum {
    Lobby = 1,
    Game = 2,
}

export const LobbyStatusById: Record<LobbyStatusIdEnum, {
    name: string
}> = {
    [LobbyStatusIdEnum.Lobby]: {
        name: 'Лобби',
    },
    [LobbyStatusIdEnum.Game]: {
        name: 'Игра',
    },
}