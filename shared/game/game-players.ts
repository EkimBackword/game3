import { SocketUser } from '../socket.types';
import {
  GamePlayerId,
  GameStageName,
} from './game-constants';

export interface GamePlayer extends SocketUser {
    isOnline: boolean;
    stage: GameStageName;
}

export type GameActivePlayers = Record<GamePlayerId, GamePlayer>;

export interface ActivePlayersArg {
    currentPlayer?: StageArg;
    others?: StageArg;
    all?: StageArg;
    value?: Record<string, StageArg>;
    minMoves?: number;
    maxMoves?: number;
    revert?: boolean;
    next?: ActivePlayersArg;
};

export interface StageArg {
    stage?: GameStageName;
    minMoves?: number;
    maxMoves?: number;
};