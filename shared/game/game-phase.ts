import { GamePhaseName } from './game-constants';
import { MoveMap } from './game-move';
import { GameOptions } from './game-options';
import { GameState } from './game-state';
import { TurnConfig } from './game-turn';

export interface PhaseMap<GameType = any> {
    [phaseName: GamePhaseName]: PhaseConfig<GameType>;
}

export interface PhaseConfig<GameType = any> {
    start?: boolean;
    next?: ((options: GameOptions<GameType>) => GamePhaseName | void) | GamePhaseName;
    onBegin?: (options: GameOptions<GameType>) => void | GameType;
    onEnd?: (options: GameOptions<GameType>) => void | GameType;
    endIf?: (options: GameOptions<GameType>) => boolean | void | { next: GamePhaseName };
    moves?: MoveMap<GameType>;
    turn?: TurnConfig<GameType>;
    wrapped?: {
        endIf?: (state: GameState<GameType>) => boolean | void | { next: GamePhaseName };
        onBegin?: (state: GameState<GameType>) => void | GameType;
        onEnd?: (state: GameState<GameType>) => void | GameType;
        next?: (state: GameState<GameType>) => GamePhaseName | void;
    };
}