import { INVALID_MOVE } from './game-constants';
import { GameOptionsWithPlayerId } from './game-options';

export type MoveFn<GameType= any> = (
    options: GameOptionsWithPlayerId,
    ...args: any[]
) => GameType | typeof INVALID_MOVE;

export interface Move<GameType = any> {
    callback: MoveFn<GameType>;
    undoable: boolean;
}

export interface MoveMap<GameType = any> {
    [moveName: string]: Move<GameType>;
}