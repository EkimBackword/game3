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
    UNDO = 'UNDO',
}

export const GameActionsMove = (payload: GameMovePayload) => {
    return {
        type: GameActionsEnum.MAKE_MOVE as const,
        payload,
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
    }
}
