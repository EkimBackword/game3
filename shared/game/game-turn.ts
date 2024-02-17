import { GamePlayerId } from './game-constants';
import {
  GameOptions,
  GameOptionsWithPlayerId,
} from './game-options';
import { ActivePlayersArg } from './game-players';
import { StageConfig } from './game-stage';

export interface TurnConfig<
    GameType extends Record<string, any> = Record<string, any>,
> {
    activePlayers?: ActivePlayersArg[];
    minMoves?: number; // TODO: проверить нужны ли тут ограничения?
    maxMoves?: number; // TODO: проверить нужны ли тут ограничения?
    stages: Record<string, StageConfig<GameType>>;
    order?: TurnOrderConfig<GameType>;
    onBegin?: (options: GameOptions<GameType>) => GameType;
    onEnd?: (options: GameOptions<GameType>) => GameType;
    endIf?: (options: GameOptions<GameType>) => boolean | { next: GamePlayerId };
    onMove?: (options: GameOptionsWithPlayerId<GameType>) => GameType;
}

export interface TurnOrderConfig<
	GameType extends Record<string, any> = Record<string, any>,
> {
    first: (options: GameOptions<GameType>) => number;
    next: (options: GameOptions<GameType>) => number;
    playerIdsOrder?: (options: GameOptions<GameType>) => string[];
}

const TurnOrderDefaultNext: TurnOrderConfig['next'] = ({ context }: GameOptions) => {
	return (context.playerIdsOrderPosition + 1) % context.playerIdsOrder.length;
};

const TurnOrderDefaultFirst: TurnOrderConfig['first'] = (options: GameOptions) => {
	const { context } = options;
	return context.turn === 0
		? context.playerIdsOrderPosition
		: TurnOrderDefaultNext(options);
};

export const TurnOrderDefault: TurnOrderConfig = {
	first: TurnOrderDefaultFirst,
	next: TurnOrderDefaultNext,
};
