import { GamePlayerId } from '@shared/game/game-constants';

import { RelicHuntersMapEnum } from './map';
import { RelicHuntersPlayerSetupData } from './player';

export interface RelicHuntersSetupData {
    playerMap: Record<GamePlayerId, RelicHuntersPlayerSetupData>;
    mapId: RelicHuntersMapEnum;
}
