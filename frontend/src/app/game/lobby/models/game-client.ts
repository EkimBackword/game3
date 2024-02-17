import {
    computed,
    inject,
    signal,
} from '@angular/core';

import * as lodash from 'lodash';

import {
    GameActionsEnum,
    GameActionsEvent,
} from '@shared/game/game-actions';
import { GamePlayerId } from '@shared/game/game-constants';
import { EventNames } from '@shared/game/game-events';
import { GameFlowEventsHandlers } from '@shared/game/game-flow-events';
import { GameMovePayload } from '@shared/game/game-move';
import { GamePlayer } from '@shared/game/game-players';
import {
    GameLogEntry,
    GameState,
    GameStateChangeResult,
    GameStateChangeWithError,
    GameStateChangeWithSuccess,
} from '@shared/game/game-state';
import { LobbyGame } from '@shared/lobby/lobby-game';

import { LobbyGamesStoreService } from '../services/lobby-games-store.service';
import { gameLogger } from './game-logger';
import { LobbyGamesIdEnum } from './lobby-games.enum';

export class GameClient<
    GameType extends Record<string, any> = Record<string, any>,
    SetupData extends Record<string, any> = Record<string, any>,
> {

    private lobbyGamesStoreService = inject(LobbyGamesStoreService);

    id = signal<LobbyGamesIdEnum | null>(null);
    setupData = signal<SetupData | null>(null);
    players = signal<Map<GamePlayerId, GamePlayer>>(new Map());
    state = signal<GameState<GameType> | null>(null);
    log = signal<GameLogEntry[]>([]);

    builder = computed(() => {
        const id = this.id();
        return id != null
            ? this.lobbyGamesStoreService.getGameBuilder(id)
            : null;
    });

    setupDataSettings = computed(() => {
        const id = this.id();
        return id != null
            ? this.lobbyGamesStoreService.getSetupDataSettings(id)
            : null;
    });

    flow = computed(() => {
        const id = this.id();
        return id != null
            ? this.lobbyGamesStoreService.getFlow(id)
            : null;
    });

    constructor(
    ) {
    }

    gameChanged(game: LobbyGame<GameType, SetupData>) {
        this.id.set(game.id);
        this.setupData.set(game.setupData);
        this.players.set(new Map(Object.entries(game.players)));
        this.state.set(game.state);
        this.log.set(game.log);
    }

    getPath() {
        const id = this.id();

        return id != null
            ? this.lobbyGamesStoreService.getPath(id)
            : null;
    }

    getInitGameState() {
        const gameFlow = this.flow();
        if (gameFlow == null) {
            console.warn(`Game flow not found game`);
            return null;
        }
        const setupData = this.setupData();
        const players = [...this.players().values()];
        return gameFlow.getInitGameState(setupData, players);
    }

    async makeMove(payload: GameMovePayload): Promise<GameStateChangeResult<GameType>> {
        const validity = this.validateAction({
            actionName: payload.type,
            actionType: GameActionsEnum.MAKE_MOVE,
            playerId: payload.playerId,
        });

        if (!validity.success || !validity.saveState) {
            return validity;
        }

        const result = await validity.flow.processMove({
            state: validity.state,
            payload,
        });
        return this.CheckResult(result);
    }

    makeEvent<Ev extends EventNames<GameFlowEventsHandlers>>(
        payload: Parameters<typeof GameActionsEvent<Ev>>['0'],
    ): GameStateChangeResult<GameType> {
        const validity = this.validateAction({
            actionName: payload.type,
            actionType: GameActionsEnum.GAME_EVENT,
            playerId: payload.playerId,
        });

        if (!validity.success || !validity.saveState) {
            return validity;
        }

        const result = validity.flow.processEvent({
            state: validity.state,
            payload,
        });
        return this.CheckResult(result);
    }

    private validateAction({
        actionName,
        actionType,
        playerId
    }: {
        actionName: string;
        actionType: GameActionsEnum;
        playerId?: GamePlayerId;
    }) {
        const oldState = this.state();

        if (oldState == null) {
            return this.WithError(oldState, `state not found`);
        }

        const flow = this.flow();
        if (flow == null) {
            return this.WithError(oldState, `flow not found`);
        }

        if (oldState.context.gameover == true) {
            return this.WithError(oldState, `cannot call ${actionType} after game end`);
        }

        if (
            playerId != null &&
            !flow.isPlayerActive(oldState.game, oldState.context, playerId)
        ) {
            return this.WithError(oldState, `disallowed ${actionType}: ${actionName}`);
        }

        const result: GameStateChangeWithSuccess<GameType> = {
            success: true,
            saveState: true,
            state: {
                ...lodash.cloneDeep(oldState),
                log: [],
            },
        };
        return {
            ...result,
            flow,
        };
    }

    private WithError(state: GameState<GameType> | null, error: string) {
        gameLogger.error(error);
        const result: GameStateChangeWithError<GameType> = {
            state,
            success: false,
            error,
        };
        return result;
    }

    private CheckResult(data: GameStateChangeResult<GameType>) {
        if (!data.success || !data.saveState) {
            return data;
        }
        const result: GameStateChangeWithSuccess<GameType> = {
            success: true,
            saveState: true,
            state: {
                ...data.state,
                prevStateId: data.state.stateId,
                stateId: data.state.stateId + 1,
            },
        };
        return result;

    }

}
