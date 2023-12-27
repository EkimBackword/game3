import { GamePlayerId } from './game-constants';
import { GameContext } from './game-context';

export type GameOptions<GameType = any> = {
    game: GameType;
    context: GameContext;
};

export type GameOptionsWithPlayerId<GameType = any> = GameOptions<GameType> & { playerId: GamePlayerId }

