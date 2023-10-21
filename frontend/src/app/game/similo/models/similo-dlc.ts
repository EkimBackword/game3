import {
    SimiloCardBaseConfig,
    SimiloCardConfig,
    SimiloCardPosition,
    SimiloDlcDeck,
    SimiloDlcEnum,
} from '@shared/similo/similo-dlc.types';

export const SimiloDlcDeckList: SimiloDlcDeck[] = [
    {
        name: 'Гарри Поттер',
        description: 'Не только мальчик который выжил',
        dlc_name: SimiloDlcEnum.HarryPotter,
        url: '/assets/similo/similo-harry-potter.png',
        url_back: '/assets/similo/similo-harry-potter-back.png',
        backgroundSize: '400% 1000%',
        cards: new Array(39).fill(0).map((_, i) => {
            const card: SimiloCardBaseConfig = {
                name: '',
                description: '',
                row: Math.floor(i / 4),
                column: i % 4
            };
            return card;
        })
    },
    {
        name: 'Зоопарк',
        description: 'Дикие животные',
        dlc_name: SimiloDlcEnum.WildAnimals,
        url: '/assets/similo/similo-wild-animals.png',
        url_back: '/assets/similo/similo-wild-animals-back.png',
        backgroundSize: '400% 800%',
        cards: new Array(30).fill(0).map((_, i) => {
            const card: SimiloCardBaseConfig = {
                name: '',
                description: '',
                row: Math.floor(i / 4),
                column: i % 4
            };
            return card;
        })
    },
    {
        name: 'Животные',
        description: 'Домашние животные',
        dlc_name: SimiloDlcEnum.Animals,
        url: '/assets/similo/similo-animals.png',
        url_back: '/assets/similo/similo-animals-back.png',
        backgroundSize: '400% 800%',
        cards: new Array(30).fill(0).map((_, i) => {
            const card: SimiloCardBaseConfig = {
                name: '',
                description: '',
                row: Math.floor(i / 4),
                column: i % 4
            };
            return card;
        })
    },
    {
        name: 'История',
        description: 'По страницам старых лет',
        dlc_name: SimiloDlcEnum.History,
        url: '/assets/similo/similo-history.png',
        url_back: '/assets/similo/similo-history-back.png',
        backgroundSize: '400% 800%',
        cards: new Array(32).fill(0).map((_, i) => {
            const card: SimiloCardBaseConfig = {
                name: '',
                description: '',
                row: Math.floor(i / 4),
                column: i % 4
            };
            return card;
        })
    },
    {
        name: 'Мифы',
        description: 'О богах и героях',
        dlc_name: SimiloDlcEnum.Myths,
        url: '/assets/similo/similo-myths.png',
        url_back: '/assets/similo/similo-myths-back.png',
        backgroundSize: '400% 800%',
        cards: new Array(30).fill(0).map((_, i) => {
            const card: SimiloCardBaseConfig = {
                name: '',
                description: '',
                row: Math.floor(i / 4),
                column: i % 4
            };
            return card;
        })
    },
    {
        name: 'Сказки',
        description: 'Ложь, да в них намёк',
        dlc_name: SimiloDlcEnum.Fables,
        url: '/assets/similo/similo-fables.png',
        url_back: '/assets/similo/similo-fables-back.png',
        backgroundSize: '400% 800%',
        cards: new Array(30).fill(0).map((_, i) => {
            const card: SimiloCardBaseConfig = {
                name: '',
                description: '',
                row: Math.floor(i / 4),
                column: i % 4
            };
            return card;
        })
    },
    {
        name: 'Страшилки',
        description: 'Вычислите опасного монстра',
        dlc_name: SimiloDlcEnum.Spookies,
        url: '/assets/similo/similo-spookies.png',
        url_back: '/assets/similo/similo-spookies-back.png',
        backgroundSize: '400% 800%',
        cards: new Array(30).fill(0).map((_, i) => {
            const card: SimiloCardBaseConfig = {
                name: '',
                description: '',
                row: Math.floor(i / 4),
                column: i % 4
            };
            return card;
        })
    },
]

export const getCardsByDlcDeck = (dlс: SimiloDlcEnum, position: SimiloCardPosition) => {
    const deck = SimiloDlcDeckList.find(p => p.dlc_name === dlс);
    if (deck == null) {
        return [];
    }
    const { cards, ...info } = deck;
    const result = cards.map(card => {
        const config: SimiloCardConfig = {
            ...card,
            ...info,
            id: `${info.dlc_name}_${card.row}_${card.column}`,
            index: 0,
            position,
            isOpen: false,
            isSearchable: false,
        };
        return config;
    });
    console.log('getCardsByDlcDeck', {
        dlс,
        deck,
        result,
    });
    return simpleShuffle(result);
}

export const simpleShuffle = <T = any>(list: T[]) => {
    return list.sort(() => Math.random() - 0.5);
}
