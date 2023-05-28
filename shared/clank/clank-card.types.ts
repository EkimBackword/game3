import { GameInfoState } from './clank-game.types';
import {
  ClankCardType,
  ClankCostInfo,
  ClankDlcEnum,
  ClankTarget,
} from './clank-info.types';
import { ClankPlayerConfig } from './clank-player.types';

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

export interface ClankCardBaseConfigEventResult {
    state: GameInfoState;
    success: boolean;
}

export interface ClankCardBaseConfigEvents {
    /** при появление */
    onArrive?: ClankCardBaseConfigEventInfo;
    /** при покупке */
    onAcquire?: ClankCardBaseConfigEventInfo;
    /** при разыгрывании */
    onUse?: ClankCardBaseConfigEventInfo;
}

export interface ClankCardBaseConfigEventInfo {
    /** Надпись на кнопке */
    actionName?: string;
    /** Можно ли отменить действие */
    canCancel?: boolean;
    /** Цель */
    target?: ClankTarget;
    /** Атака дракона */
    isDragonAttack?: boolean;
    /** Стоимость */
    cost?: ClankCostInfo;
    /** Выгода */
    benefit?: ClankCostInfo;
    /** Функция */
    callback?: (
        state: GameInfoState,
        player: ClankPlayerConfig,
        card: ClankCardConfig,
    ) => Promise<boolean>;
}

export const ClankCardBaseConfigEventInfoByType: Record<keyof ClankCardBaseConfigEvents, {
    text: string,
}> = {
    onArrive: {
        text: 'На рынке появилась карта',
    },
    onAcquire: {
        text: 'купил карту',
    },
    onUse: {
        text: 'использовал карту',
    },
};

export interface ClankCardBaseConfig {
    /** Уникальная строка для поиска карты */
    uniq_find_string?: string;
    /** Строка для поиска картинки */
    row: number;
    /** Колонка для поиска картинки */
    column: number;
    /** Имя */
    name: string;
    /** Имя */
    description: string;
    /** Доступно всегда или нет */
    isReserve?: boolean;
    /** Только в недрах */
    onlyDepthsArea?: boolean;
    /** Только в недрах */
    onlyCrystalCave?: boolean;
    /** Тип */
    type: ClankCardType;
    /** Опасность сколько кубиков надо добавить к значению дракона */
    danger?: number;
    /** Количество в колоде (-1 не убирается с поля) */
    count: number;
    /** test */
    events?: ClankCardBaseConfigEvents & {
        /** при подсчёте очков */
        getPoints?: (state: GameInfoState, player: ClankPlayerConfig) => number;
    };
}

export interface ClankCardConfig extends ClankCardBaseConfig, ClankDeckShortConfig {
    /**
     * Уникальный id
     * @description ${config.dlc_name}_${start_index}__${copy_index}_${config.playerId}
     */
    id: string;
    /** Название */
    name: string;
    /** При перемешивании колоды выставляется новая позиция */
    index: number;
    /** Не изменный индекс при иницыализации */
    initIndex: number;
    position: ClankCardPositionEnum;
    player_id?: string;
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
    /** Описание */
    costDescription?: string;
    /** Проверка наличия */
    has?: {
        cost: ClankCostInfo;
        count: number;
    };
    /** Выгода */
    benefit?: ClankCostInfo;
    /** Описание */
    benefitDescription?: string;
    /** Атака дракона */
    isDragonAttack?: boolean;

}

/** Ключевые карты, на которые могут ссылаться другие карты */
export enum ClankCardName {
    All = 'Любую',
    Burgle = 'Взломать сундук',
    Scramble = 'Проскользнуть мимо',
    Sidestep = 'Шаг вперёд',
    Stumble = 'Споткнулся!',
    SecretTom = 'Книга тайн',
}
