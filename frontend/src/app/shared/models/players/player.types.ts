export interface ClankPlayerConfig {
    /** Id пользователя */
    id: string;
    /** Имя пользователя */
    name: string;
    /** Id цвета игрока */
    colorId: GamePlayerColorIdEnum;
    /** Онлайн или оффлайн */
    statusId: GamePlayerStatusIdEnum;
    /** Позиция мипла на карте */
    elementId: number;
}

export enum GamePlayerStatusIdEnum {
    Online,
    Offline,
}

export enum GamePlayerColorIdEnum {
    Red,
    Yellow,
    Green,
    Blue,
}

export interface GamePlayerColorInfo {
    name: string;
    color: string;
}

export const GamePlayerColorList: Record<GamePlayerColorIdEnum, GamePlayerColorInfo> = {
    [GamePlayerColorIdEnum.Red]: {
        name: 'Красный',
        color: '#EF4E5A',
    },
    [GamePlayerColorIdEnum.Yellow]: {
        name: 'Жёлтый',
        color: '#FFDB46',
    },
    [GamePlayerColorIdEnum.Green]: {
        name: 'Зелёный',
        color: '#339643',
    },
    [GamePlayerColorIdEnum.Blue]: {
        name: 'Синий',
        color: '#376EB6',
    },
};


