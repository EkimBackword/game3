import { GameActionsEvent } from '@shared/game/game-actions';
import { GamePlayerId } from '@shared/game/game-constants';
import { EventNames } from '@shared/game/game-events';
import { GameFlowEventsHandlers } from '@shared/game/game-flow-events';
import { GameLogEntry } from '@shared/game/game-state';

import { RelicHuntersBenefit } from './benefit';
import { RelicHuntersCardInfo } from './cards';
import { RelicHuntersCellInfo } from './cell';
import { RelicHuntersPlayer } from './player';
import { RelicHuntersRelicTypeEnum } from './relic';
import { RelicHuntersTileTypes } from './tile';

export enum RhMoveTypes {
    getMovePoints = 'getMovePoints',
    getResearchPoints = 'getResearchPoints',
    getCoins = 'getCoins',
    drawCards = 'drawCards',
    trashCards = 'trashCards',
    restCards = 'restCards',
    getTileType = 'getTileType',
    useMovePoints = 'useMovePoints',
    useResearchPoints = 'useResearchPoints',
    endTurn = 'endTurn',
}

// RhGameActionsMove
export type RhGameActionsMovePayloadByType =
    | RhGetPointsByMovePayload
    | RhGetPointsByCardPayload
    | RhGetTileTypePayload
    | RhUseMovePointsPayload
    | RhUseResearchPointsPayload;

export type RhGameActionsMovePayload = {
    name: string;
    playerId?: GamePlayerId;
} & RhGameActionsMovePayloadByType;

export interface RhGetPointsByMovePayload {
    type:
        | RhMoveTypes.getMovePoints
        | RhMoveTypes.getResearchPoints
        | RhMoveTypes.getCoins
        | RhMoveTypes.drawCards
        | RhMoveTypes.trashCards
        | RhMoveTypes.restCards;
    args: RhGetPointsByMoveArgs;
}

export interface RhGetPointsByMoveArgs {
    card: RelicHuntersCardInfo | null;
    key: keyof RelicHuntersBenefit;
    value: number;
}

export interface RhGetPointsByCardPayload {
    type: RhMoveTypes.getTileType;
    args: RhGetPointsByCardArgs;
}

export interface RhGetPointsByCardArgs {
    card: RelicHuntersCardInfo;
    key: keyof RelicHuntersBenefit;
    value: number;
}

export interface RhGetTileTypePayload {
    type: RhMoveTypes.useMovePoints;
    args: RhGetTileTypeArgs;
}

export interface RhGetTileTypeArgs {
    card: RelicHuntersCardInfo;
    tileTypes: RelicHuntersTileTypes[];
}

export interface RhUseMovePointsPayload {
    type: RhMoveTypes.useMovePoints;
    args: RhUseMovePointsArgs;
}

export interface RhUseMovePointsArgs {
    cellFrom: RelicHuntersCellInfo;
    cellTo: RelicHuntersCellInfo;
    player: RelicHuntersPlayer;
}

export interface RhUseResearchPointsPayload {
    type: RhMoveTypes.useResearchPoints;
    args: RhUseResearchPointsArgs;
}

export interface RhUseResearchPointsArgs {
    cell: RelicHuntersCellInfo;
    player: RelicHuntersPlayer;
}

export interface RhMoveEndTurnPayload {
    type: RhMoveTypes.endTurn;
    args: RhMoveEndTurnArgs;
}

export interface RhMoveEndTurnArgs {
    force: boolean;
    relicType: RelicHuntersRelicTypeEnum | null;
}

// RhGameActionsEvent

export type RhGameActionsEventPayloadByTypeBase =
    | RhEventEndTurnPayload;

export type RhGameActionsEventPayloadTypes = RhGameActionsEventPayloadByTypeBase['type'];

export type RhGameActionsEventPayloadByType =
    | RhGameActionsEventPayloadByTypeBase
    | ReturnType<typeof GameActionsEvent<Exclude<EventNames<GameFlowEventsHandlers>, RhGameActionsEventPayloadTypes>>>['payload'];

export type RhGameActionsEventPayload = {
    playerId?: GamePlayerId,
} & RhGameActionsEventPayloadByType;

export interface RhEventEndTurnPayload {
    type: 'endTurn';
    args: RhEventEndTurnArgs;
}

export interface RhEventEndTurnArgs {
    force: boolean;
    options?: {
        log: GameLogEntry[];
    };
}

export interface RhEndTurnResultOptions {
    relicType: RelicHuntersRelicTypeEnum | null;
    returnToCamp: boolean;
    selectedCards: RelicHuntersCardInfo[];
}
