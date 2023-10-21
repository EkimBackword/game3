export enum SimiloDlcEnum {
    Animals = 'Animals',
    WildAnimals = 'WildAnimals',
    HarryPotter = 'HarryPotter',
    History = 'History',
    Myths = 'Myths',
    Fables = 'Fables',
    Spookies = 'Spookies',
}

export enum SimiloCardPosition {
    Board,
    Deck,
    Hand,
    Similar,
    NotSimilar,
}

export interface SimiloDlcInfo {
    name: string;
    description: string;
    dlc_name: SimiloDlcEnum;
    url: string;
    url_back: string;
    /** Масштаб одной карты ко всему спрайту 1000% 700% */
    backgroundSize: string;
}

export interface SimiloDlcDeck extends SimiloDlcInfo {
    cards: SimiloCardBaseConfig[];
}

export interface SimiloCardNames {
    name: string;
    description: string;
}

export interface SimiloCardBaseConfig extends SimiloCardNames {
    row: number;
    column: number;
}

export interface SimiloCardConfig extends SimiloDlcInfo, SimiloCardBaseConfig {
    id: string;
    index: number;
    position: SimiloCardPosition;
    isOpen: boolean;
    isSearchable: boolean;
}