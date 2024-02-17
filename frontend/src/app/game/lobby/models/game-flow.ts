import { getCurrentTime } from 'src/app/shared/models/game.types';

import { GameActionsEvent } from '@shared/game/game-actions';
import { GameConfig } from '@shared/game/game-config';
import {
    GamePhaseName,
    GamePlayerId,
} from '@shared/game/game-constants';
import { GameContext } from '@shared/game/game-context';
import { EventNames } from '@shared/game/game-events';
import {
    GameFlowChainItem,
    GameFlowEventOptions,
    GameFlowEvents,
    GameFlowEventsHandlers,
    GameFlowUpdatePhaseOptions,
    GameFlowUpdateStageOptions,
    GameFlowUpdateTurnOptions,
} from '@shared/game/game-flow-events';
import {
    GameMove,
    GameMovePayload,
} from '@shared/game/game-move';
import { GamePhaseConfig } from '@shared/game/game-phase';
import {
    ActivePlayersArg,
    GamePlayer,
    StageArg,
} from '@shared/game/game-players';
import {
    GameLogEntry,
    GameState,
    GameStateChangeResult,
    GameStateChangeWithError,
    GameStateChangeWithSuccess,
} from '@shared/game/game-state';
import {
    TurnConfig,
    TurnOrderDefault,
} from '@shared/game/game-turn';

import { gameLogger } from './game-logger';

export class GameFlow<
    GameType extends Record<string, any> = Record<string, any>,
    SetupData extends Record<string, any> = Record<string, any>,
