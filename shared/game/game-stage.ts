import { GameStageName } from './game-constants';
import { GameMove } from './game-move';

export interface StageConfig<
    GameType extends Record<string, any> = Record<string, any>,
> extends GameStageCreatorConfig {
    moves?: Record<string, GameMove<GameType>>
    next?: GameStageName;
}

export interface GameStageCreatorConfig {
    id: string;
    name: string;
}

export class GameStageCreator<
    GameType extends Record<string, any> = Record<string, any>,
> {

    get id() {
        return this.config.id;
    }

    constructor(
        private config: GameStageCreatorConfig,
    ) {
    }

    create(config: Omit<StageConfig<GameType>, keyof GameStageCreatorConfig>) {
        const result: StageConfig<GameType> = {
            ...this.config,
            ...config
        };
        return {
            [this.config.id]: result,
        };
    }

}