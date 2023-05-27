import {
  ClankCostInfo,
  ClankDlcEnum,
  ClankElementType,
} from './clank-info.types';
import { ClankMapMumiaZoneTypeEnum } from './clank-mumia.types';

export enum ClankMapConfigIds {
    clank_1 = 1,
    clank_2 = 2,
    clank_sunken_treasures_1 = 3,
    clank_sunken_treasures_2 = 4,
    clank_proklyatie_mumii_1 = 5,
    clank_proklyatie_mumii_2 = 6,
    clank_expeditions_goldand_silk_1 = 7,
    clank_expeditions_goldand_silk_2 = 8,
    clank_temple_of_the_ape_lords_1 = 9,
    clank_temple_of_the_ape_lords_2 = 1,
    clank_adventuring_party_1 = 11,
    clank_adventuring_party_2 = 12,
}

export interface ClankMapConfig {
    id: ClankMapConfigIds;
    dlc_id: ClankDlcEnum;
    name: string;
    url: string;
    width: number;
    height: number;
    dragonInfo: ClankMapDragonInfo;
    elements: ClankMapElementConfig[];
    mumiaInfo?: ClankMapMumiaInfo;
}

export interface ClankMapDragonInfo {
    url: string;
    clankAria: ClankMapPositionInfo;
    track: ClankMapDragonTrackItem[];
    endGameTrack: ClankMapDragonEndGameTrackItem[];
}

export interface ClankMapMumiaInfo {
    url: string;
    card_find_string: string;
    zones: ClankMumiaMapZone[];
}

export interface ClankMumiaMapZone {
    /** Идентификатор зоны */
    zone: ClankMapMumiaZoneTypeEnum;
    /** Расположение */
    position: ClankMapPositionInfo;
}

export interface ClankMumiaEvents {
    description: string;
    cost?: ClankCostInfo;
    benefit?: ClankCostInfo;
    removeHalfOfTheCurse: boolean;
}

export interface ClankMapDragonTrackItem {
    rage: number;
    position: ClankMapPositionInfo;
    startUserCount: number;
    canIncreaseRageByUserCount?: number;
    clank: number;
    effect?: ClankMapDragonTrackEffect;
}

export interface ClankMapDragonEndGameTrackItem {
    index: number;
    position: ClankMapPositionInfo;
    clank: number;
    isFinish: boolean;
}

export interface ClankMapPositionInfo {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ClankMapDragonTrackEffect {
    display: boolean;
    value: ClankMapDragonTrackEffectValue;
}

export enum ClankMapDragonTrackEffectValue {
}

export interface ClankMapElementConfig {
    /** Идентификатор */
    id: number;
    /** Расположение */
    position: ClankMapPositionInfo;
    /** Св */
    links: ClankMapElementLink[];
    /** */
    fragment?: ClankMapFragment;
    /** */
    isStart?: boolean;
    /** */
    isDungeon?: boolean;
    /** */
    isCrystalCave?: boolean;
    /** */
    isMarket?: boolean;
    /** */
    mumiaZoneType?: ClankMapMumiaZoneTypeEnum;
    /** */
    items?: Partial<Record<ClankElementType, ClankMapElementItem>>;
}

export interface ClankMapElementItem {
    count: number;
    value?: number;
}

export interface ClankMapElementLink {
    element_id: number;
    cost: ClankCostInfo;
    benefit?: ClankCostInfo;
}

export interface ClankMapFragmentLink {
    fragment_id: number;
    enter_id: number;
}

/** Нужно для дополнения храм обезьян */
export interface ClankMapFragment {
    id: number;
    position: ClankMapPositionInfo;
    states: ClankMapFragmentState[];
    currentState: ClankMapFragmentState;
}

export interface ClankMapFragmentState {
    id: number;
    links: ClankMapFragmentStateLink[];
}

export interface ClankMapFragmentStateLink extends ClankMapElementLink {
    enter_id: number;
}