import { signal } from '@angular/core';

import {
    LobbyChat,
    LobbyChatMessage,
} from '@shared/lobby/lobby-chat';

export class ChatClient {

    list = signal<LobbyChatMessage[]>([]);

    constructor(
    ) {
    }

    init(chat: LobbyChat) {
        this.list.set(chat.list);
    }

    messageSended(message: LobbyChatMessage) {
        this.list.update(list => [
            ...list,
            message,
        ]);
    }

}
