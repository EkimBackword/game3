import { GamePlayerId } from '@shared/game/game-constants';

import { RelicHuntersCellInfo } from './cell';
import { RelicHuntersPlayer } from './player';

export const RelicHuntersHeroSettings = {
    sizeMeeple: 100,
    sizeHero: 35,
    sizeCard: 42,
    cardBottom: 45,
    cardRight: 8,
    meepleIndex: 0,
    heroIndex: 2,
    url: '/assets/relic-hunters/hero.png',
    backgroundSize: '400% 300%',
}

export enum RelicHuntersHeroColorEnum {
    Blue = 'Blue',
    Yellow = 'Yellow',
    Red = 'Red',
    Green = 'Green',
}

export interface RhHeroComponentDataForLog {
    forLog: true;
    id: GamePlayerId;
    player: RelicHuntersPlayer;
    cell: null;
    index: number;
    isActive: boolean;
    isCurrent: boolean;
    isSelected: boolean;
}

export interface RhHeroComponentDataForCell {
    forLog: false;
    id: GamePlayerId;
    player: RelicHuntersPlayer;
    cell: RelicHuntersCellInfo;
    index: number;
    isActive: boolean;
    isCurrent: boolean;
    isSelected: boolean;
}

export type RhHeroComponentData =
    | RhHeroComponentDataForLog
    | RhHeroComponentDataForCell;

export const RelicHuntersHeroColorIds = Object.keys(RelicHuntersHeroColorEnum) as RelicHuntersHeroColorEnum[];

export interface RelicHuntersHeroColorInfo {
    column: number;
    name: string;
    colorName: string;
    color: string;
}

export const RelicHuntersHeroColorTaxonomy: Record<RelicHuntersHeroColorEnum, RelicHuntersHeroColorInfo> = {
    [RelicHuntersHeroColorEnum.Blue]: {
        column: 0,
        name: 'Археолог Черепаха',
        colorName: 'Синий',
        color: '#376EB6',
    },
    [RelicHuntersHeroColorEnum.Yellow]: {
        column: 1,
        name: 'Бродяга Комондор',
        colorName: 'Жёлтый',
        color: '#FFDB46',
    },
    [RelicHuntersHeroColorEnum.Red]: {
        column: 2,
        name: 'Ветеран Орёл',
        colorName: 'Красный',
        color: '#EF4E5A',
    },
    [RelicHuntersHeroColorEnum.Green]: {
        column: 3,
        name: 'Управляющий Павлин',
        colorName: 'Зелёный',
        color: '#339643',
    },
};
