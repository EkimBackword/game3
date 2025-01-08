import { GamePlayerBase } from '@shared/game/game-players';

import { RelicHuntersBenefit } from './benefit';
import { RelicHuntersCardInfo } from './cards';
import { RelicHuntersCellInfo } from './cell';
import { RelicHuntersHeroColorEnum } from './hero';
import { RelicHuntersRelicTypeEnum } from './relic';

export interface RelicHuntersPlayerSetupData extends GamePlayerBase {
    color: RelicHuntersHeroColorEnum;
}

export interface RelicHuntersPlayer extends RelicHuntersPlayerSetupData {
    deck: RelicHuntersCardInfo[];
    hand: RelicHuntersCardInfo[];
    board: RelicHuntersCardInfo[];
    discard: RelicHuntersCardInfo[];
    trash: RelicHuntersCardInfo[];
    artifacts: RelicHuntersRelicTypeEnum[];
    benefit: RelicHuntersBenefit;
    usedCellIds: RelicHuntersCellInfo['id'][];
}

export interface RelicHuntersPlayerCardInfo {
    id: RelicHuntersCardInfo['id'];
    card: RelicHuntersCardInfo;
    style: Partial<CSSStyleDeclaration>;
    isOpen: boolean;
    useOnlyActivePlayer: boolean;
    actions: RelicHuntersPlayerCardActions[];
}
export interface RelicHuntersPlayerCardActions {
    name: string;
    callback: () => Promise<void>;
}
