import { GameId } from '../game/game-constants';
import {
  GamePlayerBase,
  GamePlayers,
} from '../game/game-players';
import {
  GameLogEntry,
  GameState,
} from '../game/game-state';

export interface LobbyGameChangeOptions<
    SetupData extends Record<string, any> = any,
> {
    id: GameId | null;
    setupData: SetupData;
}

export interface LobbyJoinToGameOptions<
    SetupData extends Record<string, any> = any,
> {
    player: GamePlayerBase;
    setupData?: SetupData;
}

export interface LobbyGame<
    GameType extends Record<string, any> = any,
    SetupData extends Record<string, any> = any,
> extends LobbyGameChangeOptions<SetupData> {
    players: GamePlayers;
    state: GameState<GameType> | null;
    log: GameLogEntry[];
}
