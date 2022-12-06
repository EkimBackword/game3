import { ClankCardPointInfo } from './clank-card.types';
import {
  ClankCostInfo,
  ClankDlcEnum,
} from './clank-info.types';

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
    /** Выгода */
    benefit?: ClankCostInfo;
    /** Победные очки */
    points?: ClankCardPointInfo;
}

export interface ClankArtifactConfig extends ClankArtifactShortConfig, ClankArtifactGroup {
    /** Идентификатор */
    id: string;
}