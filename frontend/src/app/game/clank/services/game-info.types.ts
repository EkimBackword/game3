import {
    GameInfoState,
    GameInfoStatusIdEnum,
} from '@shared/clank/clank-game.types';
import { ClankDlcEnum } from '@shared/clank/clank-info.types';
import { ClankMapConfigIds } from '@shared/clank/clank-map.types';

export function createInitialGameInfoState(): GameInfoState {
    return {
        id: '',
        name: 'Not found',
        statusId: GameInfoStatusIdEnum.New,
        mapId: ClankMapConfigIds.clank_1,
        mapDlcId: ClankDlcEnum.clank,
        startDeckId: ClankDlcEnum.clank,
        players: [],
        dungeonDeckIds: [ClankDlcEnum.clank],
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
