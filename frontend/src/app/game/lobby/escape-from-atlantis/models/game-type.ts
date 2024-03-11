import { GameInfoStatusIdEnum } from '@shared/clank/clank-game.types';
import { GamePlayerId } from '@shared/game/game-constants';

import { EscapeFromAtlantisCellInfo } from './cells';
import { EscapeFromAtlantisCellMeepleInfo } from './meeples';
import { EscapeFromAtlantisPlayerResult } from './player';
import { EscapeFromAtlantisSetupData } from './setup-data';

export interface EscapeFromAtlantisGameType extends EscapeFromAtlantisSetupData {
    statusId: GameInfoStatusIdEnum;
    cells: EscapeFromAtlantisCellInfo[];
    meeplesReserv: EscapeFromAtlantisCellMeepleInfo[];
    playersResult: EscapeFromAtlantisPlayerResult[];
    winners: EscapeFromAtlantisPlayerResult[];
    takedMeeple: EscapeFromAtlantisTakedMeeple | null;
}

export interface EscapeFromAtlantisTakedMeeple {
    id: EscapeFromAtlantisCellMeepleInfo['id'];
    type: EscapeFromAtlantisCellMeepleInfo['type'];
    cellId: EscapeFromAtlantisCellInfo['id'] | null;
    gameMeepleId: EscapeFromAtlantisCellMeepleInfo['id'] | null;
    playerId: GamePlayerId | null;
}
