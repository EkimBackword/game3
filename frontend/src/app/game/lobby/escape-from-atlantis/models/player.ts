import { GamePlayerColorIdEnum } from '@shared/clank/clank-player.types';
import { SocketUser } from '@shared/socket.types';

import { EscapeFromAtlantisCellMeepleInfo } from './meeples';
import { EscapeFromAtlantisTileBaseInfo } from './tiles';

export interface EscapeFromAtlantisPlayer extends SocketUser {
    color: GamePlayerColorIdEnum;
    meeples: EscapeFromAtlantisCellMeepleInfo[];
    tiles: EscapeFromAtlantisTileBaseInfo[];
}

export interface EscapeFromAtlantisPlayerResult extends EscapeFromAtlantisPlayer {
    points: number;
}
