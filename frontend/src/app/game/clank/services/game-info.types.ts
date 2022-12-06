import { guid } from '@datorama/akita';
import {
    ClankDragonInfo,
    initDragonInfo,
} from '@shared/clank/clank-dragon.types';
import {
    GameInfoConfig,
    GameInfoState,
    GameInfoStatusIdEnum,
} from '@shared/clank/clank-game.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';

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
        turnIndex: 0,
        actionLogs: [],
    };
}

export interface PlayersPositionInfo {
    player: ClankPlayerConfig;
    style: Partial<CSSStyleDeclaration>;
    size: number;
    isActive: boolean;
}

export interface DragonPositionInfo {
    dragonInfo: ClankDragonInfo;
    style: Partial<CSSStyleDeclaration>;
    tooltip: string;
}
