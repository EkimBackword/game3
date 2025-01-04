import { signal } from '@angular/core';

import {
    Lobby,
    LobbyStatusIdEnum,
} from '@shared/lobby/lobby';
import { LobbyStatistic } from '@shared/lobby/lobby-statistics';
import { SocketUser } from '@shared/socket.types';

import { ChatClient } from './chat-client';
import { GameClient } from './game-client';
import { LobbyGameBuilder } from './lobby-games-store';

export class LobbyClient<
    GameType extends Record<string, any> = any,
    SetupData extends Record<string, any> = any,
    LobbyGameBuilderType extends LobbyGameBuilder<GameType, SetupData> = any,
> {

    id = signal<string>('');
    name = signal<string>('');
    adminId = signal<string>('');
    statusId = signal<LobbyStatusIdEnum>(LobbyStatusIdEnum.Lobby);
    users = signal<SocketUser[]>([]);
    statistics = signal<LobbyStatistic[]>([]);
    chat = new ChatClient();
    game = new GameClient<GameType, SetupData, LobbyGameBuilderType>();

    constructor(
    ) {
    }

    connectToLobby(data: Lobby<GameType, SetupData>) {
        this.id.set(data.id);
        this.name.set(data.name);
        this.adminId.set(data.adminId);
        this.statusId.set(data.statusId);
        this.users.set(data.users);
        this.statistics.set(data.statistics);
        this.chat.init(data.chat);
        this.game.gameChanged(data.game);
    }

    statusChanged(statusId: LobbyStatusIdEnum) {
        this.statusId.set(statusId);
    }

    usersChanged(users: SocketUser[]) {
        this.users.set(users);
    }

    statisticsChanged(statistics: LobbyStatistic[]) {
        this.statistics.set(statistics);
    }

}
