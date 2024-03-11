export enum EscapeFromAtlantisEndConditionEnum {
    /** Игра заканчивается после открытия изображения вулкана */
    Basic = 'Basic',
    /** Игра заканчивается когда последний мипл покидает карту */
    LastMeeple = 'LastMeeple',
    /** Игра заканчивается когда последняя плитка покидает игру */
    LastTile = 'LastTile',
}

export const EscapeFromAtlantisEndConditionIds = Object.keys(EscapeFromAtlantisEndConditionEnum) as EscapeFromAtlantisEndConditionEnum[];

export interface EscapeFromAtlantisEndConditionInfo {
    name: string;
    description: string;
}

export const EscapeFromAtlantisEndConditionTaxanomy: Record<
    EscapeFromAtlantisEndConditionEnum,
    EscapeFromAtlantisEndConditionInfo
> = {
    [EscapeFromAtlantisEndConditionEnum.Basic]: {
        name: 'Базовая концовка',
        description: 'Игра заканчивается после открытия изображения вулкана',
    },
    [EscapeFromAtlantisEndConditionEnum.LastMeeple]: {
        name: 'До последнего исследователя',
        description: 'Игра заканчивается когда последний исследователь покидает карту',
    },
    [EscapeFromAtlantisEndConditionEnum.LastTile]: {
        name: 'До последней плитки',
        description: 'Игра заканчивается когда последняя плитка покидает игру',
    },
}

export enum EscapeFromAtlantisWinConditionEnum {
    /** Каждый исследователь имеет свою ценность */
    Basic = 'Basic',
    /** Все исследователи равны */
    AllMeeplesEqual = 'AllMeeplesEqual',
}

export const EscapeFromAtlantisWinConditionIds = Object.keys(EscapeFromAtlantisWinConditionEnum) as EscapeFromAtlantisWinConditionEnum[];

export interface EscapeFromAtlantisWinConditionInfo {
    name: string;
    description: string;
}

export const EscapeFromAtlantisWinConditionTaxanomy: Record<
    EscapeFromAtlantisWinConditionEnum,
    EscapeFromAtlantisWinConditionInfo
> = {
    [EscapeFromAtlantisWinConditionEnum.Basic]: {
        name: 'Базовый подсчёт',
        description: 'В конце игры при подсчёте победных отчков учитывается значимость исследователя',
    },
    [EscapeFromAtlantisWinConditionEnum.AllMeeplesEqual]: {
        name: 'Все равны',
        description: 'В конце игры при подсчёте победных отчков все исследователи равны',
    },
}
