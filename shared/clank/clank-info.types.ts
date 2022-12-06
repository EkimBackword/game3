export enum ClankCardType {
    start = 'start',
    basiс = 'basiс',
    device = 'device',
    monster = 'monster',
    companion = 'companion',
    gem = 'gem',
}

export const ClankCardTypeList = Object.values(ClankCardType);

export enum ClankElementByTurn {
    skill = 'skill', // Навык
    sword = 'sword', // Меч
    boot = 'boot', // Ботинок
    teleport = 'teleport', // Возможность телепортироваться в соседнее помещение
}

export const ClankElementByTurnList = Object.values(ClankElementByTurn);

export enum ClankElementByGame {
    heal = 'heal', // Здоровье
    coin = 'coin', // Монетка
    curse = 'curse', // Проклятье
    mastery_token = 'mastery_token', // Количество жетонов мастерства
    minor_secret = 'minor_secret', // Количество малого секрета
    major_secret = 'major_secret', // Количество большого секрета
    artefact = 'artefact', // Количество артефактов
}

export const ClankElementByGameList = Object.values(ClankElementByGame);

export enum ClankElementByToken {
    monkey_idol = 'monkey_idol', // Количество идолов
    dragon_egg = 'dragon_egg', // Количество драконьих яиц
    cup = 'cup', // Количество кубоков
}

export const ClankElementByTokenList = Object.values(ClankElementByToken);

export enum ClankElementByMarket {
    key = 'key', // Количество отмычек
    backpack = 'backpack', // Количество рюкзоков
    crown = 'crown', // Количество корон
}

export const ClankElementByMarketList = Object.values(ClankElementByMarket);

export enum ClankElementByActions {
    dragon_rage = 'dragon_rage', // Если у вас есть драконье яйцо
    card = 'card', // Карта. Например, надо сбросить или добрать карту
    trashCard = 'trashCard', // Избавиться от карты
    pyramid_dice = 'pyramid_dice', // Бросок кубика
    clank = 'clank', // Кланк / шум
}

export const ClankElementByActionsList = Object.values(ClankElementByActions);

export const ClankElementTypeEnum = {
    ...ClankCardType,
    ...ClankElementByTurn,
    ...ClankElementByGame,
    ...ClankElementByToken,
    ...ClankElementByMarket,
    ...ClankElementByActions,
}

export const ClankElementTypeList = Object.values(ClankElementTypeEnum);

export type ClankElementType = ClankCardType
    | ClankElementByTurn
    | ClankElementByGame
    | ClankElementByToken
    | ClankElementByMarket
    | ClankElementByActions;

export type ClankCostInfo = Partial<Record<ClankElementType, number>>;

export enum ClankDlcEnum {
    clank = 'clank',
    clank_sunken_treasures = 'clank_sunken_treasures',
    clank_proklyatie_mumii = 'clank_proklyatie_mumii',
    clank_expeditions_goldand_silk = 'clank_expeditions_goldand_silk',
    clank_temple_of_the_ape_lords = 'clank_temple_of_the_ape_lords',
    clank_adventuring_party = 'clank_adventuring_party',
}

export const ClankDlcName: Record<ClankDlcEnum, string> = {
    [ClankDlcEnum.clank]: 'Кланк! Подземное приключение',
    [ClankDlcEnum.clank_sunken_treasures]: 'Кланк! Затонувшие сокровища',
    [ClankDlcEnum.clank_proklyatie_mumii]: 'Кланк! Проклятие мумии',
    [ClankDlcEnum.clank_expeditions_goldand_silk]: 'Кланк! Экспедиции: Золото и шёлк',
    [ClankDlcEnum.clank_temple_of_the_ape_lords]: 'Кланк! Экспедиции: Храм повелителей обезьян',
    [ClankDlcEnum.clank_adventuring_party]: 'Кланк! Шайка авантюристов',
};

export const ClankDlcList = (Object.keys(ClankDlcName) as ClankDlcEnum[]).map((key) => ({
    id: key,
    name: ClankDlcName[key]
}));

export enum ClankEffect {
    ignore_crystal_cave,
    ignore_monster,
    gem_cost_less_2,
}

export enum ClankTarget {
    current = 'current',
    other = 'other',
    all = 'all',
}