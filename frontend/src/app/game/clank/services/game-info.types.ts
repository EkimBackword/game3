import { guid } from '@datorama/akita';
import { initDragonInfo } from '@shared/clank/clank-dragon.types';
import {
    GameInfoConfig,
    GameInfoState,
    GameInfoStatusIdEnum,
} from '@shared/clank/clank-game.types';

export function createInitialGameInfoState(config: GameInfoConfig): GameInfoState {
    return {
        ...config,
        id: guid(),
        statusId: GameInfoStatusIdEnum.New,
        players: [],
        dragonInfo: initDragonInfo(),
        dungeonDeck: [],
        dungeonRow: [],
        reserveRow: [],
        tokens: [],
        artifacts: [],
        activePlayerIndex: 0,
        activePlayerId: '',
        actionLogs: [],
    };
}
