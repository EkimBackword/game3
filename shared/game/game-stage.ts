import { GameStageName } from './game-constants';
import { MoveMap } from './game-move';

export interface StageMap<GameType = any> {
    [stageName: GameStageName]: StageConfig<GameType>;
}

export interface StageConfig<GameType = any> {
    moves?: MoveMap<GameType>;
    next?: GameStageName;
}