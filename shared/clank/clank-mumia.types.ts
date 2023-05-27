import { ClankMapMumiaInfo } from './clank-map.types';

export enum ClankMapMumiaZoneTypeEnum {
    Sun = 'sun',
    Axe = 'axe',
    Chair = 'chair',
    Snake = 'snake',
}

export const clankMapMumiaZoneTypes: Record<ClankMapMumiaZoneTypeEnum, {
    zone: ClankMapMumiaZoneTypeEnum;
    name: string;
}> = {
    [ClankMapMumiaZoneTypeEnum.Sun]: {
        zone: ClankMapMumiaZoneTypeEnum.Sun,
        name: 'Солнце',
    },
    [ClankMapMumiaZoneTypeEnum.Axe]: {
        zone: ClankMapMumiaZoneTypeEnum.Axe,
        name: 'Топор',
    },
    [ClankMapMumiaZoneTypeEnum.Chair]: {
        zone: ClankMapMumiaZoneTypeEnum.Chair,
        name: 'Стул',
    },
    [ClankMapMumiaZoneTypeEnum.Snake]: {
        zone: ClankMapMumiaZoneTypeEnum.Snake,
        name: 'Змея',
    },
}

export interface ClankMumiaInfo {
    /** Зона в которой находится мумия */
    zone: ClankMapMumiaZoneTypeEnum;
}

export interface ClankMumiaPositionInfo {
    mumiaInfo: ClankMumiaInfo;
    mapMumiaInfo?: ClankMapMumiaInfo;
    style: Partial<CSSStyleDeclaration>;
    tooltip: string;
    canUse: boolean;
}

export const initClankMumiaInfo = () => {
    const data: ClankMumiaInfo = {
        zone: ClankMapMumiaZoneTypeEnum.Chair,
    };
    return data;
}