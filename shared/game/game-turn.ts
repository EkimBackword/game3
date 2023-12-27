import { GamePlayerId } from './game-constants';
import {
  GameOptions,
  GameOptionsWithPlayerId,
} from './game-options';
import { ActivePlayersArg } from './game-players';
import { StageMap } from './game-stage';
import { GameState } from './game-state';

export interface TurnConfig<GameType = any> {
    activePlayers?: ActivePlayersArg;
    minMoves?: number;
    maxMoves?: number;
    onBegin?: (options: GameOptions<GameType>) => void | GameType;
    onEnd?: (options: GameOptions<GameType>) => void | GameType;
    endIf?: (options: GameOptions<GameType>) => boolean | void | { next: string };
    onMove?: (options: GameOptionsWithPlayerId<GameType>) => void | GameType;
    stages?: StageMap<GameType>;
    order?: TurnOrderConfig<GameType>;
    wrapped?: {
        endIf?: (state: GameState<GameType>) => boolean | void | { next: string };
        onBegin?: (state: GameState<GameType>) => void | GameType;
        onEnd?: (state: GameState<GameType>) => void | GameType;
        onMove?: (state: GameState<GameType> & { playerId: GamePlayerId }) => void | GameType;
    };
}

export interface TurnOrderConfig<GameType = any> {
    first: (options: GameOptions<GameType>) => number;
    next: (options: GameOptions<GameType>) => number | undefined;
    playOrder?: (options: GameOptions<GameType>) => string[];
}