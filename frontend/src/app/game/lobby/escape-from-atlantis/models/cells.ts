import {
    EscapeFromAtlantisCellMeepleInfo,
    EscapeFromAtlantisGameMeepleIdEnum,
} from './meeples';
import { EscapeFromAtlantisTileBaseInfo } from './tiles';

export interface EscapeFromAtlantisCellPosition {
    column: number;
    row: number;
}

export interface EscapeFromAtlantisCellInfo {
    id: number;
    isVisible: boolean;
    position: EscapeFromAtlantisCellPosition;
    isStartCell: boolean;
    isFinishCell: boolean;
    startMonster: EscapeFromAtlantisGameMeepleIdEnum | null;
    tile: EscapeFromAtlantisTileBaseInfo | null;
    meeples: EscapeFromAtlantisCellMeepleInfo[];
}

export interface EscapeFromAtlantisColumnConfig {
    count: number;
    visibleRange: [number, number];
    startRange: [number, number] | null;
    hasFinish: boolean;
    seaMonsterRowIndex: number | null;
}

export const defaultEscapeFromAtlantisColumnConfig: EscapeFromAtlantisColumnConfig[] = [
    {
        count: 11,
        visibleRange: [2, 8],
        startRange: null,
        hasFinish: false,
        seaMonsterRowIndex: null,
    },
    {
        count: 12,
        visibleRange: [0, 11],
        startRange: null,
        hasFinish: true,
        seaMonsterRowIndex: 10,
    },
    {
        count: 11,
        visibleRange: [0, 10],
        startRange: null,
        hasFinish: false,
        seaMonsterRowIndex: 0,
    },
    {
        count: 12,
        visibleRange: [1, 10],
        startRange: [4, 7],
        hasFinish: false,
        seaMonsterRowIndex: null,
    },
    {
        count: 11,
        visibleRange: [0, 10],
        startRange: [3, 7],
        hasFinish: false,
        seaMonsterRowIndex: null,
    },
    {
        count: 12,
        visibleRange: [0, 11],
        startRange: [2, 9],
        hasFinish: false,
        seaMonsterRowIndex: null,
    },
    {
        count: 11,
        visibleRange: [0, 10],
        startRange: [2, 8],
        hasFinish: false,
        seaMonsterRowIndex: 5,
    },
    {
        count: 12,
        visibleRange: [0, 11],
        startRange: [2, 9],
        hasFinish: false,
        seaMonsterRowIndex: null,
    },
    {
        count: 11,
        visibleRange: [0, 10],
        startRange: [3, 7],
        hasFinish: false,
        seaMonsterRowIndex: null,
    },
    {
        count: 12,
        visibleRange: [1, 10],
        startRange: [4, 7],
        hasFinish: false,
        seaMonsterRowIndex: null,
    },
    {
        count: 11,
        visibleRange: [0, 10],
        startRange: null,
        hasFinish: false,
        seaMonsterRowIndex: 10,
    },
    {
        count: 12,
        visibleRange: [0, 11],
        startRange: null,
        hasFinish: true,
        seaMonsterRowIndex: 1,
    },
    {
        count: 11,
        visibleRange: [2, 8],
        startRange: null,
        hasFinish: false,
        seaMonsterRowIndex: null,
    },
];

const baseCellSettings = {
    widthOffset: 95,
    width: 210,
    height: 340,
};

export const EscapeFromAtlantisCellSettings = {
    width: baseCellSettings.width + baseCellSettings.widthOffset * 2,
    height: baseCellSettings.height,
    columnStep: baseCellSettings.width + baseCellSettings.widthOffset,
    columnOffset: baseCellSettings.widthOffset,
    rowOffset: baseCellSettings.height / 2,
    columnsCount: defaultEscapeFromAtlantisColumnConfig.length,
    rowsCount: Math.max(...defaultEscapeFromAtlantisColumnConfig.map(p => p.count)),
    mapPadding: 20,
};

export const getNearCellPositions = (cellPosition: EscapeFromAtlantisCellPosition) => {
    const list: EscapeFromAtlantisCellPosition[] = [
        {
            column: cellPosition.column,
            row: cellPosition.row - 1,
        },
        {
            column: cellPosition.column,
            row: cellPosition.row + 1,
        },
        {
            column: cellPosition.column - 1,
            row: cellPosition.row,
        },
        {
            column: cellPosition.column + 1,
            row: cellPosition.row,
        },
        {
            column: cellPosition.column - 1,
            row: cellPosition.column % 2 === 0
                ? cellPosition.row + 1
                : cellPosition.row - 1,
        },
        {
            column: cellPosition.column + 1,
            row: cellPosition.column % 2 === 0
                ? cellPosition.row + 1
                : cellPosition.row - 1,
        },
    ];
    return list;
};
