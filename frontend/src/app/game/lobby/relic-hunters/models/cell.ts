import { GamePlayerId } from '@shared/game/game-constants';

import { RelicHuntersBenefit } from './benefit';
import { RelicHuntersRelicTypeEnum } from './relic';
import { RelicHuntersTileTypes } from './tile';

export interface RelicHuntersCellPosition {
    row: number;
    column: number;
}

export interface RelicHuntersActiveCellInfo extends RelicHuntersCellPosition {
    isCurrent: boolean;
}

export interface RelicHuntersCellInfo extends RelicHuntersCellTaxonomyItem {
    id: number;
    position: RelicHuntersCellPosition;
    visiblePosition: RelicHuntersCellPosition;
    isVisible: boolean;
    isCamp: boolean;
    isOpen: boolean;
    hasRelict: boolean;
    players: GamePlayerId[];
}

export interface RelicHuntersCellTaxonomyItem {
    level: number;
    tileType: RelicHuntersTileTypes;
    relicType: RelicHuntersRelicTypeEnum | null;
    moveCostClose: number;
    moveCostOpen: number;
    researchCost: number;
    benefit: Partial<RelicHuntersBenefit>;
}

export interface RelicHuntersCellTaxonomyInfo {
    camp: RelicHuntersCellTaxonomyItem;
    relic: RelicHuntersCellTaxonomyItem[];
    vulcan: RelicHuntersCellTaxonomyItem;
    level1: RelicHuntersCellTaxonomyItem[];
    level2: RelicHuntersCellTaxonomyItem[];
    level3: RelicHuntersCellTaxonomyItem[];
}

