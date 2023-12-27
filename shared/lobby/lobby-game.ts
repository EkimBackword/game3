import { GameId } from '../game/game-constants';
import {
  GameLogEntry,
  GameState,
} from '../game/game-state';

export interface LobbyGame<
    GameType = any,
    SetupData = any,
> {
    id: GameId;
    setupData: SetupData;
    state: GameState<GameType>;
    log: Array<GameLogEntry>;
}

