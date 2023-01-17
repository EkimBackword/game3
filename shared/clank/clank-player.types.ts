import { ClankArtifactConfig } from './clank-artifact.types';
import {
  ClankCardConfig,
  ClankCardName,
} from './clank-card.types';
import { ClankCostInfo } from './clank-info.types';
import { ClankTokenConfig } from './clank-token.types';

export interface ClankPlayerConfig {
    /** Id пользователя */
    id: string;
    /** Имя пользователя */
    name: string;
    /** Id цвета игрока */
    colorId: GamePlayerColorIdEnum;
    /** Онлайн или оффлайн */
    isOnline: boolean;
    /** Создатель игры */
    isAdmin: boolean;
    /** Позиция мипла на карте */
    elementId: number;
    /** Информация о наличии очков для действий */
    benefitInfo: ClankCostInfo;
    /** Необходимость сбросить карты */
    needTrashCards: ClankCardName[];
    /** Колода */
    deck: ClankCardConfig[];
    /** Карты в руке */
    hand: ClankCardConfig[];
    /** Разыгранные карты */
    board: ClankCardConfig[];
    /** сброшенные карты */
    discard: ClankCardConfig[];
    /** Карты от которых избавились */
    trash: ClankCardConfig[];
    /** Жетоны */
    tokens: ClankTokenConfig[];
    /** Артефакты */
    artifacts: ClankArtifactConfig[];
    /** Игрок потерял сознание, но был спасён */
    isRescued: boolean;
    /** Игрок выбрался */
    isEscaped: boolean;
    /** Завершил ли игру игрок */
    isFinish: boolean;
}

export enum GamePlayerStatusIdEnum {
    Online,
    Offline,
}

export enum GamePlayerColorIdEnum {
    Red = 'Red',
    Yellow = 'Yellow',
    Green = 'Green',
    Blue = 'Blue',
    Purple = 'Purple',
    Orange = 'Orange',
    Black = 'Black',
}

export const GamePlayerColorIds = Object.keys(GamePlayerColorIdEnum) as GamePlayerColorIdEnum[];

export interface GamePlayerColorInfo {
    column: number,
    name: string;
    color: string;
    url: string;
    forPlayer: boolean;
}

export const GamePlayerColorList: Record<GamePlayerColorIdEnum, GamePlayerColorInfo> = {
    [GamePlayerColorIdEnum.Red]: {
        column: 0,
        name: 'Красный',
        color: '#EF4E5A',
        url: '/assets/images/cubes/red.png',
        forPlayer: true,
    },
    [GamePlayerColorIdEnum.Yellow]: {
        column: 1,
        name: 'Жёлтый',
        color: '#FFDB46',
        url: '/assets/images/cubes/yellow.png',
        forPlayer: true,
    },
    [GamePlayerColorIdEnum.Green]: {
        column: 2,
        name: 'Зелёный',
        color: '#339643',
        url: '/assets/images/cubes/green.png',
        forPlayer: true,
    },
    [GamePlayerColorIdEnum.Blue]: {
        column: 3,
        name: 'Синий',
        color: '#376EB6',
        url: '/assets/images/cubes/blue.png',
        forPlayer: true,
    },
    [GamePlayerColorIdEnum.Purple]: {
        column: 4,
        name: 'Фиолетовый',
        color: '#CC4786',
        url: '/assets/images/cubes/blue.png',
        forPlayer: true,
    },
    [GamePlayerColorIdEnum.Orange]: {
        column: 5,
        name: 'Оранжевый',
        color: '#F47C34',
        url: '/assets/images/cubes/blue.png',
        forPlayer: true,
    },
    [GamePlayerColorIdEnum.Black]: {
        column: -1,
        name: 'Чёрный',
        color: '#000000',
        url: '/assets/images/cubes/black.png',
        forPlayer: false,
    },
};


