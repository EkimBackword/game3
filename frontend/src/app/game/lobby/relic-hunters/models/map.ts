import { RelicHuntersCellPosition } from './cell';
import { RelicHuntersRelicTypeEnum } from './relic';

export enum RelicHuntersMapEnum {
    Basic = 'Basic',
    Duel = 'Duel',
}

export const RelicHuntersMapIds = Object.keys(RelicHuntersMapEnum) as RelicHuntersMapEnum[];

export interface RelicHuntersMapInfo {
    name: string;
    columnCount: number;
    campPosition: RelicHuntersCellPosition;
    levels: RelicHuntersMapLevel[];
}

export interface RelicHuntersMapLevel {
    name: string;
    rows: RelicHuntersMapLevelRow[];
    hasRelic: boolean;
    excludeRelicTypes: RelicHuntersRelicTypeEnum[];
}

export interface RelicHuntersMapLevelRow {
    visibleCells: RelicHuntersMapRange;
    vulcanColumns: number[];
}

export interface RelicHuntersMapRange {
    start: number;
    end: number;
}

export const RelicHuntersMapTaxonomy: Record<RelicHuntersMapEnum, RelicHuntersMapInfo> = {
    Basic: {
        name: 'Базовая карта',
        columnCount: 7,
        campPosition: {
            row: 0,
            column: 3,
        },
        levels: [
            {
                name: '1-й уровень',
                hasRelic: false,
                excludeRelicTypes: [],
                rows: [
                    {
                        vulcanColumns: [],
                        visibleCells: {start: 2, end: 4 },
                    },
                    {
                        vulcanColumns: [],
                        visibleCells: {start: 2, end: 5 },
                    },
                    {
                        vulcanColumns: [2, 4],
                        visibleCells: {start: 1, end: 5 },
                    },
                ],
            },
            {
                name: '2-й уровень',
                hasRelic: false,
                excludeRelicTypes: [],
                rows: [
                    {
                        vulcanColumns: [],
                        visibleCells: { start: 1, end: 6 },
                    },
                    {
                        vulcanColumns: [1, 5],
                        visibleCells: { start: 0, end: 6 },
                    },
                ],
            },
            {
                name: '3-й уровень',
                hasRelic: true,
                excludeRelicTypes: [],
                rows: [
                    {
                        vulcanColumns: [],
                        visibleCells: { start: 1, end: 6 },
                    },
                    {
                        vulcanColumns: [],
                        visibleCells: { start: 1, end: 5 },
                    },
                    {
                        vulcanColumns: [],
                        visibleCells: { start: 2, end: 5 },
                    },
                ],
            },
        ],

    },
    Duel: {
        name: 'Карта для двоих',
        columnCount: 6,
        campPosition: {
            row: 0,
            column: 2,
        },
        levels: [
            {
                name: '1-й уровень',
                hasRelic: false,
                excludeRelicTypes: [],
                rows: [
                    {
                        vulcanColumns: [],
                        visibleCells: { start: 1, end: 2 },
                    },
                    {
                        vulcanColumns: [],
                        visibleCells: { start: 1, end: 3 },
                    },
                    {
                        vulcanColumns: [],
                        visibleCells: { start: 0, end: 2 },
                    },
                    {
                        vulcanColumns: [],
                        visibleCells: { start: 0, end: 2 },
                    },
                ],
            },
            {
                name: '2-й уровень',
                hasRelic: false,
                excludeRelicTypes: [],
                rows: [
                    {
                        vulcanColumns: [],
                        visibleCells: { start: 0, end: 2 },
                    },
                    {
                        vulcanColumns: [],
                        visibleCells: { start: 1, end: 3 },
                    },
                    {
                        vulcanColumns: [],
                        visibleCells: { start: 0, end: 3 },
                    },
                ],
            },
            {
                name: '3-й уровень',
                hasRelic: false,
                excludeRelicTypes: [],
                rows: [
                    {
                        vulcanColumns: [],
                        visibleCells: { start: 0, end: 4 },
                    },
                    {
                        vulcanColumns: [],
                        visibleCells: { start: 0, end: 4 },
                    },
                ],
            },
            {
                name: 'Реликвии',
                hasRelic: true,
                excludeRelicTypes: [RelicHuntersRelicTypeEnum.Wheel],
                rows: [
                    {
                        vulcanColumns: [],
                        visibleCells: { start: 1, end: 4 },
                    },
                ],
            },
        ],
    },
}
