import { ClankCardPointInfo } from './clank-card.types';
import { ClankDlcEnum } from './clank-info.types';

export interface ClankArtifactGroup {
    dlc_name: ClankDlcEnum;
    url: string;
}

export interface ClankArtifactShortConfig {
    /** Имя */
    name: string;
    /** Для поиска позиции на карте */
    value: number;
    /** Имя */
    url: string;
    /** Победные очки */
    points?: ClankCardPointInfo;
}

export interface ClankArtifactConfig extends ClankArtifactShortConfig, ClankArtifactGroup {
    /** Идентификатор */
    id: string;
}