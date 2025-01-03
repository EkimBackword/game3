import { GameLogEntry } from '@shared/game/game-state';

import { RelicHuntersBenefit } from './benefit';
import { RelicHuntersCardInfo } from './cards';
import { RelicHuntersCellInfo } from './cell';
import { RelicHuntersPlayer } from './player';
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

export interface RhGetPointsByMoveArgs {
    card: RelicHuntersCardInfo | null;
    key: keyof RelicHuntersBenefit;
    value: number;
}

export interface RhGetPointsByCardArgs {
    card: RelicHuntersCardInfo;
    key: keyof RelicHuntersBenefit;
    value: number;
}

export interface RhGetTileTypeArgs {
    card: RelicHuntersCardInfo;
    tileTypes: RelicHuntersTileTypes[];
}

export interface RhUseMovePointsArgs {
    cellFrom: RelicHuntersCellInfo;
    cellTo: RelicHuntersCellInfo;
    player: RelicHuntersPlayer;
}

export interface RhUseResearchPointsArgs {
    cell: RelicHuntersCellInfo;
    player: RelicHuntersPlayer;
}

export interface RhMoveEndTurnArgs {
    force: boolean;
}

export interface RhEventEndTurnArgs {
    force: boolean;
    options?: {
        log: GameLogEntry[];
    };
}

export interface RhEndTurnResultOptions {
    returnToCamp: boolean;
    selectedCards: RelicHuntersCardInfo[];
}
