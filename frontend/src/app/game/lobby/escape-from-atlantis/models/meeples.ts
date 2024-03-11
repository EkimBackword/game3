import { GamePlayerColorIdEnum } from '@shared/clank/clank-player.types';

import { EscapeFromAtlantisCellSettings } from './cells';

export enum EscapeFromAtlantisCellMeepleType {
    PlayerMeeple = 'PlayerMeeple',
    GameMeeple = 'GameMeeple',
}

export type EscapeFromAtlantisCellMeepleInfo =
    EscapeFromAtlantisPlayerMeepleBaseInfo
    | EscapeFromAtlantisGameMeepleBaseInfo;

export interface EscapeFromAtlantisPlayerMeepleBaseInfo {
    type: EscapeFromAtlantisCellMeepleType.PlayerMeeple;
    id: number;
    value: number;
    color: GamePlayerColorIdEnum;
}

export enum EscapeFromAtlantisMeeplePositionEnum {
    Reserv,
    Player,
    Map,
    Died,
    Saved,
}

export const defaultEscapeFromAtlantisPlayerMeepleValues: number[] = [
    1, 1, 1, 2, 2, 3, 3, 4, 5, 6
]

export interface EscapeFromAtlantisGameMeepleBaseInfo {
    type: EscapeFromAtlantisCellMeepleType.GameMeeple;
    id: number;
    meepleId: EscapeFromAtlantisGameMeepleIdEnum;
    meeples: EscapeFromAtlantisPlayerMeepleBaseInfo[];
}

export enum EscapeFromAtlantisGameMeepleIdEnum {
    SeaMonster = 'SeaMonster',
    Shark = 'Shark',
    Whale = 'Whale',
    Ship = 'Ship',
}

export const EscapeFromAtlantisGameMeepleIds = Object.keys(EscapeFromAtlantisGameMeepleIdEnum) as EscapeFromAtlantisGameMeepleIdEnum[];

export interface EscapeFromAtlantisGameMeepleTaxonomyInfo {
    name: string;
    column: number;
    isMonster: boolean;
    count: number;
    userCount: number;
    diceUrl: string;
    meepleUrl: string;
}

export const EscapeFromAtlantisGameMeepleTaxonomy: Record<
    EscapeFromAtlantisGameMeepleIdEnum,
    EscapeFromAtlantisGameMeepleTaxonomyInfo
> = {
    [EscapeFromAtlantisGameMeepleIdEnum.SeaMonster]: {
        name: 'Морское чудовище',
        column: 0,
        isMonster: true,
        count: 5,
        userCount: 0,
        diceUrl: '/assets/escape-from-atlantis/game-dice.png',
        meepleUrl: '/assets/escape-from-atlantis/game-meeples.png'
    },
    [EscapeFromAtlantisGameMeepleIdEnum.Shark]: {
        name: 'Акула',
        column: 1,
        isMonster: true,
        count: 6,
        userCount: 0,
        diceUrl: '/assets/escape-from-atlantis/game-dice.png',
        meepleUrl: '/assets/escape-from-atlantis/game-meeples.png'
    },
    [EscapeFromAtlantisGameMeepleIdEnum.Whale]: {
        name: 'Кит',
        column: 2,
        isMonster: true,
        count: 5,
        userCount: 0,
        diceUrl: '/assets/escape-from-atlantis/game-dice.png',
        meepleUrl: '/assets/escape-from-atlantis/game-meeples.png'
    },
    [EscapeFromAtlantisGameMeepleIdEnum.Ship]: {
        name: 'Лодка',
        column: 3,
        isMonster: false,
        count: 12,
        userCount: 2,
        diceUrl: '/assets/escape-from-atlantis/game-dice.png',
        meepleUrl: '/assets/escape-from-atlantis/game-meeples.png'
    },
};

const baseMeepleSettings = {
    size: 100,
    topStep: 70,
    zoomWrapperPadding: EscapeFromAtlantisCellSettings.mapPadding,
    zoomWrapperWidth: EscapeFromAtlantisCellSettings.width * 2
        + EscapeFromAtlantisCellSettings.mapPadding * 2,
};

function getRowCount(isCell: boolean) {
    const width = isCell
        ? EscapeFromAtlantisCellSettings.width
        : baseMeepleSettings.zoomWrapperWidth;
    return Math.floor(width / baseMeepleSettings.size);
}

export const EscapeFromAtlantisMeepleSettings = {
    ...baseMeepleSettings,
    getLeft: (
        index: number,
        offset: number,
        isCell: boolean,
    ) => {
        const rowCount = getRowCount(isCell);
        const leftIndex = index % rowCount;
        const leftStep = baseMeepleSettings.size;
        const left = leftStep * leftIndex;
        const columnOffset = isCell
            ? EscapeFromAtlantisCellSettings.columnOffset
            : 0;
        return offset + columnOffset + left;
    },
    getTop: (
        index: number,
        offset: number,
        isCell: boolean,
    ) => {
        const rowCount = getRowCount(isCell);
        const topIndex = Math.floor(index / rowCount);
        const topStep = isCell
            ? baseMeepleSettings.topStep
            : baseMeepleSettings.size;
        const left = topStep * topIndex;
        return offset + left;
    },
};
