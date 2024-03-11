import { GamePlayerId } from '@shared/game/game-constants';

import {
    EscapeFromAtlantisEndConditionEnum,
    EscapeFromAtlantisWinConditionEnum,
} from './conditions';
import { EscapeFromAtlantisPlayer } from './player';

export interface EscapeFromAtlantisSetupData {
    playerMap: Record<GamePlayerId, EscapeFromAtlantisPlayer>;
    useTwoMeeples: boolean;
    endCondition: EscapeFromAtlantisEndConditionEnum;
    winCondition: EscapeFromAtlantisWinConditionEnum;
}