export const RelicHuntersCellTaxonomy: RelicHuntersCellTaxonomyInfo = {
    camp: {
        level: 0,
        tileType: RelicHuntersTileTypes.Camp,
        relicType: null,
        moveCostClose: 1,
        moveCostOpen: 1,
        researchCost: 0,
        benefit: {},
    },
    relic: [
        {
            level: 3,
            tileType: RelicHuntersTileTypes.Field,
            relicType: RelicHuntersRelicTypeEnum.Wheel,
            moveCostClose: 3,
            moveCostOpen: 3,
            researchCost: 3,
            benefit: {},
        },
        {
            level: 3,
            tileType: RelicHuntersTileTypes.Forest,
            relicType: RelicHuntersRelicTypeEnum.Dagger,
            moveCostClose: 4,
            moveCostOpen: 5,
            researchCost: 3,
            benefit: {},
        },
        {
            level: 3,
            tileType: RelicHuntersTileTypes.Mountain,
            relicType: RelicHuntersRelicTypeEnum.Shield,
            moveCostClose: 5,
            moveCostOpen: 5,
            researchCost: 3,
            benefit: {},
        },
        {
            level: 3,
            tileType: RelicHuntersTileTypes.River,
            relicType: RelicHuntersRelicTypeEnum.Cup,
            moveCostClose: 4,
            moveCostOpen: 4,
            researchCost: 3,
            benefit: {},
        },
        {
            level: 3,
            tileType: RelicHuntersTileTypes.Desert,
            relicType: RelicHuntersRelicTypeEnum.Crown,
            moveCostClose: 5,
            moveCostOpen: 5,
            researchCost: 3,
            benefit: {},
        },
    ],
    vulcan: {
        level: 0,
        tileType: RelicHuntersTileTypes.Vulcan,
        relicType: null,
        moveCostClose: 0,
        moveCostOpen: 0,
        researchCost: 0,
        benefit: {},
    },
    level1: [
        // Mountain
        {
            level: 1,
            tileType: RelicHuntersTileTypes.Mountain,
            relicType: null,
            moveCostClose: 3,
            moveCostOpen: 3,
            researchCost: 1,
            benefit: {
                move: 3,
            },
        },
        {
            level: 1,
            tileType: RelicHuntersTileTypes.Mountain,
            relicType: null,
            moveCostClose: 3,
            moveCostOpen: 2,
            researchCost: 0,
            benefit: {
                move: 2,
            },
        },
        // Forest
        {
            level: 1,
            tileType: RelicHuntersTileTypes.Forest,
            relicType: null,
            moveCostClose: 2,
            moveCostOpen: 1,
            researchCost: 0,
            benefit: {
                draw: 2,
            },
        },
        {
            level: 1,
            tileType: RelicHuntersTileTypes.Forest,
            relicType: null,
            moveCostClose: 2,
            moveCostOpen: 2,
            researchCost: 1,
            benefit: {
                draw: 2,
            },
        },
        {
            level: 1,
            tileType: RelicHuntersTileTypes.Forest,
            relicType: null,
            moveCostClose: 2,
            moveCostOpen: 1,
            researchCost: 0,
            benefit: {
                coins: 2,
            },
        },
        // River
        {
            level: 1,
            tileType: RelicHuntersTileTypes.River,
            relicType: null,
            moveCostClose: 2,
            moveCostOpen: 2,
            researchCost: 1,
            benefit: {
                coins: 1,
            },
        },
        {
            level: 1,
            tileType: RelicHuntersTileTypes.River,
            relicType: null,
            moveCostClose: 2,
            moveCostOpen: 1,
            researchCost: 0,
            benefit: {
                coins: 2
            },
        },
        {
            level: 1,
            tileType: RelicHuntersTileTypes.River,
            relicType: null,
            moveCostClose: 2,
            moveCostOpen: 1,
            researchCost: 1,
            benefit: {
                rest: 1,
            },
        },
        // Field
        {
            level: 1,
            tileType: RelicHuntersTileTypes.Field,
            relicType: null,
            moveCostClose: 1,
            moveCostOpen: 1,
            researchCost: 0,
            benefit: {
                coins: 1,
            },
        },
        {
            level: 1,
            tileType: RelicHuntersTileTypes.Field,
            relicType: null,
            moveCostClose: 1,
            moveCostOpen: 1,
            researchCost: 1,
            benefit: {
                coins: 1,
            },
        },
        {
            level: 1,
            tileType: RelicHuntersTileTypes.Field,
            relicType: null,
            moveCostClose: 1,
            moveCostOpen: 1,
            researchCost: 1,
            benefit: {
                coins: 1,
            },
        },
        {
            level: 1,
            tileType: RelicHuntersTileTypes.Field,
            relicType: null,
            moveCostClose: 1,
            moveCostOpen: 1,
            researchCost: 0,
            benefit: {
                coins: 1,
            },
        },
        {
            level: 1,
            tileType: RelicHuntersTileTypes.Field,
            relicType: null,
            moveCostClose: 1,
            moveCostOpen: 1,
            researchCost: 1,
            benefit: {
                coins: 1,
            },
        },
        // Desert
        {
            level: 1,
            tileType: RelicHuntersTileTypes.Desert,
            relicType: null,
            moveCostClose: 3,
            moveCostOpen: 2,
            researchCost: 0,
            benefit: {
                coins: 2,
            },
        },
        {
            level: 1,
            tileType: RelicHuntersTileTypes.Desert,
            relicType: null,
            moveCostClose: 3,
            moveCostOpen: 3,
            researchCost: 1,
            benefit: {
                trash: 1,
            },
        },
    ],
    level2: [
        // Mountain
        {
            level: 2,
            tileType: RelicHuntersTileTypes.Mountain,
            relicType: null,
            moveCostClose: 4,
            moveCostOpen: 4,
            researchCost: 2,
            benefit: {
                move: 4,
            },
        },
        {
            level: 2,
            tileType: RelicHuntersTileTypes.Mountain,
            relicType: null,
            moveCostClose: 4,
            moveCostOpen: 3,
            researchCost: 0,
            benefit: {
                move: 3,
            },
        },
        {
            level: 2,
            tileType: RelicHuntersTileTypes.Mountain,
            relicType: null,
            moveCostClose: 4,
            moveCostOpen: 3,
            researchCost: 2,
            benefit: {
                move: 4,
            },
        },
        // Forest
        {
            level: 2,
            tileType: RelicHuntersTileTypes.Forest,
            relicType: null,
            moveCostClose: 3,
            moveCostOpen: 3,
            researchCost: 2,
            benefit: {
                coins: 3,
            },
        },
        {
            level: 2,
            tileType: RelicHuntersTileTypes.Forest,
            relicType: null,
            moveCostClose: 3,
            moveCostOpen: 2,
            researchCost: 0,
            benefit: {
                coins: 3,
            },
        },
        {
            level: 2,
            tileType: RelicHuntersTileTypes.Forest,
            relicType: null,
            moveCostClose: 3,
            moveCostOpen: 3,
            researchCost: 2,
            benefit: {
                draw: 3,
            },
        },
        // River
        {
            level: 2,
            tileType: RelicHuntersTileTypes.River,
            relicType: null,
            moveCostClose: 3,
            moveCostOpen: 2,
            researchCost: 0,
            benefit: {
                coins: 3,
            },
        },
        {
            level: 2,
            tileType: RelicHuntersTileTypes.River,
            relicType: null,
            moveCostClose: 3,
            moveCostOpen: 3,
            researchCost: 2,
            benefit: {
                coins: 3,
            },
        },
        {
            level: 2,
            tileType: RelicHuntersTileTypes.River,
            relicType: null,
            moveCostClose: 3,
            moveCostOpen: 3,
            researchCost: 2,
            benefit: {
                rest: 2,
            },
        },
        // Field
        {
            level: 2,
            tileType: RelicHuntersTileTypes.Field,
            relicType: null,
            moveCostClose: 2,
            moveCostOpen: 2,
            researchCost: 2,
            benefit: {
                coins: 2,
            },
        },
        {
            level: 2,
            tileType: RelicHuntersTileTypes.Field,
            relicType: null,
            moveCostClose: 2,
            moveCostOpen: 1,
            researchCost: 0,
            benefit: {
                coins: 2,
            },
        },
        {
            level: 2,
            tileType: RelicHuntersTileTypes.Field,
            relicType: null,
            moveCostClose: 2,
            moveCostOpen: 1,
            researchCost: 0,
            benefit: {
                coins: 2,
            },
        },
        {
            level: 2,
            tileType: RelicHuntersTileTypes.Field,
            relicType: null,
            moveCostClose: 2,
            moveCostOpen: 2,
            researchCost: 2,
            benefit: {
                coins: 2,
            },
        },
        // Desert
        {
            level: 2,
            tileType: RelicHuntersTileTypes.Desert,
            relicType: null,
            moveCostClose: 4,
            moveCostOpen: 3,
            researchCost: 0,
            benefit: {
                coins: 3,
            },
        },
        {
            level: 2,
            tileType: RelicHuntersTileTypes.Desert,
            relicType: null,
            moveCostClose: 4,
            moveCostOpen: 3,
            researchCost: 0,
            benefit: {
                trash: 2,
            },
        },
        {
            level: 2,
            tileType: RelicHuntersTileTypes.Desert,
            relicType: null,
            moveCostClose: 4,
            moveCostOpen: 4,
            researchCost: 2,
            benefit: {
                trash: 2
            },
        },
    ],
    level3: [
        // Mountain
        {
            level: 3,
            tileType: RelicHuntersTileTypes.Mountain,
            relicType: null,
            moveCostClose: 5,
            moveCostOpen: 5,
            researchCost: 3,
            benefit: {
                move: 5,
            },
        },
        {
            level: 3,
            tileType: RelicHuntersTileTypes.Mountain,
            relicType: null,
            moveCostClose: 5,
            moveCostOpen: 4,
            researchCost: 0,
            benefit: {
                move: 4,
            },
        },
        {
            level: 3,
            tileType: RelicHuntersTileTypes.Mountain,
            relicType: null,
            moveCostClose: 5,
            moveCostOpen: 5,
            researchCost: 3,
            benefit: {
                move: 5,
            },
        },
        // Forest
        {
            level: 3,
            tileType: RelicHuntersTileTypes.Forest,
            relicType: null,
            moveCostClose: 4,
            moveCostOpen: 3,
            researchCost: 0,
            benefit: {
                coins: 4,
            },
        },
        {
            level: 3,
            tileType: RelicHuntersTileTypes.Forest,
            relicType: null,
            moveCostClose: 4,
            moveCostOpen: 3,
            researchCost: 0,
            benefit: {
                coins: 4,
            },
        },
        {
            level: 3,
            tileType: RelicHuntersTileTypes.Forest,
            relicType: null,
            moveCostClose: 4,
            moveCostOpen: 4,
            researchCost: 3,
            benefit: {
                coins: 5,
            },
        },
        // River
        {
            level: 3,
            tileType: RelicHuntersTileTypes.River,
            relicType: null,
            moveCostClose: 4,
            moveCostOpen: 3,
            researchCost: 0,
            benefit: {
                coins: 4,
            },
        },
        {
            level: 3,
            tileType: RelicHuntersTileTypes.River,
            relicType: null,
            moveCostClose: 4,
            moveCostOpen: 4,
            researchCost: 4,
            benefit: {
                rest: 3,
            },
        },
        {
            level: 3,
            tileType: RelicHuntersTileTypes.River,
            relicType: null,
            moveCostClose: 4,
            moveCostOpen: 3,
            researchCost: 0,
            benefit: {
                rest: 2,
            },
        },
        // Field
        {
            level: 3,
            tileType: RelicHuntersTileTypes.Field,
            relicType: null,
            moveCostClose: 3,
            moveCostOpen: 2,
            researchCost: 0,
            benefit: {
                coins: 3,
            },
        },
        {
            level: 3,
            tileType: RelicHuntersTileTypes.Field,
            relicType: null,
            moveCostClose: 3,
            moveCostOpen: 3,
            researchCost: 3,
            benefit: {
                coins: 4,
            },
        },
        {
            level: 3,
            tileType: RelicHuntersTileTypes.Field,
            relicType: null,
            moveCostClose: 3,
            moveCostOpen: 2,
            researchCost: 0,
            benefit: {
                coins: 3,
            },
        },
        // Desert
        {
            level: 3,
            tileType: RelicHuntersTileTypes.Desert,
            relicType: null,
            moveCostClose: 5,
            moveCostOpen: 4,
            researchCost: 0,
            benefit: {
                coins: 5,
            },
        },
        {
            level: 3,
            tileType: RelicHuntersTileTypes.Desert,
            relicType: null,
            moveCostClose: 5,
            moveCostOpen: 5,
            researchCost: 3,
            benefit: {
                coins: 6,
            },
        },
        {
            level: 3,
            tileType: RelicHuntersTileTypes.Desert,
            relicType: null,
            moveCostClose: 5,
            moveCostOpen: 5,
            researchCost: 3,
            benefit: {
                trash: 3,
            },
        },
    ],
};
