import { GameActions } from './game-actions';
import {
  GameId,
  INVALID_MOVE,
} from './game-constants';
import { GameContext } from './game-context';
import { MoveMap } from './game-move';
import {
  GameOptions,
  GameOptionsWithPlayerId,
} from './game-options';
import { PhaseMap } from './game-phase';
import { GameState } from './game-state';
import { TurnConfig } from './game-turn';

export interface GameConfig<
    GameType = any,
    SetupData = any
> {
    id: GameId;
    name: string;
    minPlayers?: number;
    maxPlayers?: number;
    disableUndo?: boolean;
    setup: (context: GameContext, setupData: SetupData) => GameType;
    validateSetupData?: (setupData: SetupData, numPlayers: number) => string | undefined;
    moves: MoveMap<GameType>;
    phases?: PhaseMap<GameType>;
    turn?: TurnConfig<GameType>;
    events?: {
        endGame?: boolean;
        endPhase?: boolean;
        endTurn?: boolean;
        setPhase?: boolean;
        endStage?: boolean;
        setStage?: boolean;
        pass?: boolean;
        setActivePlayers?: boolean;
    };
    endIf?: (options: GameOptions<GameType>) => any;
    onEnd?: (options: GameOptions<GameType>) => void | GameType;
    playerView?: (options: GameOptionsWithPlayerId<GameType>) => any;
    processMove?: (
        state: GameState<GameType> ,
        action: GameActions.MakeMove
    ) => GameState<GameType> | typeof INVALID_MOVE;
}

/**
 * Creates the initial game state.
 */
// export function InitializeGame({