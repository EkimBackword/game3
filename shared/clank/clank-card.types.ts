import {
  ClankCostInfo,
  ClankDlcEnum,
  ClankEffect,
  ClankTarget,
} from './clank-info.types';

export const ClankCardHeight = 1039;

export const ClankCardWidth = 745;

export enum ClankCardPositionEnum {
    dungeonDeck,
    dungeonRow,
    reserveRow,
    playerDeck,
    playerHand,
    playerBoard,
    playerDiscard,
    playerTrash,
}

export const ClankCardPositionNames: Record<ClankCardPositionEnum, string> = {
    [ClankCardPositionEnum.dungeonDeck]: 'в колоду подземелья',
    [ClankCardPositionEnum.dungeonRow]: 'в подземный ряд',
    [ClankCardPositionEnum.reserveRow]: 'в общий резерв',
    [ClankCardPositionEnum.playerDeck]: 'в колоду игрока',
    [ClankCardPositionEnum.playerHand]: 'в руку игрока',
    [ClankCardPositionEnum.playerBoard]: 'на стол игрока',
    [ClankCardPositionEnum.playerDiscard]: 'в сброс игрока',
    [ClankCardPositionEnum.playerTrash]: 'в корзину игрока',
};

export interface ClankSelectDeckValue {
    id: ClankDlcEnum;
    name: string;
    value: boolean;
    disabled: boolean;
}

export interface ClankDeckSpriteInfo {
    dlc_name: ClankDlcEnum;
    url: string;
    /** Масштаб одной карты ко всему спрайту 1000% 700% */
    backgroundSize: string;
}

export interface ClankDeckShortConfig extends ClankDeckSpriteInfo {
    position: ClankCardPositionEnum;
    player_id?: string;
}

export interface ClankDeckConfig extends ClankDeckShortConfig {
    cards: ClankCardBaseConfig[];
}

export interface ClankCardBaseConfig {
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

export interface ClankCardState {
    /**
     * Уникальный id
     * @description ${config.dlc_name}_${start_index}__${copy_index}_${config.playerId}
     */
    id: string;
    /** При перемешивании колоды выставляется новая позиция */
    index: number;
    position: ClankCardPositionEnum;
    player_id?: string;
}

export interface ClankCardConfig extends ClankCardBaseConfig, ClankDeckShortConfig, ClankCardState {
    /**
     * Строка для поиска карты в репозитории
     * @description ${config.dlc_name}_${start_index}
     */
    find_string: string;
    /** Индекс копии */
    copy_index: number;
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
    has?: {
        cost: ClankCostInfo;
        count: number;
    };
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
