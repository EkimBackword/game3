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

export interface ClankElementTypeInfo {
    name: string;
    url: string;
}

export const ClankElementTypeMap: Record<ClankElementType, ClankElementTypeInfo> = {
    [ClankElementType.skill]: {
        name: 'Навык',
        url: '/assets/images/skill.png',
    },
    [ClankElementType.sword]: {
        name: 'Меч',
        url: '/assets/images/sword.png',
    },
    [ClankElementType.boot]: {
        name: 'Ботинок',
        url: '/assets/images/boot.png',
    },
    [ClankElementType.clank]: {
        name: 'Шум',
        url: '/assets/images/clank.png',
    },
    [ClankElementType.heal]: {
        name: 'Здоровье',
        url: '/assets/images/heal.png',
    },
    [ClankElementType.pyramid_dice]: {
        name: 'Кубик пирамиды',
        url: '/assets/images/pyramid_dice.png',
    },
    [ClankElementType.curse]: {
        name: 'Проклятие',
        url: '/assets/images/tokens/clank_proklyatie_mumii/token.jpg',
    },
    [ClankElementType.coin]: {
        name: 'Монета',
        url: '/assets/images/coins/coins.png',
    },
    [ClankElementType.card]: {
        name: 'Карта',
        url: '/assets/images/cards/cards_back.jpg',
    },
    [ClankElementType.companion]: {
        name: 'Компаньон',
        url: '/assets/images/companion.png',
    },
    [ClankElementType.monkey_idol]: {
        name: 'Обезьяний идол',
        url: '/assets/images/tokens/idol_5_1.jpg',
    },
    [ClankElementType.mastery_token]: {
        name: 'Жетон мастерства',
        url: '/assets/images/tokens/master.png',
    },
    [ClankElementType.dragon_egg]: {
        name: 'Драконье яйцо',
        url: '/assets/images/secrets/small_egg.jpg',
    },
    [ClankElementType.cup]: {
        name: 'Кубок',
        url: '/assets/images/secrets/big_cup.jpg',
    },
    [ClankElementType.teleport]: {
        name: 'Телепорт',
        url: '/assets/images/teleport.png',
    },
    [ClankElementType.artefact]: {
        name: 'Артефакт',
        url: '/assets/images/artefact.png',
    },
    [ClankElementType.key]: {
        name: 'Отмычки',
        url: '/assets/images/market/key_token.jpg',
    },
    [ClankElementType.minor_secret]: {
        name: 'Маленький секрет',
        url: '/assets/images/secrets/small_back.jpg',
    },
    [ClankElementType.major_secret]: {
        name: 'Большой секрет',
        url: '/assets/images/secrets/big_back.jpg',
    },
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
