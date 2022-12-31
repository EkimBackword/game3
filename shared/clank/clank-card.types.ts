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
    /** при сбрасывании */
    onDiscard?: ClankCardBaseConfigEventInfo;
}

export interface ClankCardBaseConfigEventInfo {
    /** Надпись на кнопке */
    actionName?: string;
    /** Цель */
    target?: ClankTarget;
    /** Атака дракона */
    isDragonAttack?: boolean;
    /** Стоимость */
    cost?: ClankCostInfo;
    /** Выгода */
    benefit?: ClankCostInfo;
    /** Функция */
    callback?: (state: GameInfoState, player: ClankPlayerConfig) => Promise<boolean>;
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
    onDiscard: {
        text: 'сбросил карту',
    },
};

export interface ClankCardBaseConfig {
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

const count = {
    "10000": 15,
    "10001": 1,
    "10002": 15,
    "10003": 12,
    "10004": 24,
    "10005": 4,
    "10006": 4,
    "10007": 8,
    "10008": 1,
    "10009": 1,

    "10010": 2,
    "10011": 1,
    "10012": 2,
    "10013": 1,
    "10014": 2,
    "10015": 2,
    "10016": 1,
    "10017": 1,
    "10018": 1,
    "10019": 1,

    "10020": 1,
    "10021": 1,
    "10022": 2,
    "10023": 1,
    "10024": 1,
    "10025": 1,
    "10026": 1,
    "10027": 2,
    "10028": 2,
    "10029": 1,

    "10030": 1,
    "10031": 2,
    "10032": 2,
    "10033": 1,
    "10034": 1,
    "10035": 1,
    "10036": 1,
    "10037": 2,
    "10038": 3,
    "10039": 1,

    "10040": 2,
    "10041": 2,
    "10042": 1,
    "10043": 2,
    "10044": 2,
    "10045": 2,
    "10046": 2,
    "10047": 1,
    "10048": 1,
    "10049": 1,

    "10050": 2,
    "10051": 1,
    "10052": 2,
    "10053": 1,
    "10054": 2,
    "10055": 1,
    "10056": 1,
    "10057": 2,
    "10058": 2,
    "10059": 3,

    "10060": 2,
    "10061": 1,
    "10062": 2,
    "10063": 2,
    "10064": 1,
    "10065": 2,
    "10066": 3,
    "10067": 2,
    "10068": 3,
    "10069": 2,
};
