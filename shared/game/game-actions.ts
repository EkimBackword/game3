import { GamePlayerId } from './game-constants';

export enum GameActionsEnum {
    MAKE_MOVE = 'MAKE_MOVE',
    GAME_EVENT = 'GAME_EVENT',
    UNDO = 'UNDO',
}

export namespace GameActions {

    export const makeMove = (
        type: string,
        args: any,
        playerId: GamePlayerId,
    ) => ({
        type: GameActionsEnum.MAKE_MOVE as const,
        payload: {
            type,
            args,
            playerId,
        },
    });

    export const gameEvent = (
        type: string,
        args: any,
        playerId: GamePlayerId,
    ) => ({
        type: GameActionsEnum.GAME_EVENT as const,
        payload: {
            type,
            args,
            playerId,
        },
    });

    export const undo = (
        playerId: GamePlayerId | null
    ) => ({
        type: GameActionsEnum.UNDO as const,
        payload: {
            type: null,
            args: null,
            playerId,
        },
    });

    export type MakeMove = ReturnType<typeof makeMove>;
    export type GameEvent = ReturnType<typeof gameEvent>;
    export type Undo = ReturnType<typeof undo>;

}