import {
  ClankCostInfo,
  ClankDlcEnum,
  ClankElementType,
} from './clank-info.types';

export enum ClankMapConfigIds {
    clank_1,
    clank_2,
    clank_sunken_treasures_1,
    clank_sunken_treasures_2,
    clank_proklyatie_mumii_1,
    clank_proklyatie_mumii_2,
    clank_expeditions_goldand_silk_1,
    clank_expeditions_goldand_silk_2,
    clank_temple_of_the_ape_lords_1,
    clank_temple_of_the_ape_lords_2,
    clank_adventuring_party_1,
    clank_adventuring_party_2,
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
}

export interface ClankMapDragonInfo {
    url: string;
    maxRage: number;
    track: ClankMapDragonTrackItem[];
}

export interface ClankMapDragonTrackItem {
    rage: number;
    position: ClankMapPositionInfo;
    startUserCount: number;
    clank: number;
    effect?: ClankMapDragonTrackEffect;
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
    items?: Partial<Record<ClankElementType, ClankMapElementItem>>;
}

export interface ClankMapElementItem {
    count: number;
    value?: number;
}

export interface ClankMapElementLink {
    element_id: number;
    cost: ClankCostInfo;
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