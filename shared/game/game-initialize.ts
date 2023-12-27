import { LobbyGame } from '../lobby/lobby-game';
import { GameConfig } from './game-config';
import { GameContext } from './game-context';
import { GameState } from './game-state';

export function GameInitialize<
    GameType = any,
    SetupData = any
>({
    game,
    context,
    setupData,
}: {
    game: GameConfig<GameType, SetupData>;
    context: GameContext;
    setupData: SetupData;
}) {
    const initial: GameState<GameType> = {
        id: 0,
        game: game.setup(context, setupData),
        context,
    };
    const result: LobbyGame<GameType, SetupData> = {
        id: game.id,
        setupData,
        state: initial,
        log: [],
    };
    return result;
}