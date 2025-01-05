import { GameActionResult } from './game-actions';
import { GameId } from './game-constants';
import { GameContext } from './game-context';
import { GameMove } from './game-move';
import { GameOptions } from './game-options';
import { GamePhaseConfig } from './game-phase';

export interface GameConfig<
    GameType extends Record<string, any> = Record<string, any>,
    SetupData extends Record<string, any> = Record<string, any>,
> extends GameConfigCreatorConfig {
  minPlayers?: number;
  maxPlayers?: number;
  disableUndo?: boolean;
  moves?: Record<string, GameMove<GameType>>;
  phases: Record<string, GamePhaseConfig<GameType>>;
  setup: (context: GameContext, setupData: SetupData) => GameActionResult<GameType>;
  validateSetupData?: (setupData: SetupData, numPlayers: number) => string | undefined;
  onMove?: (options: GameOptions<GameType>) => GameActionResult<GameType>;
  endIf?: (options: GameOptions<GameType>) => boolean;
  onEnd?: (options: GameOptions<GameType>) => GameActionResult<GameType>;
}

export interface GameConfigCreatorConfig {
  id: GameId;
  name: string;
}

export class GameConfigCreator<
  GameType extends Record<string, any> = Record<string, any>,
  SetupData extends Record<string, any> = Record<string, any>,
> {

  constructor(
    private config: GameConfigCreatorConfig,
  ) {
  }

  create(config: Omit<GameConfig<GameType, SetupData>, keyof GameConfigCreatorConfig>) {
    const result: GameConfig<GameType, SetupData> = {
      ...this.config,
      ...config,
    }
    return result;
  }

}