> implements GameFlowEvents<GameType> {

    private eventHandlers: GameFlowEventsHandlers<GameType> = {
        startGame: (state, arg?, playerId?) => {
            return this.Process(state, [{
                name: 'StartGame',
                args: {},
            }]);
        },
        setActivePlayers: (state, arg, playerId?) => {
            return this.Process(state, [{
                name: 'UpdateActivePlayers',
                args: {
                    arg,
                },
            }]);
        },
        endGame: (state, arg?, playerId?) => {
            return this.Process(state, [{
                name: 'EndGame',
                args: {
                    turn: state.context.turn,
                    phase: state.context.phase,
                }
            }]);
        },
        endPhase: (state, arg?, playerId?) => {
            return this.Process(state, [{
                name: 'EndPhase',
                args: {
                    phase: state.context.phase,
                    turn: state.context.turn,
                    arg, // for setPhase
                },
            }]);
        },
        endTurn: (state, arg, playerId?) => {
            return this.Process(state, [{
                name: 'EndTurn',
                args: {
                    turn: state.context.turn,
                    phase: state.context.phase,
                    arg,
                }
            }]);
        },
        endStage: (state, arg?, playerId?) => {
            return this.Process(state, [{
                name: 'EndStage',
                args: {
                    playerId,
                    arg, // for setStage
                },
            }]);
        },
    };

    constructor(
        private config: GameConfig<GameType, SetupData>,
    ) {
    }

    getInitContext(players: GamePlayer[]) {
        const phases = this.config.phases;
        const phasesNames = Object.keys(phases);
        const startingPhaseName = phasesNames.find(key => phases[key].isStart) ?? null;
        const playerIdsOrderPosition = 0;
        const context: GameContext = {
            playerCount: players.length,
            turn: 0,
            currentPlayerId: players[playerIdsOrderPosition].id,
            playerIdsOrder: players.map((p) => p.id),
            playerIdsOrderPosition,
            phase: startingPhaseName,
            allPlayers: null,
            activePlayers: null,
            _nextActivePlayersIndex: null,
            gameover: false,
        };
        return context;
    }

    getInitGameState(
        setupData: SetupData,
        players: GamePlayer[],
    ): GameState<GameType> {
        const context = this.getInitContext(players);
        const game = this.config.setup(context, setupData);
        const state: GameState<GameType> = {
            stateId: 0,
            game,
            context,
            log: [],
        };
        const result = this.eventHandlers.startGame(state);
        if (!result.success || !result.saveState) {
            return state;
        }
        return result.state;
    }

    isPlayerActive(game: GameType, context: GameContext, playerId: GamePlayerId): boolean {
        if (context.activePlayers) {
            return playerId in context.activePlayers;
        }
        return context.currentPlayerId === playerId;
    }

    async processMove({
        state,
        payload,
    }: {
        state: GameState<GameType>;
        payload: GameMovePayload,
    }): Promise<GameStateChangeResult<GameType>> {
        if (payload.playerId == null) {
            return this.WithError(state, 'playerId not found');
        }

        const move = this.getMove(state.context, payload.type, payload.playerId);

        if (move === null) {
            return this.WithError(state, `disallowed move: ${payload.type}`);
        }

        const moveResult = await move.callback(
            {
                game: state.game,
                context: state.context,
                playerId: payload.playerId ?? state.context.currentPlayerId,
            },
            payload.args
        );

        if (!moveResult.success) {
            const moveText = `invalid move: ${payload.type}`;
            const argsText = `args: ${JSON.stringify(payload.args)}`;
            const message = `message: ${moveResult.message}`;
            return this.WithError(state, [
                moveText,
                argsText,
                message,
            ].join('; '));
        }

        if (!moveResult.saveState) {
            return this.WithoutSave();
        }

        state = {
            ...state,
            game: moveResult.game,
        };

        const shouldCount = move == null || move.noLimit !== true;
        if (shouldCount) {
            if (state.context.allPlayers != null) {
                state.context.allPlayers.numMoves++;
            }
            if (state.context.activePlayers != null) {
                state.context.activePlayers[payload.playerId].numMoves++;
            }
        }

        const activePlayer = state.context.activePlayers?.[payload.playerId];

        if (
            activePlayer?.maxMoves != null &&
            activePlayer.numMoves >= activePlayer.maxMoves
        ) {
            const result = this.EndStage(
                state,
                {
                    playerId: payload.playerId,
                    automatic: true,
                }
            );

            if (!result.success || !result.saveState) {
                return result;
            }

            state = result.state
        }

        const phaseConfig = this.GetPhase(state.context);
        if (phaseConfig != null) {
            const game = phaseConfig.turn.onMove?.({
                ...state,
                playerId: payload.playerId,
            }) ?? state.game;
            state = { ...state, game };
        }

        return this.Process(state, [{
            name: 'OnMove',
            args: {},
        }]);
    }

    processEvent<Ev extends EventNames<GameFlowEventsHandlers>>(options: {
        state: GameState<GameType>,
        payload: Parameters<typeof GameActionsEvent<Ev>>['0'],
    }): GameStateChangeResult<GameType> {
        const { state, payload } = options;
        const { type, args, playerId } = payload;
        if (typeof this.eventHandlers[type] !== 'function') {
            return this.WithError(state, `not found: ${type}`);
        }
        return this.eventHandlers[type](
            state,
            args,
            playerId,
        );
    }

    getMove(
        context: GameContext,
        name: string,
        playerId: GamePlayerId
    ): GameMove<GameType> | null {
        const phaseConfig = this.GetPhase(context);
        const stages = phaseConfig?.turn.stages;
        const player = context.activePlayers?.[playerId];
        const playerStage = stages != null && player?.stage != null
            ? stages[player?.stage]
            : null;

        if (playerStage?.moves != null && name in playerStage.moves) {
            return playerStage.moves[name];
        } else if (phaseConfig?.moves != null && name in phaseConfig.moves) {
            return phaseConfig.moves[name];
        } else if (this.config.moves != null && name in this.config.moves) {
            return this.config.moves[name];
        } else {
            return null;
        }
    }

    private GetPhase(context: Pick<GameContext, 'phase'>): GamePhaseConfig<GameType> | null {
        const result = context.phase != null
            ? (this.config.phases?.[context.phase] as GamePhaseConfig<GameType>) ?? null
            : null;
        return result;
    }

    OnMove(
        state: GameState<GameType>,
        options: GameFlowEventOptions<any>,
    ) {
        return this.WithSave({
            ...state,
            game: this.config.onMove?.(state) ?? state.game,
        });
    }

    private Process(
        state: GameState<GameType>,
        events: GameFlowChainItem<GameType>[],
    ): GameStateChangeResult<GameType> {
        const phasesEnded = new Set();
        const turnsEnded = new Set();

        for (let i = 0; i < events.length; i++) {
            const { name, args } = events[i];

            if (name === 'EndPhase') {
                turnsEnded.clear();
                const phase = state.context.phase;
                if (phasesEnded.has(phase)) {
                    const newState = {
                        ...state,
                        context: {
                            ...state.context,
                            phase: null,
                        }
                    };
                    return this.WithSave(newState);
                }
                phasesEnded.add(phase);
            }

            const next: GameFlowChainItem[] = [];
            const options: GameFlowEventOptions = {
                ...args,
                next,
            };
            const result = this[name](state, options);

            if (!result.success || !result.saveState) {
                return result
            }

            state = result.state;

            if (name === 'EndGame') {
                break;
            }

            const shouldEndGame = this.ShouldEndGame(state);
            if (shouldEndGame) {
                events.push({
                    name: 'EndGame',
                    args: {
                        arg: shouldEndGame,
                        turn: state.context.turn,
                        phase: state.context.phase,
                        automatic: true,
                    }
                });
                continue;
            }

            const shouldEndPhase = this.ShouldEndPhase(state);
            if (shouldEndPhase) {
                events.push({
                    name: 'EndPhase',
                    args: {
                        arg: shouldEndPhase,
                        turn: state.context.turn,
                        phase: state.context.phase,
                        automatic: true,
                    }
                });
                continue;
            }

            if (['OnMove', 'UpdateStage', 'UpdateActivePlayers'].includes(name)) {
                const shouldEndTurn = this.ShouldEndTurn(state);
                if (shouldEndTurn) {
                    events.push({
                        name: 'EndTurn',
                        args: {
                            arg: shouldEndTurn,
                            turn: state.context.turn,
                            phase: state.context.phase,
                            automatic: true,
                        }
                    });
                    continue;
                }
            }

            events.push(...next);
        }

        return this.WithSave(state);
    }

    //#region Start

    StartGame(
        state: GameState<GameType>,
        { next }: GameFlowEventOptions<any>,
    ): GameStateChangeResult<GameType> {
        next?.push({
            name: 'StartPhase',
            args: {},
        });
        return this.WithSave(state);
    }

    StartPhase(
        state: GameState<GameType>,
        { next }: GameFlowEventOptions<any>,
    ): GameStateChangeResult<GameType> {
        let { game, context } = state;

        const phaseConfig = this.GetPhase(context);
        if (phaseConfig == null) {
            return context.phase != null
                ? this.WithError(state, `phase not found: ${context.phase}`)
                : this.WithSave(state);
        }

        game = phaseConfig.onBegin?.(state) ?? state.game;

        next?.push({
            name: 'StartTurn',
            args: {},
        });

        return this.WithSave({
            ...state,
            game,
            context
        });
    }

    StartTurn(
        state: GameState<GameType>,
        { currentPlayerId }: GameFlowEventOptions<any>,
    ): GameStateChangeResult<GameType> {
        let { context } = state;

        const phaseConfig = this.GetPhase(context);
        if (phaseConfig == null) {
            return context.phase != null
                ? this.WithError(state, `phase not found: ${context.phase}`)
                : this.WithSave(state);
        }

        if (currentPlayerId) {
            context = { ...context, currentPlayerId };
            if (phaseConfig.turn.activePlayers
                && phaseConfig.turn.activePlayers.length > 0) {
                context = this.SetActivePlayers(context, phaseConfig.turn.activePlayers[0]);
            }
        } else {
            context = this.InitTurnOrderState(state, phaseConfig.turn);
        }

        const turn = context.turn + 1;
        context = {
            ...context,
            turn,
        };

        return this.WithSave({
            ...state,
            game: phaseConfig?.turn.onBegin?.({
                ...state,
                context,
            }) ?? state.game,
            context
        });
    }

    //#endregion Start

    //#region Update

    UpdatePhase(
        state: GameState<GameType>,
        {
            arg,
            next,
            phase,
        }: GameFlowEventOptions<GameFlowUpdatePhaseOptions>,
    ): GameStateChangeResult<GameType> {
        if (phase == null) {
            return this.WithSave(state);
        }

        const phaseConfig = this.GetPhase({ phase });
        if (phaseConfig == null) {
            return phase != null
                ? this.WithError(state, `phase not found: ${phase}`)
                : this.WithSave(state);
        }

        let { context } = state;
        if (arg && arg.next) {
            if (this.config.phases != null && arg.next in this.config.phases) {
                context = { ...context, phase: arg.next };
            } else {
                return this.WithError(state, `invalid phase: ${arg.next}`);
            }
        } else if (phaseConfig.next) {
            context = {
                ...context,
                phase: phaseConfig.next(state),
            };
        } else {
            // TODO: Проверить ситуацию
        }

        next?.push({
            name: 'StartPhase',
            args: {},
        });

        return this.WithSave({
            ...state,
            context
        });
    }

    UpdateTurn(
        state: GameState<GameType>,
        {
            arg,
            currentPlayerId,
            next,
        }: GameFlowEventOptions<GameFlowUpdateTurnOptions>,
    ): GameStateChangeResult<GameType> {
        let { game, context } = state;
        const phaseConfig = this.GetPhase(context);
        if (phaseConfig == null) {
            return context.phase != null
                ? this.WithError(state, `phase not found: ${context.phase}`)
                : this.WithSave(state);
        }

        const newContext = this.UpdateTurnOrderState(
            state,
            currentPlayerId ?? context.currentPlayerId,
            phaseConfig.turn,
            arg,
        );
        context = newContext;


        next?.push({
            name: 'StartTurn',
            args: {
                currentPlayerId: context.currentPlayerId,
            },
        });

        return this.WithSave({
            ...state,
            game,
            context,
        });
    }

    UpdateStage(
        state: GameState<GameType>,
        {
            arg,
            playerId,
        }: GameFlowEventOptions<GameFlowUpdateStageOptions>,
    ): GameStateChangeResult<GameType> {
        if (!playerId) {
            return this.WithError(state, 'playerId not found');
        }

        if (typeof arg !== 'object') {
            return this.WithError(state, `invalid arg: ${JSON.stringify(arg)}`);
        }

        let { context } = state;
        let { activePlayers } = context;

        this.ApplyActivePlayerArgument(
            context,
            activePlayers,
            playerId,
            arg,
        );

        return this.WithSave({
            ...state,
            context: {
                ...context,
                activePlayers,
            },
        });
    }

    UpdateActivePlayers(
        state: GameState<GameType>,
        { arg }: GameFlowEventOptions<ActivePlayersArg>,
    ): GameStateChangeResult<GameType> {
        return arg != null
            ? this.WithSave({
                ...state,
                context: this.SetActivePlayers(state.context, arg)
            })
            : this.WithSave(state);
    }

    //#endregion Update

    //#region End

    EndGame(
        state: GameState<GameType>,
        options: GameFlowEventOptions<any>,
    ): GameStateChangeResult<GameType> {
        const result = this.EndPhase(
            state,
            {
                next: options.next ?? [],
            },
        );


        return result.success && result.saveState
            ? this.WithSave({
                ...result.state,
                game: this.config.onEnd?.(result.state) ?? result.state.game,
                context: {
                    ...result.state.context,
                    gameover: true
                },
            })
            : result;
    }

    EndPhase(
        state: GameState<GameType>,
        options: GameFlowEventOptions<GameFlowUpdatePhaseOptions>,
    ): GameStateChangeResult<GameType> {
        const {
            arg,
            next,
            turn: initialTurn,
            automatic
        } = options;

        const result = this.EndTurn(
            state,
            {
                arg: {
                    force: true,
                },
                turn: initialTurn,
                automatic: true
            },
        );

        if (!result.success) {
            return result;
        }

        const { phase, turn } = state.context;

        next?.push({
            name: 'UpdatePhase',
            args: {
                arg,
                phase,
            },
        });

        const phaseConfig = this.GetPhase(state.context);
        if (phaseConfig == null) {
            return state.context.phase != null
                ? this.WithError(state, `phase not found: ${state.context.phase}`)
                : this.WithSave(state);
        }

        const game = phaseConfig.onEnd?.(state) ?? state.game;

        const action = GameActionsEvent({
            type: 'endPhase',
            args: arg,
        });
        const logEntry: GameLogEntry = this.GetLogEntry({
            action,
            stateId: state.stateId,
            turn,
            phase,
            automatic,
        });

        return this.WithSave({
            ...state,
            game,
            context: {
                ...state.context,
                phase: null,
            },
            log: [
                ...(state.log || []),
                logEntry,
            ]
        });
    }

    EndTurn(
        state: GameState<GameType>,
        options: GameFlowEventOptions<GameFlowUpdateTurnOptions>,
    ): GameStateChangeResult<GameType> {
        const {
            arg,
            next,
            turn: initialTurn,
            automatic,
        } = options;
        const force = arg?.force ?? false

        if (initialTurn !== state.context.turn) {
            return this.WithSave(state);
        }

        const { currentPlayerId, phase, activePlayers, turn } = state.context;

        const playerId = options.playerId ?? currentPlayerId;

        const phaseConfig = this.GetPhase(state.context);
        if (phaseConfig == null) {
            return state.context.phase != null
                ? this.WithError(state, `phase not found: ${state.context.phase}`)
                : this.WithSave(state);
        }

        const currentPlayer = activePlayers?.[playerId];
        if (!force && currentPlayer != null) {
            if (
                currentPlayer.minMoves != null &&
                currentPlayer.numMoves < currentPlayer.minMoves
            ) {
                return this.WithError(state, `cannot end turn before making ${phaseConfig.turn.minMoves} moves`)
            }

            if (
                phaseConfig.turn.minMoves != null &&
                currentPlayer.numMoves < phaseConfig.turn.minMoves
            ) {
                return this.WithError(state, `cannot end turn before making ${phaseConfig.turn.minMoves} moves`)
            }
        }

        const game = phaseConfig.turn.onEnd?.(state) ?? state.game;

        if (next) {
            next.push({
                name: 'UpdateTurn',
                args: {
                    arg,
                    currentPlayerId,
                },
            });
        }

        let context = { ...state.context, activePlayers: null };

        if (arg && arg.remove) {
            const playerIdsOrder = context.playerIdsOrder.filter((id) => id != playerId);

            const playerIdsOrderPosition = context.playerIdsOrderPosition > playerIdsOrder.length - 1
                ? 0
                : context.playerIdsOrderPosition;

            context = { ...context, playerIdsOrder, playerIdsOrderPosition };

            if (playerIdsOrder.length === 0) {
                next?.push({
                    name: 'EndPhase',
                    args: {
                        turn,
                        phase,
                    },
                });
                return this.WithSave(state);
            }
        }

        const action = GameActionsEvent({
            type: 'endTurn',
            args: arg,
        });
        const logEntry: GameLogEntry = this.GetLogEntry({
            action,
            stateId: state.stateId,
            turn,
            phase,
            automatic,
        });

        return this.WithSave({
            ...state,
            game,
            context,
            log: [
                ...(state.log || []),
                logEntry,
            ],
        })
    }

    EndStage(
        state: GameState<GameType>,
        options: GameFlowEventOptions<GameFlowUpdateStageOptions>,
    ): GameStateChangeResult<GameType> {
        const {
            next,
            automatic,
        } = options
        let arg = options.arg;
        const playerId = options.playerId ?? state.context.currentPlayerId;

        let { context, stateId } = state;
        let {
            activePlayers,
            phase,
            turn,
        } = context;

        const phaseConfig = this.GetPhase(context);
        if (phaseConfig == null) {
            return context.phase != null
                ? this.WithError(state, `phase not found: ${context.phase}`)
                : this.WithSave(state);
        }

        if (!arg && activePlayers != null && playerId in activePlayers) {
            const stage = phaseConfig.turn.stages?.[activePlayers[playerId].stage];
            if (stage && stage.next) {
                arg = {
                    stage: stage.next,
                };
            }
        }

        next?.push({
            name: 'UpdateStage',
            args: {
                arg,
                playerId,
            },
        });

        if (activePlayers == null || !(playerId in activePlayers)) {
            return this.WithSave(state);
        }

        const currentPlayer = activePlayers[playerId];
        if (currentPlayer.minMoves != null &&
            currentPlayer.numMoves < currentPlayer.minMoves) {
            return this.WithError(state, `cannot end stage before making ${currentPlayer.minMoves} moves`);
        }

        activePlayers = {
            ...activePlayers,
            [playerId]: {
                ...activePlayers[playerId],
                isFinished: true,
            }
        };

        context = this.UpdateActivePlayersOnceEmpty({
            ...context,
            activePlayers,
        });

        const action = GameActionsEvent({
            type: 'endStage',
            args: arg,
        });
        const logEntry: GameLogEntry = this.GetLogEntry({
            action,
            stateId,
            turn,
            phase,
            automatic,
        });

        return this.WithSave({
            ...state,
            context,
            log: [...(state.log || []), logEntry],
        });
    }
    //#endregion End

    //#region Utils

    private ShouldEndGame(state: GameState<GameType>): boolean {
        return this.config.endIf?.(state) ?? false;
    }

    private ShouldEndPhase(state: GameState<GameType>): boolean | { next: GamePhaseName } {
        const phaseConfig = this.GetPhase(state.context);
        return phaseConfig?.endIf?.(state) ?? false;
    }

    private ShouldEndTurn(state: GameState<GameType>): boolean | { next: GamePlayerId } {
        const phaseConfig = this.GetPhase(state.context);
        if (phaseConfig == null) {
            return false;
        }

        const allPlayersMoves = state.context.allPlayers;
        if (
            allPlayersMoves?.maxMoves != null &&
            allPlayersMoves.numMoves >= allPlayersMoves.maxMoves
        ) {
            return true;
        }

        const currentPlayerId = state.context.currentPlayerId;
        const currentPlayer = state.context.activePlayers?.[currentPlayerId];
        if (currentPlayer != null) {
            if (
                currentPlayer.maxMoves != null &&
                currentPlayer.numMoves >= currentPlayer.maxMoves
            ) {
                return true;
            }

            if (
                phaseConfig.turn.maxMoves &&
                currentPlayer.numMoves >= phaseConfig.turn.maxMoves
            ) {
                return true;
            }
        }

        return state.context.allPlayers != null || state.context.activePlayers != null
            ? phaseConfig.turn.endIf?.(state) ?? false
            : true;
    }

    private getCurrentPlayerId(
        playerIdsOrder: GameContext['playerIdsOrder'],
        playerIdsOrderPosition: GameContext['playerIdsOrderPosition']
    ) {
        return playerIdsOrder[playerIdsOrderPosition];
    }

    private InitTurnOrderState(
        state: GameState<GameType>,
        turn: TurnConfig<GameType>,
    ) {
        let { game, context } = state;
        const options = { game, context };
        const order = turn.order ?? TurnOrderDefault;

        let playerIdsOrder = order.playerIdsOrder != null
            ? order.playerIdsOrder(options)
            : context.playerIdsOrder;

        const playerIdsOrderPosition = order.first(options);
        const posType = typeof playerIdsOrderPosition;
        if (posType !== 'number') {
            gameLogger.error(
                `invalid value returned by turn.order.first — expected number got ${posType} “${playerIdsOrderPosition}”.`
            );
        }
        const currentPlayerId = this.getCurrentPlayerId(playerIdsOrder, playerIdsOrderPosition);

        context = {
            ...context,
            currentPlayerId,
            playerIdsOrderPosition,
            playerIdsOrder,
        };
        context = this.SetActivePlayers(context, turn.activePlayers?.[0] ?? {});

        return context;
    }

    private UpdateTurnOrderState(
        state: GameState<GameType>,
        currentPlayerId: GamePlayerId,
        turn: TurnConfig<GameType>,
        args?: GameFlowUpdateTurnOptions
    ): GameContext {
        const order = turn.order ?? TurnOrderDefault;

        let { game, context } = state;
        let playerIdsOrderPosition = context.playerIdsOrderPosition;

        if (args == null) {
            gameLogger.error(`invalid argument`);
        } else if (args.endTurn !== true) {
            Object.keys(args).forEach((arg) => {
                switch (arg) {
                    case 'remove':
                        currentPlayerId = this.getCurrentPlayerId(context.playerIdsOrder, playerIdsOrderPosition);
                        break;
                    case 'next':
                        if (args.next == null) {
                            break;
                        }
                        playerIdsOrderPosition = context.playerIdsOrder.indexOf(args.next);
                        currentPlayerId = args.next;
                        break;
                    default:
                        gameLogger.error(`invalid argument to endTurn: ${arg}`);
                }
            });
        } else {
            const nextId = order.next({
                game,
                context
            });
            if (nextId != null && typeof nextId !== 'number') {
                gameLogger.error(`invalid value returned by turn.order.next — expected number got ${typeof nextId} “${nextId}”.`);
            }

            playerIdsOrderPosition = nextId;
            currentPlayerId = this.getCurrentPlayerId(context.playerIdsOrder, playerIdsOrderPosition);
        }

        context = {
            ...context,
            playerIdsOrderPosition,
            currentPlayerId,
        };

        return context;
    }

    private ApplyActivePlayerArgument(
        context: GameContext,
        activePlayers: GameContext['activePlayers'],
        playerId: GamePlayerId,
        arg: StageArg
    ) {
        if (arg == null) {
            arg = { };
        }

        if (arg.stage !== undefined) {
            if (activePlayers === null) {
                activePlayers = {};
            }
            activePlayers[playerId] = {
                stage: arg.stage,
                isFinished: arg.isFinished ?? false,
                numMoves: 0,
            };

            if (arg.minMoves) {
                activePlayers[playerId].minMoves = arg.minMoves(context);
            }

            if (arg.maxMoves) {
                activePlayers[playerId].maxMoves = arg.maxMoves(context);
            }
        }
    }

    private SetActivePlayers(
        context: GameContext,
        arg: ActivePlayersArg
    ): GameContext {
        let activePlayers: typeof context.activePlayers = {};
        let allPlayers: typeof context.allPlayers = null;

        const _nextActivePlayersIndex = arg.nextIndex ?? null;

        if (arg.currentPlayer !== undefined) {
            this.ApplyActivePlayerArgument(
                context,
                activePlayers,
                context.currentPlayerId,
                arg.currentPlayer
            );
        }

        if (arg.others !== undefined) {
            for (let i = 0; i < context.playerIdsOrder.length; i++) {
                const id = context.playerIdsOrder[i];
                if (id !== context.currentPlayerId) {
                    this.ApplyActivePlayerArgument(
                        context,
                        activePlayers,
                        id,
                        arg.others
                    );
                }
            }
        }

        if (arg.value) {
            for (const id in arg.value) {
                this.ApplyActivePlayerArgument(
                    context,
                    activePlayers,
                    id,
                    arg.value[id],
                );
            }
        }

        if (arg.all !== undefined) {
            for (let i = 0; i < context.playerIdsOrder.length; i++) {
                const id = context.playerIdsOrder[i];
                this.ApplyActivePlayerArgument(
                    context,
                    activePlayers,
                    id,
                    {
                        stage: arg.all.stage,
                        isFinished: arg.all.isFinished,
                    }
                );
            }

            allPlayers = {
                numMoves: 0,
            }

            if (arg.all.minMoves) {
                allPlayers.minMoves = arg.all.minMoves(context);
            }

            if (arg.all.maxMoves) {
                allPlayers.maxMoves = arg.all.maxMoves(context);
            }
        }

        const result: GameContext = {
            ...context,
            allPlayers,
            activePlayers,
            _nextActivePlayersIndex,
        };
        return result;
    }

    private UpdateActivePlayersOnceEmpty(context: GameContext) {
        let {
            allPlayers,
            activePlayers,
            _nextActivePlayersIndex
        } = context;

        if (activePlayers && !Object.values(activePlayers).some(p => !p.isFinished)) {
            const phaseConfig = this.GetPhase(context);
            const nextActivePlayers = _nextActivePlayersIndex != null
                ? phaseConfig?.turn.activePlayers?.[_nextActivePlayersIndex]
                : null

            if (nextActivePlayers != null) {
                const newContext = this.SetActivePlayers(context, nextActivePlayers);
                allPlayers = newContext.allPlayers;
                activePlayers = newContext.activePlayers;
                _nextActivePlayersIndex = newContext._nextActivePlayersIndex;
            } else {
                allPlayers = null;
                activePlayers = null;
                _nextActivePlayersIndex = null;
            }
        }

        const result: GameContext = {
            ...context,
            allPlayers,
            activePlayers,
            _nextActivePlayersIndex,
        };
        return result;
    }

    private GetLogEntry(data: Omit<GameLogEntry, 'createdAt'>) {
        const logEntry: GameLogEntry = {
            ...data,
            createdAt: getCurrentTime(),
        };
        return logEntry;
    }

    private WithError(state: GameState<GameType> | null, error: string) {
        gameLogger.error(error, { state });
        const result: GameStateChangeWithError<GameType> = {
            success: false,
            state,
            error,
        };
        return result;
    }

    private WithSave(state: GameState<GameType>) {
        const result: GameStateChangeWithSuccess<GameType> = {
            success: true,
            saveState: true,
            state,
        };
        return result;
    }

    private WithoutSave() {
        const result: GameStateChangeWithSuccess<GameType> = {
            success: true,
            saveState: false,
        };
        return result;
    }

    //#endregion Utils


}
