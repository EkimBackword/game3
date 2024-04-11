export const RelicHuntersRelicSettings = {
    size: 200,
    url: '/assets/relic-hunters/relic.png',
    backgroundSize: '500% 100%',
}

export enum RelicHuntersRelicTypeEnum {
    Wheel = 'Wheel',
    Dagger = 'Dagger',
    Shield = 'Shield',
    Cup = 'Cup',
    Crown = 'Crown',
}

export interface RelicHuntersRelicTypeInfo {
    name: string;
    column: number;
}

export const RelicHuntersRelicTypeTaxonomy: Record<RelicHuntersRelicTypeEnum, RelicHuntersRelicTypeInfo> = {
    [RelicHuntersRelicTypeEnum.Wheel]: {
        name: 'Wheel',
        column: 0,
    },
    [RelicHuntersRelicTypeEnum.Dagger]: {
        name: 'Dagger',
        column: 1,
    },
    [RelicHuntersRelicTypeEnum.Shield]: {
        name: 'Shield',
        column: 2,
    },
    [RelicHuntersRelicTypeEnum.Cup]: {
        name: 'Cup',
        column: 3,
    },
    [RelicHuntersRelicTypeEnum.Crown]: {
        name: 'Crown',
        column: 4,
    },
}
