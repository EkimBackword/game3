import { RelicHuntersTileTypes } from './tile';

export const RelicHuntersBenefitSettings = {
    size: 160,
    url: '/assets/relic-hunters/benefits.png',
    backgroundSize: '600% 300%',
}

export interface RelicHuntersBenefit {
    move: number;
    research: number;
    coins: number;
    draw: number;
    trash: number;
    rest: number;
    tileType: RelicHuntersTileTypes[];
}

export interface RhBenefitComponentData {
    key: keyof RelicHuntersBenefit;
    tileType?: RelicHuntersTileTypes;
    value: number;
    size: number;
    inlineView: boolean;
    hideValue?: boolean;
}

export interface RelicHuntersBenefitTaxonomyItem {
    name: string;
    description: string;
    column: number | null;
    showOnPlayerArea: boolean;
}

export const RelicHuntersBenefitTaxonomy: Record<keyof RelicHuntersBenefit, RelicHuntersBenefitTaxonomyItem> = {
    move: {
        name: 'Перемещение',
        description: 'Для выполнения перемещения у вас должно быть столько же (или больше) очков перемещения, сколько указано на плитке.',
        column: 0,
        showOnPlayerArea: true,
    },
    research: {
        name: 'Раскопки',
        description: 'Если на плитке местности есть изображение лопаты, то для получения награды, изображённой в центре такой плитки, вам нужно провести на нём раскопки.',
        column: 1,
        showOnPlayerArea: true,
    },
    coins: {
        name: 'Монеты',
        description: 'Монеты используются для покупки новых карт в лагере.',
        column: 2,
        showOnPlayerArea: true,
    },
    draw: {
        name: 'Вербовка',
        description: 'При использовании этого эффекта возьмите в руку с верха своей колоды столько карт исследователей, сколько указано в значении эффекта вербовки.',
        column: 3,
        showOnPlayerArea: false,
    },
    trash: {
        name: 'Удаление',
        description: 'При использовании этого эффекта вы можете удалить из своей руки или из стопки сброса столько карт, сколько указано в значении эффекта удаления (или меньше). Эффект удаления нельзя применять к картам с эффектами удаления.',
        column: 4,
        showOnPlayerArea: false,
    },
    rest: {
        name: 'Отдых',
        description: ' При использовании этого эффекта просмотрите свою стопку сброса, выберите из неё столько карт, сколько указано в значении эффекта отдыха, и положите их под низ своей колоды исследователей. Эти карты можно класть в любом порядке. Эффект отдыха нельзя применять к картам с эффектами отдыха.',
        column: 5,
        showOnPlayerArea: false,
    },
    tileType: {
        name: 'Профессионал местности',
        description: 'Вы можете игнорировать требования соответствующей плитки местности.',
        column: null,
        showOnPlayerArea: false,
    },
}
