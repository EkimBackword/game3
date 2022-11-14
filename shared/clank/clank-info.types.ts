export enum ClankElementType {
    skill = 'skill', // Навык
    sword = 'sword', // Меч
    boot = 'boot', // Ботинок
    clank = 'clank', // Кланк / шум
    heal = 'heal', // Здоровье
    pyramid_dice = 'pyramid_dice', // Бросок кубика
    curse = 'curse', // Проклятье
    coin = 'coin', // Монетка
    card = 'card', // Карта. Например, надо сбросить карту
    companion = 'companion', // Если у вас есть союзник
    monkey_idol = 'monkey_idol', // Если у вас есть союзник
    mastery_token = 'mastery_token', // Если у вас есть жетон мастерства
    dragon_egg = 'dragon_egg', // Если у вас есть драконье яйцо
    cup = 'cup', // Если у вас есть кубок
    teleport = 'teleport', // Возможность телепортироваться в соседнее помещение
    artefact = 'artefact', // Наличие артефакта
    key = 'key', // Наличие отмычек
    minor_secret = 'minor_secret', // Наличие отмычек
    major_secret = 'major_secret', // Наличие отмычек
}

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