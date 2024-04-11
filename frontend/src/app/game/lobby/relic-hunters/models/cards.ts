import { RelicHuntersBenefit } from './benefit';
import {
    RelicHuntersHeroColorEnum,
    RelicHuntersHeroColorIds,
    RelicHuntersHeroColorTaxonomy,
} from './hero';
import { RelicHuntersTileTypes } from './tile';

export enum RelicHuntersCardTypeEnum {
    hero = 'hero',
    start = 'start',
    assistant = 'assistant',
    reserv = 'reserv',
    deck = 'deck',
}

export interface RelicHuntersCardShortInfo {
    url: string;
    name: string;
    type: RelicHuntersCardTypeEnum;
    color?: RelicHuntersHeroColorEnum;
    price?: number;
    benefit: Partial<RelicHuntersBenefit>;
    count: number;
}

export interface RelicHuntersCardInfo extends RelicHuntersCardShortInfo {
    id: number;
    index: number;
    isOpen: boolean;
}

export interface RelicHuntersCardSelectable {
    selected: boolean;
    disabled?: boolean;
    card: RelicHuntersCardInfo;
}

export const RelicHuntersCardSettings = {
    header: 30,
    width: 178,
    height: 280,
    padding: 20,
    cardStep: 120,
    backUrl: '/assets/relic-hunters/cards/BACK.JPG',
    backgroundSize: '100% 100%',
}

