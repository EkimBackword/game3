import { SocketUser } from '../socket.types';

export interface LobbyStatistic {
    index: number;
    gameName: string;
    gameDlcName: string;
    winner: SocketUser[];
}