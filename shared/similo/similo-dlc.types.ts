export enum SimiloDlcEnum {
    WildAnimals = 'WildAnimals',
    HarryPotter = 'HarryPotter',
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
    dlc_name: SimiloDlcEnum;
    url: string;
    url_back: string;
    /** Масштаб одной карты ко всему спрайту 1000% 700% */
    backgroundSize: string;
}

export interface SimiloDlcDeck extends SimiloDlcInfo {
    cards: SimiloCardBaseConfig[];
}

export interface SimiloCardBaseConfig {
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