import {
  GamePhaseName,
  GamePlayerId,
  GameStageName,
} from './game-constants';
import { GameContext } from './game-context';
import {
  EventNames,
  EventParams,
} from './game-events';
import { ActivePlayersArg } from './game-players';
import {
  GameState,
  GameStateChangeResult,
} from './game-state';

export interface GameFlowUpdatePhaseOptions {
    next: GamePhaseName;
}

export interface GameFlowUpdateTurnOptions {
    next?: GamePlayerId;
    remove?: boolean;
    endTurn?: boolean;
    force?: boolean;
    options?: any;
}

export interface GameFlowUpdateStageOptions {
    next?: GamePlayerId;
    stage?: GameStageName;
    minMoves?: (context: GameContext) => number;
    maxMoves?: (context: GameContext) => number;
}

export interface GameFlowEventOptions<
    ArgType = any,
> {
    arg?: ArgType;
    turn?: GameContext['turn'];
    phase?: GameContext['phase'];
    playerId?: GamePlayerId;
    currentPlayerId?: GamePlayerId;
    automatic?: boolean;
    next?: GameFlowChainItem[];
}

export type GameFlowEventFn<
    GameType extends Record<string, any> = Record<string, any>,
    ArgType = any,
> = (
    state: GameState<GameType>,
    options: GameFlowEventOptions<ArgType>
) => GameStateChangeResult<GameType>;

export interface GameFlowEvents<
    GameType extends Record<string, any> = Record<string, any>,
> {

    OnMove: GameFlowEventFn<GameType, any>;
    StartGame: GameFlowEventFn<GameType, any>;
    StartPhase: GameFlowEventFn<GameType, any>;
    StartTurn: GameFlowEventFn<GameType, any>;
    UpdatePhase: GameFlowEventFn<GameType, GameFlowUpdatePhaseOptions>;
    UpdateTurn: GameFlowEventFn<GameType, GameFlowUpdateTurnOptions>;
    UpdateStage: GameFlowEventFn<GameType, GameFlowUpdateStageOptions>;
    UpdateActivePlayers: GameFlowEventFn<GameType, ActivePlayersArg>;
    EndGame: GameFlowEventFn<GameType, any>;
    EndPhase: GameFlowEventFn<GameType, GameFlowUpdatePhaseOptions>;
    EndTurn: GameFlowEventFn<GameType, GameFlowUpdateTurnOptions>;
    EndStage: GameFlowEventFn<GameType, GameFlowUpdateStageOptions>;

}

export interface GameFlowEventsHandlers<
    GameType extends Record<string, any> = Record<string, any>,
> {
    startGame: (state: GameState<GameType>, arg?: any, playerId?: GamePlayerId) => GameStateChangeResult<GameType>;
    setActivePlayers: (state: GameState<GameType>, arg: ActivePlayersArg, playerId?: GamePlayerId) => GameStateChangeResult<GameType>;
    endGame: (state: GameState<GameType>, arg?: any, playerId?: GamePlayerId) => GameStateChangeResult<GameType>;
    endPhase: (state: GameState<GameType>, arg?: GameFlowUpdatePhaseOptions, playerId?: GamePlayerId) => GameStateChangeResult<GameType>;
    endTurn: (state: GameState<GameType>, arg?: GameFlowUpdateTurnOptions, playerId?: GamePlayerId) => GameStateChangeResult<GameType>;
    endStage: (state: GameState<GameType>, arg?: GameFlowUpdateStageOptions, playerId?: GamePlayerId) => GameStateChangeResult<GameType>;
}

export type GameFlowChainItem<
    GameType extends Record<string, any> = Record<string, any>,
    Ev extends EventNames<GameFlowEvents<GameType>> = EventNames<GameFlowEvents<GameType>>
> = {
    name: Ev;
    args: EventParams<GameFlowEvents, Ev>[1];
}

