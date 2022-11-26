import { ClankCardPointInfo } from './clank-card.types';
import {
  ClankCostInfo,
  ClankDlcEnum,
  ClankElementType,
} from './clank-info.types';

export enum ClankTokenTypeEnum {
    map,
    market,
    secret,
    bonus,
}

export enum ClankTokenSecretTypeEnum {
    minor = 'minor',
    major = 'major',
}

export interface ClankTokenGroupShortInfo {
    dlc_name: ClankDlcEnum;
    type: ClankTokenTypeEnum;
}

export interface ClankTokenGroup extends ClankTokenGroupShortInfo {
    tokens: ClankTokenShortConfig[];
    url: string;
}

export interface ClankTokenState extends ClankTokenGroupShortInfo {
    id: string;
    element_type: ClankElementType;
}

export interface ClankTokenShortConfig {
    /** index */
    index: number
    /** Колличество в игре */
    count: number
    /** Имя */
    name: string;
    /** Тип элемента */
    element_type: ClankElementType;
    /** Имя */
    url: string;
    /** Победные очки */
    points?: ClankCardPointInfo;
    /** Нужно ли получить выгоду немедленно или можно сохранить */
    isImmediatelyBenefit?: boolean;
    /** Выгода */
    benefit?: ClankCostInfo;
    /** Выгода */
    cost?: ClankCostInfo;
    /** Нужно ли получить выгоду немедленно или можно сохранить */
    secret_type?: ClankTokenSecretTypeEnum;
    /** Нужно ли получить выгоду немедленно или можно сохранить */
    isSquare?: ClankTokenSecretTypeEnum;
}

export interface ClankTokenConfig extends ClankTokenShortConfig, ClankTokenState {
    /**
     * Строка для поиска карты в репозитории
     * @description ${config.dlc_name}_${start_index}
     */
    find_string: string;
    /** Индекс копии */
    copy_index: number;
}
