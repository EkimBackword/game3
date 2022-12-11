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
    isSquare?: boolean;
}

export interface ClankTokenGroup extends ClankTokenGroupShortInfo {
    tokens: ClankTokenShortConfig[];
    url: string;
}

export interface ClankTokenShortConfig {

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
    isSquare?: boolean;
}

export interface ClankTokenConfig extends ClankTokenShortConfig, ClankTokenGroupShortInfo {
    /** Идентификатор */
    id: string;
    /** index */
    index: number
    /** Индекс копии */
    copy_index: number;
}
