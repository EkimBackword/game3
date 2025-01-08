import { GamePlayerColorIdEnum } from '@shared/clank/clank-player.types';
import { GamePlayerBase } from '@shared/game/game-players';

import { EscapeFromAtlantisCellMeepleInfo } from './meeples';
import { EscapeFromAtlantisTileBaseInfo } from './tiles';

export interface EscapeFromAtlantisPlayer extends GamePlayerBase {
    color: GamePlayerColorIdEnum;
    meeples: EscapeFromAtlantisCellMeepleInfo[];
    tiles: EscapeFromAtlantisTileBaseInfo[];
}

export interface EscapeFromAtlantisPlayerResult extends EscapeFromAtlantisPlayer {
    points: number;
}
