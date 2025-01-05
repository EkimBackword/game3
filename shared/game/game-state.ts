import {
  GameActionResultEvent,
  GameActionsEvent,
  GameActionsMove,
  GameActionsUndo,
} from './game-actions';
import { GamePhaseName } from './game-constants';
import { GameContext } from './game-context';

export interface GameState<
    GameType extends Record<string, any> = any,
> {
    stateId: number;
    prevStateId?: number;
    game: GameType;
    context: GameContext;
    log: GameLogEntry[];
}

export interface GameStateChangeWithSuccessWithSave<
    GameType extends Record<string, any> = Record<string, any>,
> {
    success: true;
    saveState: true;
    state: GameState<GameType>;
}

export interface GameStateChangeWithSuccessWithoutSave {
    success: true;
    saveState: false;
}

export type GameStateChangeWithSuccess<
    GameType extends Record<string, any> = Record<string, any>,
> = GameStateChangeWithSuccessWithSave<GameType> | GameStateChangeWithSuccessWithoutSave

export interface GameStateChangeWithError<
    GameType extends Record<string, any> = Record<string, any>,
> {
    state: GameState<GameType> | null;
    success: false;
    error: string;
}

export type GameStateChangeResult<
    GameType extends Record<string, any> = Record<string, any>,
> = GameStateChangeWithSuccess<GameType> | GameStateChangeWithError<GameType>;

export interface GameLogEntry {
    stateId: number;
    action:
        | ReturnType<typeof GameActionsMove>
        | ReturnType<typeof GameActionsEvent>
        | ReturnType<typeof GameActionResultEvent>
        | ReturnType<typeof GameActionsUndo>;
    turn: number;
    phase: GamePhaseName | null;
    createdAt: string;
    automatic?: boolean;
}