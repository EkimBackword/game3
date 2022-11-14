import { ClankCardState } from './clank-card.types';
import { ClankCostInfo } from './clank-info.types';

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
    /** Информация о наличии очков для действий в раунде */
    benefitInfo: ClankCostInfo;
    /** Карта игры */
    deck: ClankCardState[];
    /** Карта игры */
    hand: ClankCardState[];
    /** Карта игры */
    board: ClankCardState[];
    /** Карта игры */
    discard: ClankCardState[];
    /** Карта игры */
    trash: ClankCardState[];
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
}

export const GamePlayerColorIds = Object.keys(GamePlayerColorIdEnum) as GamePlayerColorIdEnum[];

export interface GamePlayerColorInfo {
    positionX: number,
    name: string;
    color: string;
}

export const GamePlayerColorList: Record<GamePlayerColorIdEnum, GamePlayerColorInfo> = {
    [GamePlayerColorIdEnum.Red]: {
        positionX: 0,
        name: 'Красный',
        color: '#EF4E5A',
    },
    [GamePlayerColorIdEnum.Yellow]: {
        positionX: 100,
        name: 'Жёлтый',
        color: '#FFDB46',
    },
    [GamePlayerColorIdEnum.Green]: {
        positionX: 200,
        name: 'Зелёный',
        color: '#339643',
    },
    [GamePlayerColorIdEnum.Blue]: {
        positionX: 300,
        name: 'Синий',
        color: '#376EB6',
    },
};


