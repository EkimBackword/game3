import {
    ClankCostInfo,
    ClankDlcEnum,
    ClankEffect,
    ClankTarget,
} from '../clank.types';

export const ClankCardHeight = 1039;

export const ClankCardWidth = 745;

export interface ClankCardState {
    id: string;
    position: ClankCardPositionEnum;
    player_id?: string;
}

export enum ClankCardPositionEnum {
    shareDeck,
    shareReserve,
    playerDeck,
    playerHand,
    playerBoard,
    playerDiscard,
    playerTrash,
}

export interface ClankSelectDeckValue {
    id: ClankDlcEnum;
    name: string;
    value: boolean;
}

export interface ClankCardConfig {
    /** Строка для поиска картинки */
    row: number;
    /** Колонка для поиска картинки */
    column: number;
    /** Имя */
    name: string;
    /** Доступно всегда или нет */
    isReserve?: boolean;
    /** Только в недрах */
    onlyDepthsArea?: boolean;
    /** Тип */
    type: ClankCardType;
    /** События при покупка */
    acquire?: ClankCardActionList;
    /** Выгода */
    benefit?: ClankCostInfo;
    /** События при появление */
    arrive?: ClankCardActionList;
    /** Опасность сколько кубиков надо добавить к значению дракона */
    danger?: number;
    /** События при разыгрывании */
    actions?: ClankCardActionList;
    /** Победные очки */
    points?: ClankCardPointInfo;
    /** Количество в колоде (-1 не убирается с поля) */
    count: number;
}

export interface ClankCardPointInfo {
    value: number;
    has?: {
        cost: ClankCostInfo;
        count: number;
    };
}

export enum ClankCardType {
    start = 'start',
    basiс = 'basiс',
    device = 'device',
    monster = 'monster',
    companion = 'companion',
    gem = 'gem',
}

export interface ClankCardActionList {
    /** Должны ли быть все события выполнены */
    type?: 'every' | 'some';
    /** Если тип 'some', то сколько нужно выбрать */
    count?: number;
    /** Список событий */
    list?: ClankCardAction[];
    /** Общая стоимость */
    cost?: ClankCostInfo;
    /** Атака дракона */
    isDragonAttack?: boolean;
}

export interface ClankCardAction {
    /** Цель */
    target: ClankTarget;
    /** Стоимость */
    cost?: ClankCostInfo;
    /** Проверка наличия */
    has?: ClankCostInfo;
    /** Выгода */
    benefit?: ClankCostInfo;
    /** Эффект в течении хода */
    effect?: ClankEffect[];
    /** Избавиться от разыкгранных карт */
    trash?: ClankCardName[];
    /** Атака дракона */
    isDragonAttack?: boolean;
}

/** Ключевые карты, на которые могут ссылаться другие карты */
export enum ClankCardName {
    Burgle = 'Взломать сундук',
    Scramble = 'Сноровка',
    Sidestep = 'Обходной путь',
    Stumble = 'Препятствие',
}
