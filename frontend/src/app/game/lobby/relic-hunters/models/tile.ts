import { RelicHuntersBenefit } from './benefit';
import { RelicHuntersCellInfo } from './cell';

const RelicHuntersTileBaseSettings = {
    width: 400,
    height: 200,
    heightOffset: 100,
    cellMargin: 10,
}

export const RelicHuntersTileSettings = {
    width: RelicHuntersTileBaseSettings.width,
    height: RelicHuntersTileBaseSettings.height + RelicHuntersTileBaseSettings.heightOffset * 2,
    rowStep: RelicHuntersTileBaseSettings.height + RelicHuntersTileBaseSettings.heightOffset + RelicHuntersTileBaseSettings.cellMargin,
    rowOffset: RelicHuntersTileBaseSettings.heightOffset,
    columnStep: RelicHuntersTileBaseSettings.width + RelicHuntersTileBaseSettings.cellMargin,
    columnOffset: RelicHuntersTileBaseSettings.width / 2,
    padding: 20,
    url: '/assets/relic-hunters/tiles.png',
    backgroundSize: '700% 200%',
    openRow: 1,
    closeRow: 2,
};

export const RelicHuntersTileUtils = {
    getLeft(cell: RelicHuntersCellInfo) {
        const columnOffset = cell.position.row % 2 === 0
            ? RelicHuntersTileSettings.columnOffset
            : 0;
        return cell.position.column * RelicHuntersTileSettings.columnStep + columnOffset;
    },
    getTop(cell: RelicHuntersCellInfo) {
        return cell.position.row * RelicHuntersTileSettings.rowStep;
    }
}

export enum RelicHuntersTileTypes {
    Field = 'Field',
    Forest = 'Forest',
    Mountain = 'Mountain',
    River = 'River',
    Desert = 'Desert',
    Camp = 'Camp',
    Vulcan = 'Vulcan',
}

export const RelicHuntersTileTypeList = Object.keys(RelicHuntersTileTypes) as RelicHuntersTileTypes[];

export interface RelicHuntersTileTypeInfo {
    name: string;
    column: number;
    url: string;
    benefits: (keyof RelicHuntersBenefit)[]
}

export const RelicHuntersTileTypeTaxonomy: Record<RelicHuntersTileTypes, RelicHuntersTileTypeInfo> = {
    [RelicHuntersTileTypes.Field]: {
        name: 'Поле',
        url: '/assets/relic-hunters/tiles/Field.png',
        column: 0,
        benefits: ['coins'],
    },
    [RelicHuntersTileTypes.Forest]: {
        name: 'Лес',
        url: '/assets/relic-hunters/tiles/Forest.png',
        column: 1,
        benefits: ['coins', 'draw'],
    },
    [RelicHuntersTileTypes.Desert]: {
        name: 'Пустыня',
        url: '/assets/relic-hunters/tiles/Desert.png',
        column: 2,
        benefits: ['coins', 'trash'],
    },
    [RelicHuntersTileTypes.River]: {
        name: 'Река',
        url: '/assets/relic-hunters/tiles/River.png',
        column: 3,
        benefits: ['coins', 'rest'],
    },
    [RelicHuntersTileTypes.Mountain]: {
        name: 'Гора',
        url: '/assets/relic-hunters/tiles/Mountain.png',
        column: 4,
        benefits: ['move'],
    },
    [RelicHuntersTileTypes.Camp]: {
        name: 'Лагерь',
        url: '/assets/relic-hunters/tiles/Camp.png',
        column: 5,
        benefits: [],
    },
    [RelicHuntersTileTypes.Vulcan]: {
        name: 'Вулкан',
        url: '/assets/relic-hunters/tiles/Vulcan.png',
        column: 6,
        benefits: [],
    },
};
