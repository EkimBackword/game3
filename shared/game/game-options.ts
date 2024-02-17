import { GamePlayerId } from './game-constants';
import { GameContext } from './game-context';

export type GameOptions<
    GameType extends Record<string, any> = Record<string, any>,
> = {
    game: GameType;
    context: GameContext;
};

export type GameOptionsWithPlayerId<
    GameType extends Record<string, any> = Record<string, any>,
> = GameOptions<GameType> & { playerId: GamePlayerId }