export const RelicHuntersCardTaxonomy: RelicHuntersCardShortInfo[] = [
    // Стартовые
    {
        url: '/assets/relic-hunters/cards/start/01.JPG',
        name: 'Исследователь Дронт',
        type: RelicHuntersCardTypeEnum.start,
        benefit: {
            research: 1,
        },
        count: 2,
    },
    {
        url: '/assets/relic-hunters/cards/start/02.JPG',
        name: 'Ассистент Геккон',
        type: RelicHuntersCardTypeEnum.start,
        benefit: {
            move: 1,
        },
        count: 5,
    },
    {
        url: '/assets/relic-hunters/cards/start/03.JPG',
        name: 'Менеджер Геккон',
        type: RelicHuntersCardTypeEnum.start,
        benefit: {
            move: 2,
        },
        count: 1,
    },
    {
        url: '/assets/relic-hunters/cards/start/04.JPG',
        name: 'Секретарь Котик',
        type: RelicHuntersCardTypeEnum.start,
        benefit: {
            coins: 1,
        },
        count: 1,
    },
    // Герои
    {
        url: '/assets/relic-hunters/cards/start/05.JPG',
        name: RelicHuntersHeroColorTaxonomy[RelicHuntersHeroColorEnum.Blue].name,
        type: RelicHuntersCardTypeEnum.hero,
        color: RelicHuntersHeroColorEnum.Blue,
        benefit: {
            move: 1,
            research: 1,
            coins: 1,
        },
        count: 1,
    },
    {
        url: '/assets/relic-hunters/cards/start/06.JPG',
        name: RelicHuntersHeroColorTaxonomy[RelicHuntersHeroColorEnum.Yellow].name,
        type: RelicHuntersCardTypeEnum.hero,
        color: RelicHuntersHeroColorEnum.Yellow,
        benefit: {
            move: 1,
            research: 1,
            coins: 1,
        },
        count: 1,
    },
    {
        url: '/assets/relic-hunters/cards/start/07.JPG',
        name: RelicHuntersHeroColorTaxonomy[RelicHuntersHeroColorEnum.Red].name,
        type: RelicHuntersCardTypeEnum.hero,
        color: RelicHuntersHeroColorEnum.Red,
        benefit: {
            move: 1,
            research: 1,
            coins: 1,
        },
        count: 1,
    },
    {
        url: '/assets/relic-hunters/cards/start/08.JPG',
        name: RelicHuntersHeroColorTaxonomy[RelicHuntersHeroColorEnum.Green].name,
        type: RelicHuntersCardTypeEnum.hero,
        color: RelicHuntersHeroColorEnum.Green,
        benefit: {
            move: 1,
            research: 1,
            coins: 1,
        },
        count: 1,
    },
    // Ассистент
    {
        url: '/assets/relic-hunters/cards/reserv/01.JPG',
        name: 'Счастливый Слонон',
        type: RelicHuntersCardTypeEnum.assistant,
        benefit: {
        },
        count: 8,
    },
    // Резерв
    {
        url: '/assets/relic-hunters/cards/reserv/02.JPG',
        name: 'Сестричек-проныр',
        type: RelicHuntersCardTypeEnum.reserv,
        price: 3,
        benefit: {
            move: 2,
        },
        count: 10,
    },
    // Колода
    {
        url: '/assets/relic-hunters/cards/deck/01.JPG',
        name: 'Спонсор Свинка',
        type: RelicHuntersCardTypeEnum.deck,
        price: 4,
        benefit: {
            coins: 3,
            trash: 2,
        },
        count: 2,
    },
    {
        url: '/assets/relic-hunters/cards/deck/02.JPG',
        name: 'Скупщик Енот',
        price: 2,
        type: RelicHuntersCardTypeEnum.deck,
        benefit: {
            coins: 2,
            trash: 1,
        },
        count: 2,
    },
    {
        url: '/assets/relic-hunters/cards/deck/03.JPG',
        name: 'Скаут Муравьед',
        price: 2,
        type: RelicHuntersCardTypeEnum.deck,
        benefit: {
            draw: 2,
        },
        count: 2,
    },
    {
        url: '/assets/relic-hunters/cards/deck/04.JPG',
        name: 'Выживальщик Марлин',
        price: 4,
        type: RelicHuntersCardTypeEnum.deck,
        benefit: {
            draw: 3,
        },
        count: 2,
    },
    {
        url: '/assets/relic-hunters/cards/deck/05.JPG',
        name: 'Разведчик Жираф',
        price: 2,
        type: RelicHuntersCardTypeEnum.deck,
        benefit: {
            research: 2,
        },
        count: 2,
    },
    {
        url: '/assets/relic-hunters/cards/deck/06.JPG',
        name: 'Профессор Кулик',
        price: 4,
        type: RelicHuntersCardTypeEnum.deck,
        benefit: {
            research: 3,
        },
        count: 2,
    },
    {
        url: '/assets/relic-hunters/cards/deck/07.JPG',
        name: 'Демагог Жеребчик',
        price: 4,
        type: RelicHuntersCardTypeEnum.deck,
        benefit: {
            move: 2,
            research: 2,
            coins: 2,
        },
        count: 2,
    },
    {
        url: '/assets/relic-hunters/cards/deck/08.JPG',
        name: 'Гидролог утконос',
        price: 3,
        type: RelicHuntersCardTypeEnum.deck,
        benefit: {
            tileType: [RelicHuntersTileTypes.River],
        },
        count: 2,
    },
    {
        url: '/assets/relic-hunters/cards/deck/09.JPG',
        name: 'Связист Гадюка',
        price: 3,
        type: RelicHuntersCardTypeEnum.deck,
        benefit: {
            tileType: [RelicHuntersTileTypes.Forest],
        },
        count: 2,
    },
    {
        url: '/assets/relic-hunters/cards/deck/10.JPG',
        name: 'Гид Верблюдица',
        price: 4,
        type: RelicHuntersCardTypeEnum.deck,
        benefit: {
            tileType: [RelicHuntersTileTypes.Desert],
        },
        count: 2,
    },
    {
        url: '/assets/relic-hunters/cards/deck/11.JPG',
        name: 'Скалолаз Горный козёл',
        price: 4,
        type: RelicHuntersCardTypeEnum.deck,
        benefit: {
            tileType: [RelicHuntersTileTypes.Mountain],
        },
        count: 2,
    },
    {
        url: '/assets/relic-hunters/cards/deck/12.JPG',
        name: 'Гид Журавушка',
        price: 4,
        type: RelicHuntersCardTypeEnum.deck,
        benefit: {
            move: 3,
        },
        count: 3,
    },
    {
        url: '/assets/relic-hunters/cards/deck/13.JPG',
        name: 'Пилот Горихвостка',
        price: 6,
        type: RelicHuntersCardTypeEnum.deck,
        benefit: {
            move: 4,
        },
        count: 3,
    },
    {
        url: '/assets/relic-hunters/cards/deck/14.JPG',
        name: 'Следователь Гиена',
        price: 3,
        type: RelicHuntersCardTypeEnum.deck,
        benefit: {
            move: 2,
            research: 2,
        },
        count: 2,
    },
    {
        url: '/assets/relic-hunters/cards/deck/15.JPG',
        name: 'Охотник за сокровищами Носорог',
        price: 5,
        type: RelicHuntersCardTypeEnum.deck,
        benefit: {
            move: 3,
            research: 3,
        },
        count: 2,
    },
    {
        url: '/assets/relic-hunters/cards/deck/16.JPG',
        name: 'Травница Полоз',
        price: 5,
        type: RelicHuntersCardTypeEnum.deck,
        benefit: {
            rest: 3,
        },
        count: 2,
    },
    {
        url: '/assets/relic-hunters/cards/deck/17.JPG',
        name: 'Шеф-повар Морж',
        price: 3,
        type: RelicHuntersCardTypeEnum.deck,
        benefit: {
            rest: 2,
        },
        count: 2,
    },
];

export function getRelicHuntersDeck() {
    let lastId = 0;
    return RelicHuntersCardTaxonomy.reduce<RelicHuntersCardInfo[]>((result, item, index) => {
        const cards = Array(item.count).fill(0).flatMap(() => {
            const colors = item.type === RelicHuntersCardTypeEnum.start
                ? RelicHuntersHeroColorIds
                : [item.color]
            return colors.map(color => {
                const card: RelicHuntersCardInfo = {
                    ...item,
                    color,
                    id: lastId++,
                    index,
                    isOpen: false,
                };
                return card;
            })
        })
        return [...result, ...cards];
    }, [])
}
