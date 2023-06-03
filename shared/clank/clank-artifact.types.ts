import { ClankCardPointInfo } from './clank-card.types';
import { ClankDlcEnum } from './clank-info.types';

export interface ClankArtifactGroup {
    dlc_name: ClankDlcEnum;
    url: string;
}

export enum ClankArtifactQualityTypeEnum {
    gold = 'gold',
    silver = 'silver',
}

export interface ClankArtifactQuality {
    name: string;
    type: ClankArtifactQualityTypeEnum
    value: number;
    url: string;
}

export const ClankArtifactQualityMap: Record<ClankArtifactQualityTypeEnum, ClankArtifactQuality> = {
    [ClankArtifactQualityTypeEnum.gold]: {
        name: 'Золотой',
        type: ClankArtifactQualityTypeEnum.gold,
        value: 1,
        url: '',
    },
    [ClankArtifactQualityTypeEnum.silver]: {
        name: 'Серебряный',
        type: ClankArtifactQualityTypeEnum.silver,
        value: 0,
        url: '/adventuring_party',
    },
}

export interface ClankArtifactShortConfigWithoutQuality {
    /** Имя */
    name: string;
    /** Для поиска позиции на карте */
    value: number;
    /** Имя */
    url: string;
    /** Победные очки */
    points: ClankCardPointInfo;
}

export interface ClankArtifactShortConfig extends ClankArtifactShortConfigWithoutQuality {
    /** Качестов (золотой или серебряный) */
    quality: ClankArtifactQuality;
}

export interface ClankArtifactConfig extends ClankArtifactShortConfig, ClankArtifactGroup {
    /** Идентификатор */
    id: string;
}