import { SocketUser } from '../socket.types';

export type LobbyChatMessageId = number;

export interface LobbyChat {
    list: LobbyChatMessage[];
}

export interface LobbyChatMessage {
    id: LobbyChatMessageId;
    sender: SocketUser;
    payload: LobbyChatMessagePayload;
}

export interface LobbyChatMessagePayload {
    message: string;
    replyId?: LobbyChatMessageId;
    createdAt: string;
}