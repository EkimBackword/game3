import { GameInfoStatusIdEnum } from '@shared/clank/clank-game.types';
import { GamePlayerId } from '@shared/game/game-constants';

import { RelicHuntersCardInfo } from './cards';
import { RelicHuntersCellInfo } from './cell';
import { RelicHuntersMapEnum } from './map';
import { RelicHuntersPlayer } from './player';

export interface RelicHuntersGameType {
    statusId: GameInfoStatusIdEnum;
    mapId: RelicHuntersMapEnum;
    firstPlayerIndex: number;
    playerMap: Record<GamePlayerId, RelicHuntersPlayer>;
    cells: RelicHuntersCellInfo[];
    deckCards: RelicHuntersCardInfo[];
    assistantCards: RelicHuntersCardInfo[];
    reservCards: RelicHuntersCardInfo[];
    marketCards: Record<number, RelicHuntersCardInfo[]>;
    winner: RelicHuntersPlayer | null;
}
