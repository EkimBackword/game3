import { GamePlayerId } from './game-constants';
import {
  EventNames,
  EventParams,
} from './game-events';
import { GameFlowEventsHandlers } from './game-flow-events';
import { GameMovePayload } from './game-move';

export enum GameActionsEnum {
    MAKE_MOVE = 'MAKE_MOVE',
    GAME_EVENT = 'GAME_EVENT',
    ACTION_RESULT = 'ACTION_RESULT',
    UNDO = 'UNDO',
}

export const GameActionsMove = (payload: GameMovePayload, result: Record<string, any> | null = null) => {
    return {
        type: GameActionsEnum.MAKE_MOVE as const,
        payload,
        result,
    };
}

export const GameActionsEvent = <Ev extends EventNames<GameFlowEventsHandlers>>(payload: {
    type: Ev,
    args: EventParams<GameFlowEventsHandlers, Ev>['1'],
    playerId?: GamePlayerId,
}) => {
    return {
        type: GameActionsEnum.GAME_EVENT as const,
        payload,
        result: null,
    }
}

export const GameActionsUndo = (
    playerId: GamePlayerId | null
) => {
    return {
        type: GameActionsEnum.UNDO as const,
        payload: {
            type: null,
            args: null,
            playerId,
        },
        result: null,
    }
}

export interface GameActionPayload {
    type: any,
    args: any,
    playerId?: GamePlayerId,
}

export const GameActionResultEvent = (payload: GameActionPayload) => {
    return {
        type: GameActionsEnum.ACTION_RESULT as const,
        payload,
        result: null,
    }
}

export type GameActionResult<
    GameType extends Record<string, any> = Record<string, any>,
> = {
    game: GameType;
    payloads: GameActionPayload[];
};
