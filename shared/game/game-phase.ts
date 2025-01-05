import { GameActionResult } from './game-actions';
import { GamePhaseName } from './game-constants';
import { GameMove } from './game-move';
import { GameOptions } from './game-options';
import { TurnConfig } from './game-turn';

export interface GamePhaseConfig<
    GameType extends Record<string, any> = Record<string, any>,
> extends GamePhaseCreatorConfig {
    isStart?: boolean;
    turn: TurnConfig<GameType>;
    moves?: Record<string, GameMove<GameType>>;
    next?: (options: GameOptions<GameType>) => GamePhaseName;
    onBegin?: (options: GameOptions<GameType>) => GameActionResult<GameType>;
    onEnd?: (options: GameOptions<GameType>) => GameActionResult<GameType>;
    endIf?: (options: GameOptions<GameType>) => boolean | { next: GamePhaseName };
}

export interface GamePhaseCreatorConfig {
    id: string;
    name: string;
}

export class GamePhaseCreator<
    GameType extends Record<string, any> = Record<string, any>,
> {

    get id() {
        return this.config.id;
    }

    constructor(
        private config: GamePhaseCreatorConfig
    ) {
    }

    create(config: Omit<GamePhaseConfig<GameType>, keyof GamePhaseCreatorConfig>) {
        const result: GamePhaseConfig<GameType> = {
            ...this.config,
            ...config,
        };
        return {
            [this.config.id]: result,
        }
    }

}