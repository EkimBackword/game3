import { GameActions } from './game-actions';
import { GamePhaseName } from './game-constants';
import { GameContext } from './game-context';

export interface GameState<GameType = any> {
    id: number;
    game: GameType;
    context: GameContext;
}

export interface GameLogEntry {
    stateId: number;
    action:
        | GameActions.MakeMove
        | GameActions.GameEvent
        | GameActions.Undo;
    turn: number;
    phase: GamePhaseName;
}