import { GamePlayerId } from './game-constants';
import { GameOptionsWithPlayerId } from './game-options';

export type GameMoveFn<
    GameType extends Record<string, any> = Record<string, any>,
    GameMoveArgs extends Record<string, any> = any,
> = (
    options: GameOptionsWithPlayerId<GameType>,
    args: GameMoveArgs,
) => Promise<GameMoveResult<GameType>>;

export interface GameMoveSuccessResultWithoutSave {
    success: true;
    saveState: false;
}

export interface GameMoveSuccessResultWithSave<
    GameType extends Record<string, any> = Record<string, any>,
> {
    success: true;
    saveState: true;
    game: GameType;
    result?: Record<string, any>;
}

export type GameMoveSuccessResult<
    GameType extends Record<string, any> = Record<string, any>,
> = GameMoveSuccessResultWithSave<GameType> | GameMoveSuccessResultWithoutSave;

export interface GameMoveErrorResult {
    success: false;
    message: string;
}

export type GameMoveResult<
    GameType extends Record<string, any> = Record<string, any>,
> = GameMoveSuccessResult<GameType> | GameMoveErrorResult;

export interface GameMove<
    GameType extends Record<string, any> = Record<string, any>,
    GameMoveArgs extends Record<string, any> = any,
> extends GameMoveCreatorConfig {
    callback: GameMoveFn<GameType, GameMoveArgs>;
    undoable?: boolean;
    noLimit?: boolean;
}

export interface GameMovePayload<
    GameMoveArgs extends Record<string, any> = any,
> extends GameMoveCreatorConfig {
    args: GameMoveArgs,
    playerId?: GamePlayerId;
}

export interface GameMoveCreatorConfig {
    /** Техническое название. Например, drawCard */
    type: string,
    /** Название для отображения в интерфесе. Например, Взять карту */
    name: string;
}

export class GameMoveCreator<
    GameType extends Record<string, any> = Record<string, any>,
    GameMoveArgs extends Record<string, any> = any,
> {

    get type() {
        return this.config.type;
    }

    get name() {
        return this.config.name;
    }

    constructor(
        private config: GameMoveCreatorConfig,
    ) {
    }

    getPayload(args: GameMoveArgs, playerId?: GamePlayerId) {
        const result: GameMovePayload<GameMoveArgs> = {
            type: this.config.type,
            name: this.config.name,
            args,
            playerId,
        };
        return result;
    }

    create(config: Omit<GameMove<GameType, GameMoveArgs>, keyof GameMoveCreatorConfig>) {
        const result: GameMove<GameType, GameMoveArgs> = {
            ...this.config,
            ...config,
        };
        return {
            [this.config.type]: result,
        };
    }

}