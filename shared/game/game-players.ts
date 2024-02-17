import { SocketUser } from '../socket.types';
import {
  GamePlayerId,
  GameStageName,
} from './game-constants';
import { GameContext } from './game-context';

export interface GamePlayer extends SocketUser {
    online: boolean;
}

export interface GamePlayerMovesCounter {
    numMoves: number;
    maxMoves?: number;
    minMoves?: number;
}

export interface GameActivePlayer extends GamePlayerMovesCounter {
    stage: GameStageName;
    isFinished: boolean;
}

export type GamePlayers = Record<GamePlayerId, GamePlayer>;
export type GameActivePlayers = Record<GamePlayerId, GameActivePlayer>;

export interface ActivePlayersArg {
    currentPlayer?: StageArg;
    others?: StageArg;
    all?: StageArg;
    value?: Record<string, StageArg>;
    nextIndex?: number;
};

export interface StageArg {
    stage?: GameStageName;
    isFinished?: boolean;
    minMoves?: (context: GameContext) => number;
    maxMoves?: (context: GameContext) => number;
};