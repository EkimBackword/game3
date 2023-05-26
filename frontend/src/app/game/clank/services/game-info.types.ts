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
        statusId: GameInfoStatusIdEnum.Created,
        players: [],
        dragonInfo: initDragonInfo(),
        dungeonDeck: [],
        dungeonRow: [],
        reserveRow: [],
        mapTokens: [],
        marketTokens: [],
        artifacts: [],
        activePlayerIndex: 0,
        activePlayerId: '',
        turnIndex: 0,
        actionLogs: [],
        canCancel: false,
    };
}

export interface PlayersPositionInfo {
    player: ClankPlayerConfig;
    style: Partial<CSSStyleDeclaration>;
    size: number;
    isActive: boolean;
}

export interface DragonPositionInfo {
    clankCount: number;
    dragonInfo: ClankDragonInfo;
    style: Partial<CSSStyleDeclaration>;
    clankAriaStyle: Partial<CSSStyleDeclaration>;
    tooltip: string;
    disableDragonRage: {
        style: Partial<CSSStyleDeclaration>;
        tooltip: string;
    }[];
}
