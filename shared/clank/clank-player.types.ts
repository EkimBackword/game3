import { ClankArtifactConfig } from './clank-artifact.types';
import { ClankCardState } from './clank-card.types';
import { ClankCostInfo } from './clank-info.types';
import { ClankTokenState } from './clank-token.types';

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
    /** Колода */
    deck: ClankCardState[];
    /** Карты в руке */
    hand: ClankCardState[];
    /** Разыгранные карты */
    board: ClankCardState[];
    /** сброшенные карты */
    discard: ClankCardState[];
    /** Карты от которых избавились */
    trash: ClankCardState[];
    /** Жетоны */
    tokens: ClankTokenState[];
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


