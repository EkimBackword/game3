import { GameActionPayload } from '@shared/game/game-actions';

import { RelicHuntersCardInfo } from './cards';
import { RelicHuntersPlayer } from './player';

export enum RhGameActionType {
    OnPhasesBegin = 'OnPhasesBegin',
    OnTurnEnd = 'OnTurnEnd',
}

export interface RhGameActionPayloadOnPhasesBegin extends GameActionPayload {
    type: RhGameActionType.OnPhasesBegin;
    args: {
        players: RelicHuntersPlayer[];
    }
}

export interface RhGameActionPayloadOnTurnEnd extends GameActionPayload {
    type: RhGameActionType.OnTurnEnd;
    args: {
        cards: RelicHuntersCardInfo[];
    }
}

export type RhGameActionPayload =
    | RhGameActionPayloadOnPhasesBegin
    | RhGameActionPayloadOnTurnEnd;
